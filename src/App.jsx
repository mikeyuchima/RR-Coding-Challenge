import React, { Component } from "react";
import "./App.css";
import Grids from "./Grids";

class App extends Component {
  constructor() {
    super();

    this.state = {
      legs: {},
      stops: {},
      completed_legs: {},
      driver: {}
    };
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    // Setup the WebSocket client
    this.socket = new WebSocket("ws://localhost:8080/websocket");

    // Handle when the socket opens (i.e. is connected to the server)
    this.socket.addEventListener("open", evt => {
      console.log("Connected to websocket server");
      const request_stops = { type: "RequestStops" };
      this.socket.send(JSON.stringify(request_stops));
      const request_driver = { type: "RequestDriver" };
      this.socket.send(JSON.stringify(request_driver));
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
          const stops = pkg.data;
          console.log(pkg.data);
          this.setState({ stops });
          break;
        case "IncomingDriver":
          const driver = pkg.data;
          console.log("got driver");
          this.setState({ driver });
          break;
        case "IncomingCompletedLegs":
          const completed_legs = pkg.data;
          console.log("got completed legs");
          this.setState({ completed_legs });
          break;
        default:
          throw new Error("Unknown event type " + pkg.type);
      }
    });
  }
  render() {
    return (
      <div>
        {<Grids stops={this.state.stops} driver_location={this.state.driver} />}
      </div>
    );
  }
}

export default App;
