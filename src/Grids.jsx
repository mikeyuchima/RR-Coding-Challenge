import React, { Component } from "react";
import "./Grid.css";
import Grid from "./Grid.jsx";

class Grids extends Component {
  createTable = () => {
    let table = [];

    // Outer loop to create parent
    for (let y = 0; y < 201; y++) {
      let children = [];
      //Inner loop to create children
      for (let x = 0; x < 201; x++) {
        children.push(
          <Grid
            x={x}
            y={y}
            stops={this.props.stops}
            driver_location={this.props.driver_location}
          />
        );
      }
      //Create the parent and add the children
      table.push(
        <section className="row">
          {children}
          <br />
        </section>
      );
    }
    return table;
  };

  render() {
    return <div className="map">{this.createTable()}</div>;
  }
}

export default Grids;
