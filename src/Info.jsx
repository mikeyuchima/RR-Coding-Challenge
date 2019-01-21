import React from "react";

const Info = props => {
  // Driver data
  const { x, y, legProgress, activeLegID, timeRemaining } = props.driver;
  let message;
  if (legProgress === 100) message = "At Destination";
  return (
    <div>
      <div className="info">
        <h4 className="info-title">Driver's Location</h4>
        <p>X: {x}</p>
        <p>Y: {y}</p>
        <p>Current Leg: {activeLegID}</p>
        <p>Est to Destination: {timeRemaining}</p>
        <p>Progress Bar:</p>
        <progress value={legProgress} max="100" />
        {message}
      </div>
    </div>
  );
};

export default Info;
