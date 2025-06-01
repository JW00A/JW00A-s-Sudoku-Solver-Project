const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', function() {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
        const validationResult = solver.validate(puzzleString);

        assert.equal(validationResult, true, 'Expected to be valid');
    });
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
        const puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.A.2..9.47...8..1..16....926914.37,';
        const validationResult = solver.validate(puzzleString);

        assert.deepEqual(validationResult, { error: "Invalid characters in puzzle" });
    });
    test('Logic handles a puzzle string that is not 81 characters in length', function() {
        const puzzleString = "";
        const validationResult = solver.validate(puzzleString);

        assert.deepEqual(validationResult, { error: "Expected puzzle to be 81 characters long" });
    });
    test('Logic handles a valid row placement', function() {
        const puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const row = 0;
        const col = 1;
        const value = '3';

        const rowPlacementValidation = solver.checkRowPlacement(puzzleString, row, col, value);

        assert.equal(rowPlacementValidation, true, "Expected to be valid");
    });
    test('Logic handles an invalid row placement', function() {
        const puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const row = 0;
        const col = 1;
        const value = '1';

        const rowPlacementValidation = solver.checkRowPlacement(puzzleString, row, col, value);

        assert.equal(rowPlacementValidation, false, "Expected to be invalid");
    });
    test('Logic handles a valid column placement', function() {
        const puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const row = 0;
        const col = 1;
        const value = '1';

        const colPlacementValidation = solver.checkColPlacement(puzzleString, row, col, value);
    
        assert.equal(colPlacementValidation, true, "Expected to be valid");
    });
    test('Logic handles an invalid column placement', function() {
        const puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const row = 0;
        const col = 1;
        const value = '2';

        const colPlacementValidation = solver.checkColPlacement(puzzleString, row, col, value);
    
        assert.equal(colPlacementValidation, false, "Expected to be invalid");
    });
    test('Logic handles a valid region (3x3 grid) placement', function() {
        const puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const row = 0;
        const col = 1;
        const value = '9';

        const regionPlacementValidation = solver.checkRegionPlacement(puzzleString, row, col, value);
    
        assert.equal(regionPlacementValidation, true, "Expected to be valid");
    });
    test('Logic handles an invalid region (3x3 grid) placement', function() {
        const puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const row = 0;
        const col = 1;
        const value = '1';

        const regionPlacementValidation = solver.checkRegionPlacement(puzzleString, row, col, value);
    
        assert.equal(regionPlacementValidation, false, "Expected to be invalid");
    });
    test('Valid puzzle strings pass the solver', function() {
        const puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const solvedPuzzleString = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
        
        const solverValidation = solver.solve(puzzleString);
    
        assert.equal(solverValidation, solvedPuzzleString, "Expected to be solvable");
    });
    test('Invalid puzzle strings fail the solver', function() {
        const puzzleString = "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        
        const solverValidation = solver.solve(puzzleString);
    
        assert.equal(solverValidation, "cannot be solved", "Expected to be unsolvable");
    });
    test('Solver returns the expected solution for an incomplete puzzle', function() {
        const puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
        const solvedPuzzleString = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
        
        const solverValidation = solver.solve(puzzleString);
    
        assert.equal(solverValidation, solvedPuzzleString, "Expected to return correct solution");
    });
});
