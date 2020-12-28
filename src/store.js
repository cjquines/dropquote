import { configureStore } from "@reduxjs/toolkit";
import gridReducer from "./grid/gridSlice";

export default configureStore({
  reducer: {
    grid: gridReducer,
  },
});
