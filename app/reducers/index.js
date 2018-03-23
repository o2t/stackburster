// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as toastr} from 'react-redux-toastr';

import sunburst from './sunburst';

const rootReducer = combineReducers({
  router,
  sunburst,
  toastr,
});

export default rootReducer;
