import { receiveMessage, connectionState, onError } from "./actions";

var reconnectIntervall = 0;
const MAX_ATTEMPTS = 100;

class SocketManager {
  ws;
  attempts = 0;
  dispatch;
  tryToReconnect = true;

  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  connect(url) {
    this.ws = new WebSocket(url);
    this.dispatch(connectionState(this.ws.readyState));

    this.ws.onopen = () => {
      this.dispatch(connectionState(this.ws.readyState));
      this.tryToReconnect = true;
      this.attempts = 0;
      if (reconnectIntervall) {
        clearInterval(reconnectIntervall);
        reconnectIntervall = 0;
      }
    };

    this.ws.onerror = error => {
      this.dispatch(onError(error, this.ws.readyState));
    };

    this.ws.onclose = () => {
      this.dispatch(connectionState(this.ws.readyState));
      if (this.tryToReconnect) {
        if (this.attempts >= MAX_ATTEMPTS && reconnectIntervall) {
          clearInterval(reconnectIntervall);
          reconnectIntervall = 0;
        }
        if (!reconnectIntervall && this.attempts < MAX_ATTEMPTS) {
          reconnectIntervall = setInterval(() => {
            if (!this.ws || this.ws.readyState === 3) {
              console.log(`attempt to reconnect ${this.attempts + 1}`);
              this.attempts += 1;
              this.connect(url);
            }
          }, 1000);
        }
      }
    };

    this.ws.onmessage = e => {
      if (e.data instanceof Blob) {
        console.log(e.data.size);
        let reader = new FileReader();
        reader.readAsText(e.data);
        reader.addEventListener("loadend", e => {
          const text = e.srcElement.result;
          if (text) this.dispatch(receiveMessage(text));
        });
      } else {
        console.log(Buffer.byteLength(e.data));
        this.dispatch(receiveMessage(e.data));
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.tryToReconnect = false;
      this.ws.close();
    }
  }
}

export default SocketManager;
