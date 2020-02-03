import React from 'react';
import Navigator from './navigation/Navigator';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import appReducer from './reducers/appReducer';

export default class App extends React.Component {
  reducer = combineReducers({
    appReducer
  });

  store = createStore(this.reducer);

  render () {
    return (
      <Provider store={this.store}>
        <Navigator/>
      </Provider>
    )
  }
}
