import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Header, Grid, InputHandler } from "./grid/Grid";
import {
  gridDims,
  toggleEditing,
  resizeGrid,
  selectSolution,
  clearAll,
} from "./grid/gridSlice";
import "./App.scss";

const Toolbar = () => {
  const dispatch = useDispatch();
  const { isEditing, isPending, solutionIndex, nSolutions } = useSelector(
    ({ grid }) => ({
      isEditing: grid.editing,
      isPending: grid.pending,
      solutionIndex: grid.solutionIndex,
      nSolutions: grid.solutions.length,
    })
  );
  const { rows, cols } = useSelector(gridDims);

  if (isPending) return <div className="toolbar">solving...</div>;

  if (isEditing) {
    return (
      <div className="toolbar">
        <p>type . to make black squares, source on <a href="https://github.com/cjquines/dropquote">github</a></p>
        <button
          onClick={(e) => {
            e?.preventDefault?.();
            dispatch(resizeGrid({ rows: rows - 1, cols }));
          }}
        >
          -
        </button>{" "}
        rows{" "}
        <button
          onClick={(e) => {
            e?.preventDefault?.();
            dispatch(resizeGrid({ rows: rows + 1, cols }));
          }}
        >
          +
        </button>
        <button
          onClick={(e) => {
            e?.preventDefault?.();
            dispatch(resizeGrid({ rows, cols: cols - 1 }));
          }}
        >
          -
        </button>{" "}
        columns{" "}
        <button
          onClick={(e) => {
            e?.preventDefault?.();
            dispatch(resizeGrid({ rows, cols: cols + 1 }));
          }}
        >
          +
        </button>
        <button
          onClick={(e) => {
            e?.preventDefault?.();
            dispatch(toggleEditing());
          }}
        >
          solve
        </button>
        <button
          onClick={(e) => {
            e?.preventDefault?.();
            dispatch(clearAll());
          }}
        >
          clear all
        </button>
      </div>
    );
  }

  return (
    <div className="toolbar">
      <button
        onClick={(e) => {
          e?.preventDefault?.();
          dispatch(selectSolution(solutionIndex - 1));
        }}
      >
        -
      </button>
      {` solution ${solutionIndex + 1} of ${nSolutions} `}
      <button
        onClick={(e) => {
          e?.preventDefault?.();
          dispatch(selectSolution(solutionIndex + 1));
        }}
      >
        +
      </button>
      <button
        onClick={(e) => {
          e?.preventDefault?.();
          dispatch(toggleEditing());
        }}
      >
        edit
      </button>
    </div>
  );
};

const App = () => {
  return (
    <div className="app">
      <Toolbar />
      <InputHandler>
        <table className="allTable">
          <Header />
          <Grid />
        </table>
      </InputHandler>
    </div>
  );
};

export default App;
