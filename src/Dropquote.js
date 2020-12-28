export default class Dropquote {
  constructor(state, setState) {
    this.state = state;
    this.setState = setState;
  }

  test() {
    this.setState({
      grid: [
        ["", "x", ".", "", "", ".", "", "", ".", ""],
        ["", "", ".", "", "", ".", "", "", ".", "."],
        ["", "", "", "", ".", "", "", ".", "", ""],
        ["", ".", "", "", "", "", "", "", "", ""],
      ],
    });
    console.log("ok");
  }
}
