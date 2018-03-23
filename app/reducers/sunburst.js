// @flow

import {LOAD_STACKS, PARSE_STACKS} from '../actions/sunburst';
import Color from "color";

export type stackNodeType = {
  +name: string,
  +color?: string,
  +size?: number,
  +count?: number,
  +children?: Array<stackNodeType>
}

type stackColorRange = {
  from: number,
  to: number,
}

export type stackNodeMapType = {
  +name: string,
  +size?: number,
  +count?: number,
  +children?: {
    [string]: stackNodeMapType,
  },
}

type actionType = {
  +type: string,
};

function parseStacks(stacks: string): stackNodeType {
  return JSON.parse(stacks);
}

export function convertMap (node: stackNodeMapType, colorRange: stackColorRange = { from: 0, to: 360 }): stackNodeType {
  const { name } = node;
  let { children: fromChildren, count } = node;
  const { from, to } = colorRange;
  let children;


  let size;
  if (fromChildren !== undefined) {
    fromChildren = Object.values (fromChildren);
    children = [];
    const step = (to - from) / fromChildren.length;
    let current = from;
    for (var i in fromChildren) {
      children.push (convertMap (fromChildren[i], {
        from: current,
        to: current + step,
      }));

      current += step;
    }
  } else {
    size = node.size;
  }

  const color = Color(`hsl(${(Math.trunc((to + from) / 2))}, 90%, 50%)`, 'hsl').hexString ();

  return {
    name,
    color,
    size,
    children,
    count,
  };
}

const defaultState2: stackNodeMapType = {
  "name": "analytics",
  "color": "#12939A",
  "children": {
    "cluster": {
      "name": "cluster",
      "children": {
        "AgglomerativeCluster": {"name": "AgglomerativeCluster", "color": "#12939A", "size": 3938},
        "CommunityStructure": {"name": "CommunityStructure", "color": "#12939A", "size": 3812},
        "HierarchicalCluster": {"name": "HierarchicalCluster", "color": "#12939A", "size": 6714},
        "MergeEdge": {"name": "MergeEdge", "color": "#12939A", "size": 743}
      }
    },
    "graph": {
      "name": "graph",
      "children": {
        "BetweennessCentrality": {"name": "BetweennessCentrality", "color": "#12939A", "size": 3534},
        "LinkDistance": {"name": "LinkDistance", "color": "#12939A", "size": 5731},
        "MaxFlowMinCut": {"name": "MaxFlowMinCut", "color": "#12939A", "size": 7840},
        "ShortestPaths": {"name": "ShortestPaths", "color": "#12939A", "size": 5914},
        "SpanningTree": {
          "name": "SpanningTree", "color": "#12939A", "size": 3416,
          "children": {
            "BetweennessCentrality": {"name": "BetweennessCentrality", "color": "#12939A", "size": 3534},
            "LinkDistance": {"name": "LinkDistance", "color": "#12939A", "size": 5731},
            "MaxFlowMinCut": {"name": "MaxFlowMinCut", "color": "#12939A", "size": 7840},
            "ShortestPaths": {"name": "ShortestPaths", "color": "#12939A", "size": 5914},
            "SpanningTree": {
              "name": "SpanningTree", "color": "#12939A", "size": 3416,
              "children": {
                "BetweennessCentrality": {"name": "BetweennessCentrality", "color": "#12939A", "size": 3534},
                "LinkDistance": {"name": "LinkDistance", "color": "#12939A", "size": 5731},
                "MaxFlowMinCut": {"name": "MaxFlowMinCut", "color": "#125693", "size": 7840},
                "ShortestPaths": {"name": "ShortestPaths", "color": "#12939A", "size": 5914},
                "SpanningTree": {"name": "SpanningTree", "color": "#34443", "size": 3416}
              }
            }
          }
        }
      }
    },
    "optimization": {
      "name": "optimization",
      "children": {
        "AspectRatioBanker": {"name": "AspectRatioBanker", "color": "#9A1293", "size": 7074}
      }
    }
  }
};


export default function stacks(state: stackNodeType = convertMap (defaultState2), action: actionType) {
  const {stacks} = action;
  switch (action.type) {
    case PARSE_STACKS:
      return parseStacks(stacks);
    case LOAD_STACKS:
      return stacks;
    default:
      return state;
  }
}
