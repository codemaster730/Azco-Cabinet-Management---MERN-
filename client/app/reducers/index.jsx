import { combineReducers } from 'redux'
import events from './events'
import auth from './auth'

const rootReducer = combineReducers({
    events,
    auth
});

export default rootReducer;