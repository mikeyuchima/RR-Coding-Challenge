import React from "react";

const Grid = props => {
  let icon = "";
  let { stops, x, y, driver_location, completed_legs } = props;
  // If Driver is on current cell
  if (parseInt(driver_location.x) === x && parseInt(driver_location.y) === y) {
    icon = "🚗";
    // If a stop is on current cell
  } else if (stops[x + "_" + y]) {
    icon = stops[x + "_" + y];
  }
  // If the stop have been completed, it highlights the cell
  if (completed_legs[stops[x + "_" + y]])
    return (
      <div className="box" style={{ backgroundColor: "green" }}>
        {icon}
      </div>
    );
  //default return
  else return <div className="box">{icon}</div>;
};

export default Grid;
