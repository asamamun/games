// Create an empty board with specified dimensions
export const createBoard = (rows, cols) => {
  const board = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        row: i,
        col: j,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      });
    }
    board.push(row);
  }
  return board;
};

// Randomly place mines on the board, avoiding the first clicked cell
export const placeMines = (board, mineCount, avoidRow, avoidCol) => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  let minesPlaced = 0;
  
  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    // Avoid placing mine on first clicked cell and avoid duplicates
    if ((row !== avoidRow || col !== avoidCol) && !newBoard[row][col].isMine) {
      newBoard[row][col].isMine = true;
      minesPlaced++;
    }
  }
  
  return newBoard;
};

// Calculate the number of neighboring mines for each cell
export const calculateNumbers = (board) => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!newBoard[row][col].isMine) {
        let count = 0;
        
        directions.forEach(([dRow, dCol]) => {
          const newRow = row + dRow;
          const newCol = col + dCol;
          
          if (
            newRow >= 0 && newRow < rows &&
            newCol >= 0 && newCol < cols &&
            newBoard[newRow][newCol].isMine
          ) {
            count++;
          }
        });
        
        newBoard[row][col].neighborMines = count;
      }
    }
  }
  
  return newBoard;
};

// Reveal a cell and potentially cascade to reveal empty neighbors
export const revealCell = (board, row, col) => {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  const cell = newBoard[row][col];
  
  // Can't reveal flagged or already revealed cells
  if (cell.isFlagged || cell.isRevealed) {
    return { newBoard, gameResult: null };
  }
  
  cell.isRevealed = true;
  
  // If clicked on mine, game over
  if (cell.isMine) {
    // Reveal all mines
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (newBoard[i][j].isMine) {
          newBoard[i][j].isRevealed = true;
        }
      }
    }
    return { newBoard, gameResult: 'lost' };
  }
  
  // If empty cell (no neighboring mines), reveal all neighbors
  if (cell.neighborMines === 0) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    directions.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      if (
        newRow >= 0 && newRow < rows &&
        newCol >= 0 && newCol < cols &&
        !newBoard[newRow][newCol].isRevealed &&
        !newBoard[newRow][newCol].isFlagged
      ) {
        const result = revealCell(newBoard, newRow, newCol);
        // Update board with cascaded reveals
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            newBoard[i][j] = result.newBoard[i][j];
          }
        }
      }
    });
  }
  
  // Check for win condition
  const unrevealedNonMines = newBoard.flat().filter(
    cell => !cell.isRevealed && !cell.isMine
  ).length;
  
  if (unrevealedNonMines === 0) {
    return { newBoard, gameResult: 'won' };
  }
  
  return { newBoard, gameResult: null };
};

// Toggle flag on a cell
export const toggleFlag = (board, row, col, currentFlagCount) => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const cell = newBoard[row][col];
  
  // Can't flag revealed cells
  if (cell.isRevealed) {
    return { newBoard, newFlagCount: currentFlagCount };
  }
  
  cell.isFlagged = !cell.isFlagged;
  const newFlagCount = cell.isFlagged ? 
    currentFlagCount + 1 : 
    currentFlagCount - 1;
  
  return { newBoard, newFlagCount };
};
