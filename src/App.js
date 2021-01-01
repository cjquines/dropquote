import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Header, Grid, InputHandler } from "./grid/Grid";
import {
  gridDims,
  toggleEditing,
  resizeGrid,
  selectSolution,
} from "./grid/gridSlice";
import "./App.scss";

const Toolbar = () => {
  const dispatch = useDispatch();
  const { isEditing, isPending, solutionIndex } = useSelector(({ grid }) => ({
    isEditing: grid.editing,
    isPending: grid.pending,
    solutionIndex: grid.solutionIndex,
  }));
  const { rows, cols } = useSelector(gridDims);

  if (isPending) return <div className="toolbar">solving...</div>;

  if (isEditing) {
    return (
      <div className="toolbar">
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
      {` solution ${solutionIndex} `}
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
