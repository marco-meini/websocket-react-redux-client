import { SEND_MESSAGE, RECEIVE_MESSAGE, START_CONNECTION, END_CONNECTION, CONNECTION_STATE, ON_ERROR, CLEAR_MESSAGES } from './types'

export const startConnection = (url) => ({type: START_CONNECTION, url})
export const endConnection = () => ({type: END_CONNECTION})
export const connectionState = (readyState) => ({type: CONNECTION_STATE, readyState})
export const onError = (error, readyState) => ({type: ON_ERROR, error, readyState})
export const sendMessage = (message) => ({type: SEND_MESSAGE, message})
export const receiveMessage = (message) => ({type: RECEIVE_MESSAGE, message})
export const clearMessages = () => ({type: CLEAR_MESSAGES})
