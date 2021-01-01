import React from "react";
import { useDispatch } from "react-redux";
import { Header, Grid, InputHandler } from "./grid/Grid";
import { toggleEditing } from "./grid/gridSlice";
import "./App.scss";

const App = () => {
  const dispatch = useDispatch();
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
    </div>
  );
};

export default App;
