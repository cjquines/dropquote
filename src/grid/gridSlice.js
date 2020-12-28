import { createSlice } from "@reduxjs/toolkit";

const inBounds = (state, r, c) => {
  const { rows, cols } = state;
  return -1 <= r && r < rows && 0 <= c && c < cols;
};

const canEdit = (state, r, c) =>
  state.editing || (r !== -1 && state.grid[r][c] !== ".");

const nextInDir = (state, oldR, oldC, dr, dc) => {
  let r = oldR;
  let c = oldC;
  const isGood = (r, c) => inBounds(state, r, c) && canEdit(state, r, c);
  do {
    r += dr;
    c += dc;
    if (c === -1) {
      r -= 1;
      c = state.cols - 1;
    } else if (c === state.cols) {
      r += 1;
      c = 0;
    }
    if (r < -1 || r > state.rows) break;
  } while (!isGood(r, c));
  return isGood(r, c) ? { r, c } : { r: oldR, c: oldC };
};

export const gridSlice = createSlice({
  name: "grid",
  initialState: {
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
  },
  reducers: {
    toggleEditing: (state, action) => {
      state.editing = !state.editing;
    },
    selectCell: (state, action) => {
      const { r, c } = action.payload;
      if (!inBounds(state, r, c) || !canEdit(state, r, c)) return;
      state.selected = { r, c };
    },
    moveBy: (state, action) => {
      const { dr, dc } = action.payload;
      const { r, c } = state.selected;
      state.selected = nextInDir(state, r, c, dr, dc);
    },
    editSelectedCell: (state, action) => {
      const letter = action.payload;
      const { r, c } = state.selected;

      if (!state.editing && letter !== "" && !state.header[c].includes(letter))
        return;

      const pushed = state.editing
        ? r === -1 && letter !== "" && letter !== "." && letter
        : state.grid[r][c] !== "" && state.grid[r][c];
      const popped = state.editing
        ? r === -1 && letter === "" && -1
        : letter !== "" && state.header[c].findIndex((v) => v === letter);
      const result = (!state.editing || r >= 0) && letter;
      const move = letter !== "" && (!state.editing || r >= 0);

      if (pushed !== false) state.header[c].push(pushed);
      if (popped !== false) state.header[c].splice(popped, 1);
      if (result !== false) state.grid[r][c] = result;
      if (move) state.selected = nextInDir(state, r, c, 0, 1);
    },
  },
});

export const {
  toggleEditing,
  selectCell,
  moveBy,
  editSelectedCell,
} = gridSlice.actions;

export const gridDims = (state) => ({
  rows: state.grid.rows,
  cols: state.grid.cols,
});
export const letterAt = (state) => (r, c) =>
  r === -1 ? state.grid.header[c] : state.grid.grid[r][c];
export const isSelected = (state) => (r, c) =>
  state.grid.selected.r === r && state.grid.selected.c === c;
export const isShaded = (state) => (r, c) => state.grid.grid[r][c] === ".";

export default gridSlice.reducer;
