import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSagaWebSocket from './socket/sagas'
import { composeWithDevTools } from "redux-devtools-extension";
import websocket from './socket/reducers'
import './index.scss'
import App from './App'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  combineReducers({websocket}),
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)
sagaMiddleware.run(rootSagaWebSocket, store.dispatch)

ReactDOM.render(<Provider store={store}>
                  <App />
                </Provider>, document.getElementById('root'))
