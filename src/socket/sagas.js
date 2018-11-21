import { takeEvery, takeLatest } from 'redux-saga/effects'
import { SEND_MESSAGE, START_CONNECTION, END_CONNECTION } from './types'
import SocketManager from './websocket'

var socketManager = null

function * sendMessage (action) {
  yield socketManager.ws.send(action.message)
}

function * startConnection (action) {
  yield socketManager.connect(action.url)
}

function * endConnection () {
  yield socketManager.disconnect()
}

export default function * rootSaga (dispatch) {
  socketManager = new SocketManager(dispatch)
  yield takeLatest(START_CONNECTION, startConnection)
  yield takeLatest(END_CONNECTION, endConnection)
  yield takeEvery(SEND_MESSAGE, sendMessage)
}
