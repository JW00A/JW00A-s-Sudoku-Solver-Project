'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: "Required field(s) missing" });
      }

      const validationResult = solver.validate(puzzle);
      if (validationResult !== true) {
        return res.json(validationResult);
      }

      const row = coordinate.charCodeAt(0) - 65;
      const column = parseInt(coordinate[1]) - 1;

      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: "Invalid coordinate" });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: "Invalid value" });
      }

      if (puzzle[row * 9 + column] === value) {
        return res.json({ valid: true});
      }

      const rowValid = solver.checkRowPlacement(puzzle, row, column, value);
      const colValid = solver.checkColPlacement(puzzle, row, column, value);
      const regionValid = solver.checkRegionPlacement(puzzle, row, column, value);

      if (rowValid && colValid && regionValid) {
        return res.json({ valid: true })
      } else {
        return res.json({
          valid: false,
          conflict: [
            !rowValid ? "row" : null,
            !colValid ? "column" : null,
            !regionValid ? "region" : null
          ].filter(Boolean)
        });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: "Required field missing" });
      }

      const validationResult = solver.validate(puzzle);
      if (validationResult !== true) {
        return res.json(validationResult);
      }

      const solution = solver.solve(puzzle);

      if (solution === "cannot be solved") {
        return res.json({ error: "Puzzle cannot be solved" });
      }

      return res.json({ solution });
    });
};
