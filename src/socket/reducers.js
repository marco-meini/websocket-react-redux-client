import {
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  CONNECTION_STATE,
  ON_ERROR,
  CLEAR_MESSAGES
} from "./types";

const initialState = {
  readyState: null,
  error: null,
  frames: []
};

const websocket = (state = initialState, action = {}) => {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        ...state,
        frames: state.frames.concat({
          incoming: false,
          message: action.message
        })
      };
    case RECEIVE_MESSAGE:
      return {
        ...state,
        frames: state.frames.concat({
          incoming: true,
          message: action.message
        })
      };
    case CONNECTION_STATE:
      return {
        ...state,
        readyState: action.readyState,
        error: action.readyState === 2 ? null : state.error
      };
    case ON_ERROR:
      return {
        ...state,
        readyState: action.readyState,
        error: action.error
      };
    case CLEAR_MESSAGES:
      return {
        ...state,
        frames: []
      };
    default:
      return state;
  }
};

export default websocket;
