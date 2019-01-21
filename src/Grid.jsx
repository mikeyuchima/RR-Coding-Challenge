import React from "react";

const Grid = props => {
  let icon = "";
  let { stops, x, y, driver_location, completed_legs } = props;

  if (parseInt(driver_location.x) === x && parseInt(driver_location.y) === y) {
    icon = "🚗";
  } else if (stops[x + "_" + y]) {
    icon = stops[x + "_" + y];
  }
  if (completed_legs[stops[x + "_" + y]])
    return (
      <div className="box" style={{ backgroundColor: "green" }}>
        {icon}
      </div>
    );
  else return <div className="box">{icon}</div>;
};

export default Grid;
