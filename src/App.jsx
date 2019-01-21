import React, { Component } from "react";
import "./App.css";
import Grids from "./Grids";
import Info from "./Info";
import Driver from "./Driver";
import { Row, Col } from "react-bootstrap";

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

  coordinate = () => {
    const { stops } = this.state;
    let coord = {};
    for (var stop in stops) {
      if (coord[stops[stop].x + "_" + stops[stop].y]) {
        coord[stops[stop].x + "_" + stops[stop].y] =
          coord[stops[stop].x + "_" + stops[stop].y] + stop;
      } else coord[stops[stop].x + "_" + stops[stop].y] = stop;
    }
    return coord;
  };

  sendLocation = data => {
    data.type = "RequestUpdate";
    this.socket.send(JSON.stringify({ data }));
  };

  componentDidMount() {
    console.log("componentDidMount");
    // Setup the WebSocket client
    this.socket = new WebSocket("ws://localhost:8080/websocket");

    // Handle when the socket opens (i.e. is connected to the server)
    this.socket.addEventListener("open", evt => {
      console.log("Connected to websocket server");
      this.socket.send(JSON.stringify({ type: "RequestStops" }));
      this.socket.send(JSON.stringify({ type: "RequestDriver" }));
      this.socket.send(JSON.stringify({ type: "RequestCompletedLegs" }));
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
        <h1>Rose Rocket</h1>
        <Row className="show-grid">
          <Col xs={6} md={4}>
            {/* <Info /> */}
          </Col>
          <Col xs={6} md={4}>
            <Grids
              stops={this.coordinate()}
              driver_location={this.state.driver}
              completed_legs={this.state.completed_legs}
            />
          </Col>
          <Col xsHidden md={4}>
            <Driver sendLocation={this.sendLocation} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
