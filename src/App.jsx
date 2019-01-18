import React, { Component } from "react";
import "./App.css";
import Grids from "./Grids";

class App extends Component {
  constructor() {
    super();

    this.state = {
      legs: {},
      stops: {},
      completed_legs: [],
      driver_location: ""
    };
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    // Setup the WebSocket client
    this.socket = new WebSocket("ws://localhost:8080/websocket");

    // Handle when the socket opens (i.e. is connected to the server)
    this.socket.addEventListener("open", evt => {
      console.log("Connected to websocket server");
      const payload = { type: "RequestStops" };
      this.socket.send(JSON.stringify(payload));
    });

    // Handle messages using `this.receiveMessage`
    this.socket.addEventListener("message", evt => {
      const pkg = JSON.parse(evt.data);

      //switch statement to select type of message
      switch (pkg.type) {
        case "IncomingLegs":
          const legs = pkg.data;
          console.log("got legs");
          this.setState({ legs });
          break;
        case "IncomingStops":
          console.log(pkg.data);
          const stops = pkg.data;
          this.setState({ stops });
          break;
        case "IncomingDriverLocation":
          break;
        default:
          throw new Error("Unknown event type " + pkg.type);
      }
    });
  }
  render() {
    return (
      <div>
        {
          <Grids
            stops={this.state.stops}
            driver_location={this.state.driver_location}
          />
        }
      </div>
    );
  }
}

export default App;
