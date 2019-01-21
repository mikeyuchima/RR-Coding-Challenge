import React from "react";
import { ProgressBar, now, label } from "react-bootstrap";

const Info = props => {
  const { x, y, legProgress, activeLegID } = props.driver;
  return (
    <div className="info">
      <h4 className="info-title">Driver's Location</h4>
      <p>X: {x}</p>
      <p>Y: {y}</p>
      <p>Current Leg: {activeLegID}</p>
      <p>Progress Bar:</p>
      <progress value={legProgress} max="100" />
    </div>
  );
};

export default Info;
