import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header, Grid, InputHandler } from "./grid/Grid";
import { wordPossibilities, toggleEditing } from "./grid/gridSlice";
import "./App.scss";

const App = () => {
  const dispatch = useDispatch();
  const possibilities = useSelector(wordPossibilities);
  return (
    <div className="app">
      <button
        onClick={(e) => {
          e?.preventDefault?.();
          dispatch(toggleEditing());
        }}
      >
        switch
      </button>
      <InputHandler>
        <table className="allTable">
          <Header />
          <Grid />
        </table>
      </InputHandler>
      <div className="possibilities">
        {possibilities && possibilities.join(",")}
      </div>
    </div>
  );
};

export default App;
