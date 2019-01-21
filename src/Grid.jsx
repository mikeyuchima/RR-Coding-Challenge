import React from "react";

const Grid = props => {
  let icon = "";
  let { stops, x, y, driver_location, completed_legs } = props;

  if (stops[x + "_" + y]) {
    icon = stops[x + "_" + y];
  } else if (driver_location.x === x && driver_location.y === y) {
    icon = "🚗";
  }
  if (completed_legs[stops[x + "_" + y]])
    return (
      <div className="box" style={{ backgroundColor: "yellow" }}>
        {icon}
      </div>
    );
  else return <div className="box">{icon}</div>;
};

export default Grid;
