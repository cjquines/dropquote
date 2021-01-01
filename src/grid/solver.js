import englishWords from "an-array-of-english-words";
import _ from "lodash";
import { moveInDir, inBounds } from "./gridSlice";
const dlx = require("dancing-links");

const idHeader = (state) => {
  let start = 0;
  return state.header.map((col) => {
    const res = _.zip(col, _.range(start, start + col.length));
    start += col.length;
    return res;
  });
};

const idGrid = (state) => {
  const isGood = (r, c) =>
    inBounds(state, r, c) && r !== -1 && state.grid[r][c] !== ".";
  let r = 0;
  let c = 0;
  let res = [];
  while (r < state.rows) {
    let subres = [];
    while (isGood(r, c)) {
      subres.push(c);
      [r, c] = moveInDir(state, r, c, 0, 1);
    }
    if (subres.length > 0) {
      res.push(subres);
    }
    [r, c] = moveInDir(state, r, c, 0, 1);
  }
  return res;
};

const getLetters = (header, cols, word) => {
  const prod = (arr) =>
    arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
  return prod(
    _.zip(cols, Array.from(word))
      .map(([c, s]) => header[c].filter((a) => a[0].toLowerCase() === s))
      .map((ls) => ls.map((a) => a[1]))
  );
};

const getWords = (header, cols) => {
  const expr = cols
    .map((c) => header[c].map((a) => a[0].toLowerCase()).join(""))
    .map((s) => `[${s}]`)
    .join("");
  const regex = RegExp(`^${expr}$`);
  return englishWords.filter((s) => regex.test(s));
};

const onesAt = (length, ones) =>
  _.range(length).map((i) => (ones.includes(i) ? 1 : 0));

const getConstraints = (header, grid) => {
  const nLetters = header.slice(-1)[0].slice(-1)[0][1] + 1;
  const nWords = grid.length;
  return _.flattenDeep(
    grid.map((cols, c) =>
      getWords(header, cols).map((word) =>
        getLetters(header, cols, word).map((ls) => ({
          data: word,
          primaryRow: onesAt(nLetters, ls),
          secondaryRow: onesAt(nWords, [c]),
        }))
      )
    )
  );
};

export const test = (state) => {
  const head = idHeader(state);
  const grid = idGrid(state);
  const constraints = getConstraints(head, grid);
  console.log(dlx.findAll(constraints));
};
