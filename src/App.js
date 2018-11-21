import React, { Component } from "react";
import { connect } from "react-redux";
import {
  sendMessage,
  startConnection,
  endConnection,
  clearMessages
} from "./socket/actions";
import Octicon, { ArrowUp, ArrowDown } from "@githubprimer/octicons-react";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      url: "ws://"
    };
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.toggleConnection = this.toggleConnection.bind(this);
    this.send = this.send.bind(this);
  }

  handleSendMessage(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      text: e.target.value
    });
  }

  toggleConnection(e) {
    e.preventDefault();
    if (this.props.readyState === 1) {
      this.props.disconnect();
    } else if (this.state.url) {
      this.props.connect(this.state.url);
    }
  }

  send() {
    let text = this.state.text;
    this.setState(
      {
        text: ""
      },
      () => {
        this.props.sendMessage(text);
      }
    );
  }

  render() {
    var message = null;
    if (this.props.readyState !== null && this.props.readyState < 3) {
      let text = "";
      switch (this.props.readyState) {
        case 0:
          text = "CONNECTING";
          break;
        case 1:
          text = "CONNECTED";
          break;
        case 2:
          text = "CLOSING";
          break;
        default:
          text = "";
      }
      message = {
        className: "alert alert-success",
        text: text
      };
    } else if (this.props.error) {
      message = {
        className: "alert alert-danger",
        text: `Connection error: ${JSON.stringify(this.props.error)}`
      };
    } else {
      message = null;
    }

    return (
      <div className="App container mt-5">
        <div className="row">
          <div className="col-10">
            <div className="form-group">
              <input
                className="form-control"
                value={this.state.url}
                onChange={e => {
                  this.setState({ url: e.target.value });
                }}
                placeholder="Websocket url"
              />
            </div>
          </div>
          <div className="col-2">
            <div className="form-group">
              <button
                onClick={this.toggleConnection}
                className="btn btn-primary"
              >
                {this.props.readyState === 1 ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {message ? (
              <div className={message.className}>{message.text}</div>
            ) : null}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <textarea
                className="form-control"
                value={this.state.text}
                onChange={this.handleSendMessage}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button className="btn btn-primary" onClick={this.send}>
              Send a packet
            </button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col">
            <h4>Frames</h4>
          </div>
        </div>
        {this.props.frames && this.props.frames.length ? (
          <div className="row">
            <div className="col">
              <button
                className="btn btn-primary"
                onClick={() => {
                  this.props.clearMessages();
                }}
              >
                Clear
              </button>
            </div>
          </div>
        ) : null}
        <div className="row mt-2">
          <div className="col">
            <ul className={"list-group rounded border-1"}>
              {this.props.frames && this.props.frames.length ? (
                this.props.frames.map((frame, index) => {
                  return (
                    <li key={index} className="list-group-item">
                      <div
                        className={
                          frame.incoming
                            ? "d-inline mr-4 text-danger"
                            : "d-inline mr-4 text-success"
                        }
                      >
                        {frame.incoming ? (
                          <Octicon
                            icon={ArrowDown}
                            size="medium"
                            verticalAlign="middle"
                          />
                        ) : (
                          <Octicon
                            icon={ArrowUp}
                            size="medium"
                            verticalAlign="middle"
                          />
                        )}
                      </div>
                      <div className="d-inline align-middle">
                        "{frame.message}"
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="list-group-item">No messages received</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.websocket.error,
    readyState: state.websocket.readyState,
    frames: state.websocket.frames
  };
}

export default connect(
  mapStateToProps,
  {
    connect: startConnection,
    disconnect: endConnection,
    sendMessage: sendMessage,
    clearMessages: clearMessages
  }
)(App);
