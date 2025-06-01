class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) return { error: "Expected puzzle to be 81 characters long" };
    if (!/^[1-9.]+$/.test(puzzleString)) return { error: "Invalid characters in puzzle" };

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let board = [...Array(9)].map((_, i) => puzzleString.slice(i * 9, (i + 1) * 9));
    
    return !board[row].includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    let board = [...Array(9)].map((_, i) => puzzleString.slice(i * 9, (i + 1) * 9));
    
    return !board.map(row => row[column]).includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let board = [...Array(9)].map((_, i) => puzzleString.slice(i * 9, (i + 1) * 9));

    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(column / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === value) return false;
      }
    }

    return true;
  }

  solve(puzzleString) {
    return this.solveHelper(puzzleString) || "cannot be solved";
  }

  solveHelper(board) {
    for (let i = 0; i < 81; i++) {
      if (board[i] === '.') {
        for (let num of "123456789") {
          let row = Math.floor(i / 9); 
          let col = i % 9;

          if (this.checkRowPlacement(board, row, col, num) &&
              this.checkColPlacement(board, row, col, num) &&
              this.checkRegionPlacement(board, row, col, num)) {
                let newBoard = board.slice(0, i) + num + board.slice(i + 1);
                let solvedBoard = this.solveHelper(newBoard);

                if (solvedBoard) return solvedBoard;
              }
            }

            return false;
          }
        }

        return board;
      }
}

module.exports = SudokuSolver;

