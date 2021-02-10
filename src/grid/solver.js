import _ from "lodash";
import { decode } from "@msgpack/msgpack";
import { moveInDir, inBounds } from "./gridSlice";
const dlx = require("dancing-links");

const THRESHOLD = 600;

class WordFreq {
  async download() {
    const data = await fetch("./en.msgpack");
    const buffer = await data.arrayBuffer();
    this.cb = decode(buffer);
  }

  filter(regex) {
    let res = [];
    for (let i = 1; i < Math.min(THRESHOLD, this.cb.length); i++) {
      for (let j = 0; j < this.cb[i].length; j++) {
        const word = this.cb[i][j];
        if (regex.test(word)) res.push(word);
      }
    }
    return res;
  }

  judge(word) {
    for (let i = 1; i < this.cb.length; i++) {
      if (_.sortedIndexOf(this.cb[i], word) !== -1) {
        return Math.pow(10, -i / 100);
      }
    }
    return 0;
  }
}

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
    arr.length === 1
      ? arr
      : arr.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
  return prod(
    _.zip(cols, Array.from(word))
      .map(([c, s]) => header[c].filter((a) => a[0].toLowerCase() === s))
      .map((ls) => ls.map((a) => a[1]))
  );
};

const getWords = (wordfreq, header, cols) => {
  const expr = cols
    .map((c) => header[c].map((a) => a[0].toLowerCase()).join(""))
    .map((s) => `[${s}]`)
    .join("");
  const regex = RegExp(`^${expr}$`);
  return wordfreq.filter(regex);
};

const onesAt = (length, ones) =>
  _.range(length).map((i) => (ones.includes(i) ? 1 : 0));

const getConstraints = (wordfreq, header, grid) => {
  const nLetters = header.flat().slice(-1)[0][1] + 1;
  const nWords = grid.length;
  return _.flattenDeep(
    grid.map((cols, c) =>
      getWords(wordfreq, header, cols).map((word) =>
        getLetters(header, cols, word).map((ls) => ({
          data: word,
          primaryRow: onesAt(nLetters, ls),
          secondaryRow: onesAt(nWords, [c]),
        }))
      )
    )
  );
};

const judgeSolution = (wordfreq, solution) => {
  const freqs = solution.map((word) => wordfreq.judge(word));
  if (freqs.some((f) => f === 0)) return 0;
  return {
    score: Math.log(1 / _.sum(freqs.map((f) => 1 / f))) / Math.log(10) + 9,
    solution: solution,
  };
};

const processSolution = (solution) =>
  _.chain(solution)
    .sortBy(["index"])
    .map((word) => word.data)
    .value();

export const solve = async (state) => {
  const head = idHeader(state);
  const grid = idGrid(state);
  const wordfreq = new WordFreq();
  await wordfreq.download();
  const constraints = getConstraints(wordfreq, head, grid);
  const result = dlx.find(constraints, 20);
  return _.chain(result)
    .map(processSolution)
    .uniqWith(_.isEqual)
    .map((s) => judgeSolution(wordfreq, s))
    .sortBy(["score"])
    .reverse()
    .value();
};
