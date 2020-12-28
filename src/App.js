import React, { useState } from "react";
import _ from "lodash";
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
      Delete: "delete",
      Tab: "tab",
      " ": "space",
      "[": "backward",
      "]": "forward",
    };
    if (key in actionKeys) {
      // pass
    } else {
      const letter = key.toUpperCase();
      if (letter.match(/^[A-Z]$/)) {
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

const App = () => {
  const [selected, setSelected] = useState({ r: 0, c: 0 });
  const [header, setHeader] = useState([
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
  ]);
  const [grid, setGrid] = useState([
    ["", "", ".", "", "", ".", "", "", ".", ""],
    ["", "", ".", "", "", ".", "", "", ".", "."],
    ["", "", "", "", ".", "", "", ".", "", ""],
    ["", ".", "", "", "", "", "", "", "", ""],
  ]);
  return (
    <div className="app">
      <InputHandler
        header={header}
        grid={grid}
        selected={selected}
        setGrid={setGrid}
        setSelected={setSelected}
      >
        <table className="allTable">
          <Header
            header={header}
            selected={selected}
            setSelected={setSelected}
          />
          <Grid grid={grid} selected={selected} setSelected={setSelected} />
        </table>
      </InputHandler>
    </div>
  );
};

export default App;
