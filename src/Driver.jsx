import React, { Component } from "react";
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Button
} from "react-bootstrap";
import Select from "react-select";

// Leg options to select
const options = [
  { value: "AB", label: "AB" },
  { value: "BC", label: "BC" },
  { value: "CD", label: "CD" },
  { value: "DE", label: "DE" },
  { value: "EF", label: "EF" },
  { value: "FG", label: "FG" },
  { value: "GH", label: "GH" },
  { value: "HI", label: "HI" },
  { value: "IJ", label: "IJ" },
  { value: "JK", label: "JK" },
  { value: "KL", label: "KL" }
];

class Driver extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      x: "",
      y: "",
      leg: ""
    };
  }
  // Validate input
  getValidationState_x() {
    const coord = Math.floor(this.state.x);
    if (coord < 201 && coord > -1) return null;
    else return "error";
  }
  // Validate input
  getValidationState_y() {
    const coord = Math.floor(this.state.y);
    if (coord < 201 && coord > -1) return null;
    else return "error";
  }
  // Insert into state
  handleSelect = leg => {
    this.setState({ leg });
  };
  // Insert into state
  handleChange = e => {
    this.setState({ x: e.target.value });
  };
  // Insert into state
  handleChange2 = e => {
    this.setState({ y: e.target.value });
  };
  // Form Submit
  handleSubmit = e => {
    e.preventDefault();
    const payload = this.state;
    if (payload.x && payload.y && payload.leg) {
      this.props.sendLocation(payload);
      this.setState({ x: "", y: "", leg: "" });
    } else alert("Invalid Inputs");
  };

  render() {
    return (
      <form>
        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState_x()}
        >
          <ControlLabel>Current Coordinate</ControlLabel>
          <FormControl
            type="text"
            value={this.state.x}
            placeholder="x-coordinate"
            onChange={this.handleChange}
          />
          <FormControl.Feedback />
          <HelpBlock>
            Enter value between 0 - 200. Decimals will be rounded down.
          </HelpBlock>
        </FormGroup>
        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState_y()}
        >
          <FormControl
            type="text"
            value={this.state.y}
            placeholder="y-coordinate"
            onChange={this.handleChange2}
          />
          <FormControl.Feedback />
          <HelpBlock>
            Enter value between 0 - 200. Decimals will be rounded down.
          </HelpBlock>
          <ControlLabel>Current Leg</ControlLabel>
          <Select
            value={this.state.leg}
            onChange={this.handleSelect}
            options={options}
          />
        </FormGroup>

        <Button type="submit" onClick={this.handleSubmit}>
          Submit
        </Button>
      </form>
    );
  }
}

export default Driver;
