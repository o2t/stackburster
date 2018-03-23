// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import ReduxToastr from 'react-redux-toastr'
import Routes from '../routes';

type Props = {
  store: {},
  history: {}
};

export default class Root extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <div className={"fullscreen"}>
          <ReduxToastr
            timeOut={4000}
            newestOnTop={false}
            preventDuplicates
            position="bottom-right"
            transitionIn="fadeIn"
            transitionOut="fadeOut"
          />

          <ConnectedRouter history={this.props.history}>
            <Routes />
          </ConnectedRouter>
        </div>
      </Provider>
    );
  }
}
