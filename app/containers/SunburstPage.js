// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import Sunburst from "../components/Sunburst"
import * as SunburstActions from "../actions/sunburst";
import {connect} from "react-redux";

function mapStateToProps({ sunburst: data }) {
  return {
    data,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SunburstActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sunburst);
