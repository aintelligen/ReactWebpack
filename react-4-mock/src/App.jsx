import React from 'react'
import Routes from './router'
// import { createStore } from './store'
import { createStore } from 'redux'
import themeReducer from './reducers'
// import { Provider } from '$src/redux';
import { Provider } from 'react-redux';

const store = createStore(themeReducer)
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Routes></Routes>
      </Provider>
    )
  }
}





