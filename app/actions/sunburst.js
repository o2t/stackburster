// @flow
import type { stackNodeMapType, stackNodeType } from '../reducers/sunburst';
import { convertMap } from '../reducers/sunburst';

type actionType = {
  +type: string
};

type stackType = {
  +frames: Array<string>
};

export const LOAD_STACKS = 'LOAD_STACKS';

export function loadStacks (stacks: stackNodeType) {
  return {
    type: LOAD_STACKS,
    stacks,
  };
}

function parseStacks (stacksList: Array<string>): stackNodeType  {
  function newStack (): stackType {
    return {
      frames: [],
    }
  }

  function createStacks (): Array<stackType> {
    let current: ?stackType;
    const into: Array<stackType> = [];
    let prev = null;

    function flush () {
      if (!! current) {
        into.push(current);
        current = null;
        prev = null;
      }
    }

    const monoline: RegExp = /\"([^\"]+)((?:\s+at\s+[^\s]+)+\s*)\"/g;

    for (var i in stacksList) {
      const stacks: string = stacksList[i];
      const lines: Array<string> = stacks.split("\n");
      for (var j in lines) {
        const line: string = lines[j];
        if (line.match (/^\s*at\s+.*$/)) {
          if (! current) {
            current = newStack();
            if (prev)
              current.frames.push (prev);
          }

          current.frames.push(line);
        } else {
          const m = monoline.exec(line);
          if (m) {
            flush();
            current = newStack();
            const subframe = m[1].split(/\s+at\s+/);
            current.frames.push (subframe[0]);
            current.frames.push (...(subframe.slice(1).map(s => `\tat ${s}`)));
          }

          flush();
        }

        prev = line;
      }

      flush();
    }

    return into;
  }

  function newNode (name: string): stackNodeMapType {
    return {
      name,
      size: 0,
      count: 0,
    }
  }

  function getOrCreateChildNode (parent: stackNodeMapType, name: string): stackNodeMapType {
    let { children } = parent;
    if (children === undefined)
      parent.children = children = {};

    let child: ?stackNodeMapType = children[name];
    if (child === undefined)
      children[name] = child = newNode(name);

    return child;
  }

  const into = createStacks();
  const root: stackNodeMapType = newNode ("root");

  for (var i in into) {
    const current: stackType = into[i];
    let curnode: stackNodeMapType = root;
    curnode.count ++;
    let frames = current.frames.reverse();
    for (var j in frames) {
      const frame: string = frames[j];
      curnode = getOrCreateChildNode(curnode, frame);
      curnode.size ++;
      curnode.count ++;
    }
  }

  return convertMap (root);
}

export function loadMedia (media: DataTransfer) {
  return (dispatch: (action: actionType) => void) => {
    Promise.all ([...media.files].map (f => new Promise (resolve => {
      const reader = new FileReader ();
      reader.onload = e => resolve (e.target.result);
      reader.readAsText (f);
    }))).then((text: Array<string>) => {
      dispatch (loadStacks(parseStacks(text)));
    });
  }
}
