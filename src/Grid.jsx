import React from "react";

const Grid = props => {
  let icon = "";
  let { stops, x, y, driver_location } = props;
  for (var stop in stops) {
    if (stops[stop].x === x && stops[stop].y === y) {
      icon = stop;
      console.log("ICON", icon);
    } else if (driver_location.x === x && driver_location.y === y) {
      // icon = <i class="fas fa-shuttle-van" alt="vehicle" />;
      icon = "*";
      console.log("CAR", x, y);
    }
  }
  return <div className="box">{icon}</div>;
};

export default Grid;
