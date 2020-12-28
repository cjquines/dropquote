import React, { Component } from "react";
import _ from "lodash";
import Dropquote from "./Dropquote.js";
import "./App.scss";

const HeaderCell = ({ letters }) => {
  return (
    <th className="headerCell">
      {letters.map((letter, i) => (
        <React.Fragment key={i}>
          {letter}
          <br />
        </React.Fragment>
      ))}
    </th>
  );
};

const Header = ({ header }) => {
  return (
    <thead className="header">
      <tr>
        {header.map((letters, i) => (
          <HeaderCell key={i} letters={letters} />
        ))}
      </tr>
    </thead>
  );
};

const GridCell = ({ letter, onClick, selected, shaded }) => {
  let className = "gridCell";
  if (shaded) className += " shaded";
  if (selected) className += " selected";
  return (
    <div className={className} onClick={onClick}>
      <div className="gridLetter">{letter}</div>
    </div>
  );
};

const Grid = ({ grid, selected, setSelected }) => {
  const isShaded = (r, c) => grid[r][c] === ".";
  const isSelected = (r, c) => selected.r === r && selected.c === c;

  const handleClick = (r, c) => {
    if (isShaded(r, c) || isSelected(r, c)) return;
    setSelected({ r, c });
  };

  return (
    <tbody className="grid">
      {grid.map((row, r) => (
        <tr key={`row-${r}`}>
          {row.map((cell, c) => (
            <td key={`${r}-${c}`}>
              <GridCell
                letter={cell}
                selected={isSelected(r, c)}
                shaded={isShaded(r, c)}
                onClick={(e) => {
                  e?.preventDefault?.();
                  e?.stopPropagation?.();
                  handleClick(r, c);
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

const InputHandler = ({
  children,
  grid,
  header,
  selected,
  setGrid,
  setSelected,
}) => {
  const handleKeyDown = ({ key }) => {
    const actionKeys = {
      ArrowLeft: "left",
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowRight: "right",
      Backspace: "backspace",
      "{del}": "backspace",
      Delete: "backspace",
      Tab: "right",
      " ": "right",
    };
    if (key in actionKeys) {
      const action = actionKeys[key];
      let direction = { r: 0, c: 0 };
      if (action === "backspace") {
        return;
      } else if (action === "up") {
        direction = { r: 0, c: -1 };
      } else if (action === "left") {
        direction = { r: 1, c: 0 };
      } else if (action === "down") {
        direction = { r: 0, c: 1 };
      } else if (action === "right") {
        direction = { r: -1, c: 0 };
      }
    } else {
      const letter = key.toUpperCase();
      if (letter.match(/^[A-Z.]$/)) {
        console.log("x");
        const newGrid = _.cloneDeep(grid);
        const { r, c } = selected;
        newGrid[r][c] = letter;
        setGrid(newGrid);
      }
    }
  };

  return (
    <div className="inputHandler" tabIndex="1" onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: { r: 0, c: 0 },
      header: [
        ["E", "O", "T", "T"],
        ["H", "O", "T"],
        ["A", "Q"],
        ["B", "T", "T", "U"],
        ["E", "E", "O"],
        ["I", "S"],
        ["B", "O", "S", "T"],
        ["E", "I", "R"],
        ["O", "T"],
        ["H", "N", "N"],
      ],
      grid: [
        ["", "", ".", "", "", ".", "", "", ".", ""],
        ["", "", ".", "", "", ".", "", "", ".", "."],
        ["", "", "", "", ".", "", "", ".", "", ""],
        ["", ".", "", "", "", "", "", "", "", ""],
      ],
    };
    this.dq = new Dropquote(this.state, this.setState.bind(this));
  }

  componentDidMount() {
    this.dq.test();
    console.log("ok");
  }

  render() {
    return (
      <div className="app">
        <InputHandler
          header={this.state.header}
          grid={this.state.grid}
          selected={this.state.selected}
        >
          <table className="allTable">
            <Header header={this.state.header} selected={this.state.selected} />
            <Grid grid={this.state.grid} selected={this.state.selected} />
          </table>
        </InputHandler>
      </div>
    );
  }
}
