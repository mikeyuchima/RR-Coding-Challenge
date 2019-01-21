import React from "react";
import { ProgressBar, now, label } from "react-bootstrap";

const Info = props => {
  const { x, y, legProgress, activeLegID } = props.driver;
  return (
    <div>
      <h2>Driver's Location</h2>
      <ul style={{ listStyleType: "none" }}>
        <li>X: {x}</li>
        <li>Y: {y}</li>
        <li>Current Leg: {activeLegID}</li>
        <li>Progress Bar:</li>
        <li>
          <progress value={legProgress} max="100" />
        </li>
      </ul>
    </div>
  );
};

export default Info;
