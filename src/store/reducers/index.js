import { combineReducers } from 'redux';

import user from './user';
import chat from './chat';

const reducers = combineReducers({
  user,
  chat,
});

export default reducers;
