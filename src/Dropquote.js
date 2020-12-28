// import _ from "lodash";
// the idea is to make it a S T A T E M A C H I N E

export const setSelected = (state, setState, {r, c}) => {
  console.log(r, c);
  setState({ selected: { r, c } });
};

export const moveBy = (state, setState, {dr, dc}) => {
  const {r, c} = state.selected;
  console.log(r, c);
  setSelected(state, setState, {r: r + dr, c: c + dc});
}

// export default class Dropquote {
//   constructor(state, setState) {
//     this.state = state.state;
//     this.setState = setState;
//   }

//   test() {
//     this.setState({
//       grid: [
//         ["", "x", ".", "", "", ".", "", "", ".", ""],
//         ["", "", ".", "", "", ".", "", "", ".", "."],
//         ["", "", "", "", ".", "", "", ".", "", ""],
//         ["", ".", "", "", "", "", "", "", "", ""],
//       ],
//     });
//     console.log("ok");
//   }

//   inBounds = (r, c) => {
//     return -1 <= r && r < this.state.rows && 0 <= c && c < this.state.cols;
//   };

//   setSelected = (r, c) => {
//     if (!this.inBounds(r, c)) return;
//     this.setState({ selected: { r, c } });
//   };

//   moveBy = (dr, dc) => {
//     console.log(this.state);
//     console.log(this.state.selected);
//     const {r, c} = this.state.selected;
//     console.log(r, c);
//     console.log(r + dr, c + dc);
//     this.setSelected(r + dr, c + dc);
//   }
// }
