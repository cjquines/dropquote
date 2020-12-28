import React from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import {
  selectCell,
  moveBy,
  editSelectedCell,
  gridDims,
  letterAt,
  isSelected,
  isShaded,
} from "./gridSlice";

const HeaderCell = ({ c, onClick }) => {
  const letters = useSelector(letterAt)(-1, c);
  const selected = useSelector(isSelected)(-1, c);
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

export const Header = () => {
  const { cols } = useSelector(gridDims);
  const dispatch = useDispatch();
  return (
    <thead className="header">
      <tr>
        {_.range(cols).map((c) => (
          <HeaderCell
            key={c}
            c={c}
            onClick={(e) => {
              e?.preventDefault?.();
              e?.stopPropagation?.();
              dispatch(selectCell({ r: -1, c }));
            }}
          />
        ))}
      </tr>
    </thead>
  );
};

const GridCell = ({ r, c, onClick }) => {
  const letter = useSelector(letterAt)(r, c);
  let className = "gridCell";
  if (useSelector(isShaded)(r, c)) className += " shaded";
  if (useSelector(isSelected)(r, c)) className += " selected";
  return (
    <div className={className} onClick={onClick}>
      <div className="gridLetter">{letter}</div>
    </div>
  );
};

export const Grid = () => {
  const { rows, cols } = useSelector(gridDims);
  const dispatch = useDispatch();
  return (
    <tbody className="grid">
      {_.range(rows).map((r) => (
        <tr key={`row-${r}`}>
          {_.range(cols).map((c) => (
            <td key={`${r}-${c}`}>
              <GridCell
                r={r}
                c={c}
                onClick={(e) => {
                  e?.preventDefault?.();
                  e?.stopPropagation?.();
                  dispatch(selectCell({ r, c }));
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export const InputHandler = ({ children }) => {
  const dispatch = useDispatch();

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
        dispatch(editSelectedCell(""));
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
      dispatch(moveBy({ dr: direction.r, dc: direction.c}));
    } else {
      const letter = key.toUpperCase();
      if (!letter.match(/^[A-Z.]$/)) return;
      e?.preventDefault?.();
      e?.stopPropagation?.();
      dispatch(editSelectedCell(letter));
    }
  };

  return (
    <div className="inputHandler" tabIndex="1" onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
};
