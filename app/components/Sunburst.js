// @flow
import React, {Component} from 'react';
import styles from './Sunburst.css';
import {Sunburst as SunburstVis, LabelSeries } from 'react-vis';
import {stackNodeType} from "../reducers/sunburst";
import classNames from "classnames";
import {ParentSize} from "@vx/responsive";
import type {stackNodeMapType} from "../reducers/sunburst";
import { clipboard } from "electron";
import {toastr} from "react-redux-toastr";

type Props = {
  +data: stackNodeType,
  +loadStacks: (sampleData: stackNodeType) => void,
  +loadMedia: (media: DataTransfer) => void,
}

const LABEL_STYLE = {
  fontSize: '14px',
  textAnchor: 'middle',
  fill: 'white',
  alignmentBaseline: 'middle',
};

function getPath(node: stackNodeMapType) {
  if (node.data)
    node = node.data;

  let path = [];
  let cur = node;
  while (cur) {
    const name = cur.name || cur.data.name;
    if (name != 'root')
      path.push (name);

    cur = cur.parent;
  }

  path = path.reverse ();

  cur = node;
  while (cur.children && cur.children.length > 0) {
    cur = cur.children[0];
    path.push (cur.name);
  }

  return path.reverse();
}

export default class Sunburst extends Component<Props> {

  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      draggedOver: 0,
    };
  }

  setDraggedOver(incrementDraggedOver) {
    let {draggedOver} = this.state;
    draggedOver += incrementDraggedOver ? 1 : -1;
    this.setState({
      ...this.state,
      draggedOver,
    })
  }

  render() {
    const {data, loadStacks, loadMedia, parentWidth, parentHeight} = this.props;
    const {draggedOver} = this.state;
    const preventDefault = (prevent, draggedOver) => e => {
      if (draggedOver !== undefined)
        this.setDraggedOver(draggedOver);

      if (prevent)
        e.preventDefault();

      return !prevent;
    };

    const drop = e => {
      loadMedia(e.dataTransfer);
      return preventDefault(true, false)(e);
    };

    const valueClicked = (node) => {
      const path = getPath(node);
      clipboard.writeText (path.join("\n"));
      toastr.info ('Stack was copied to the clipboard');
    };

    const size = Math.min(parentHeight, parentWidth);
    return (
      <div className={styles.container}>
        <div
          className={classNames(styles.sunburst, {[styles.sunburstOver]: draggedOver > 0})}
          onDragEnter={preventDefault(false, true)}
          onDragOver={preventDefault(true)}
          onDragLeave={preventDefault(true, false)}
          onDragEnd={preventDefault(true)}
          onDrop={drop}
        >
          <ParentSize>
            {
              parent => (
                <SunburstVis
                  animation={{damping: 50, stiffness: 600}}
                  hideRootNode
                  data={data}
                  height={parent.height}
                  width={parent.width}
                  getSize={d => d.size}
                  colorType={"literal"}
                  style={{
                    stroke: '#ddd',
                    strokeOpacity: 0.3,
                    strokeWidth: '0.5'
                  }}

                  onValueClick={ valueClicked }
                >
                  <LabelSeries data={[{
                    x:0, y: 0, label: data.count, style: LABEL_STYLE
                  }]}/>
                </SunburstVis>
              )
            }
          </ParentSize>
        </div>
      </div>
    );
  }
}
