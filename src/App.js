import React, { Component } from "react";
import _ from "lodash";
import "./App.scss";

const HeaderCell = ({ letters, selected, onClick }) => {
  return (
    <th
      className={`headerCell ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {letters.map((letter, i) => (
        <React.Fragment key={i}>
          {letter}
          <br />
        </React.Fragment>
      ))}
    </th>
  );
};

const Header = ({ header, selected, setSelected }) => {
  const isSelected = (c) => selected.r === -1 && selected.c === c;

  return (
    <thead className="header">
      <tr>
        {header.map((letters, i) => (
          <HeaderCell
            key={i}
            letters={letters}
            selected={isSelected(i)}
            onClick={(e) => {
              e?.preventDefault?.();
              e?.stopPropagation?.();
              setSelected(-1, i);
            }}
          />
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
                  setSelected(r, c);
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
  moveBy,
  selected,
  setSelected,
  setSelectedCell,
}) => {
  const handleKeyDown = (e) => {
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
    const key = e?.key;
    if (key in actionKeys) {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      const action = actionKeys[key];
      let direction = { r: 0, c: 0 };
      if (action === "backspace") {
        setSelectedCell("");
        return;
      } else if (action === "up") {
        direction = { r: -1, c: 0 };
      } else if (action === "left") {
        direction = { r: 0, c: -1 };
      } else if (action === "down") {
        direction = { r: 1, c: 0 };
      } else if (action === "right") {
        direction = { r: 0, c: 1 };
      }
      if (e?.shiftKey) direction = { r: -direction.r, c: -direction.c };
      moveBy(direction.r, direction.c);
    } else {
      const letter = key.toUpperCase();
      if (!letter.match(/^[A-Z.]$/)) return;
      e?.preventDefault?.();
      e?.stopPropagation?.();
      setSelectedCell(letter);
    }
  };

  return (
    <div className="inputHandler" tabIndex="1" onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
};

export default class App extends Component {
  state = {
    editing: true,
    rows: 4,
    cols: 10,
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

  inBounds = (r, c) => {
    const { rows, cols } = this.state;
    return -1 <= r && r < rows && 0 <= c && c < cols;
  };

  moveBy = (dr, dc) => {
    const { r, c } = this.state.selected;
    const nr = r + dr,
      nc = c + dc;
    if (nc === -1) this.setSelected(nr - 1, this.state.cols - 1);
    else if (nc === this.state.cols) this.setSelected(nr + 1, 0);
    else this.setSelected(nr, nc);
  };

  setSelected = (r, c) => {
    const { editing, grid } = this.state;
    if (!this.inBounds(r, c)) return;
    if (!editing && r === -1) return;
    if (!editing && grid[r][c] === ".") return;
    this.setState({ selected: { r, c } });
  };

  setSelectedCell = (letter) => {
    const { r, c } = this.state.selected;
    if (this.state.editing) {
      if (r >= 0) {
        let grid = _.cloneDeep(this.state.grid);
        grid[r][c] = letter;
        this.setState({ grid });
        this.moveBy(0, 1);
      } else if (letter !== "") {
        let header = _.cloneDeep(this.state.header);
        header[c].push(letter);
        this.setState({ header });
      } else {
        let header = _.cloneDeep(this.state.header);
        header[c].pop();
        this.setState({ header });
      }
    } else if (letter !== "") {
      if (!this.state.header[c].includes(letter)) return;
      let header = _.cloneDeep(this.state.header);
      const idx = header[c].findIndex((v) => v === letter);
      header[c].splice(idx, 1);
      this.setState({ header });

      let grid = _.cloneDeep(this.state.grid);
      grid[r][c] = letter;
      this.setState({ grid });
      this.moveBy(0, 1);
    } else {
      let header = _.cloneDeep(this.state.header);
      header[c].push(this.state.grid[r][c]);
      const idx = header[c].findIndex((v) => v === letter);
      header[c].splice(idx, 1);
      this.setState({ header });
      
      let grid = _.cloneDeep(this.state.grid);
      grid[r][c] = letter;
      this.setState({ grid });
      this.moveBy(0, 1);
    }
  };

  render = () => {
    return (
      <div className="app">
        <button onClick={(e) => {
          e?.preventDefault?.();
          this.setState({ editing: !this.state.editing });
        }}>switch</button>
        <InputHandler
          header={this.state.header}
          grid={this.state.grid}
          moveBy={this.moveBy}
          selected={this.state.selected}
          setSelected={this.setSelected}
          setSelectedCell={this.setSelectedCell}
        >
          <table className="allTable">
            <Header
              header={this.state.header}
              selected={this.state.selected}
              setSelected={this.setSelected}
            />
            <Grid
              grid={this.state.grid}
              selected={this.state.selected}
              setSelected={this.setSelected}
            />
          </table>
        </InputHandler>
      </div>
    );
  };
}
