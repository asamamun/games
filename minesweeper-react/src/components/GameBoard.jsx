import React, { useState, useEffect, useCallback } from 'react';
import Cell from './Cell';
import { createBoard, placeMines, calculateNumbers, revealCell, toggleFlag } from '../utils/gameUtils';
import './GameBoard.css';

const GameBoard = ({ 
  rows, 
  cols, 
  mines, 
  gameState, 
  onGameStart, 
  onGameEnd, 
  onFlagCountChange 
}) => {
  const [board, setBoard] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [flagCount, setFlagCount] = useState(0);

  // Initialize empty board
  useEffect(() => {
    const newBoard = createBoard(rows, cols);
    setBoard(newBoard);
    setGameStarted(false);
    setFlagCount(0);
    onFlagCountChange(0);
  }, [rows, cols, mines, onFlagCountChange]);

  // Handle first click - place mines avoiding the clicked cell
  const initializeGame = useCallback((clickedRow, clickedCol) => {
    const newBoard = createBoard(rows, cols);
    const boardWithMines = placeMines(newBoard, mines, clickedRow, clickedCol);
    const finalBoard = calculateNumbers(boardWithMines);
    
    setBoard(finalBoard);
    setGameStarted(true);
    onGameStart();
    
    return finalBoard;
  }, [rows, cols, mines, onGameStart]);

  const handleCellClick = useCallback((row, col) => {
    if (gameState !== 'playing') return;

    let currentBoard = board;
    
    // Initialize game on first click
    if (!gameStarted) {
      currentBoard = initializeGame(row, col);
    }

    const { newBoard, gameResult } = revealCell(currentBoard, row, col);
    setBoard(newBoard);

    if (gameResult) {
      onGameEnd(gameResult);
    }
  }, [board, gameStarted, gameState, initializeGame, onGameEnd]);

  const handleCellRightClick = useCallback((row, col) => {
    if (gameState !== 'playing' || !gameStarted) return;

    const { newBoard, newFlagCount } = toggleFlag(board, row, col, flagCount);
    setBoard(newBoard);
    setFlagCount(newFlagCount);
    onFlagCountChange(newFlagCount);
  }, [board, gameState, gameStarted, flagCount, onFlagCountChange]);

  return (
    <div 
      className="game-board"
      style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={() => handleCellClick(rowIndex, colIndex)}
            onRightClick={(e) => {
              e.preventDefault();
              handleCellRightClick(rowIndex, colIndex);
            }}
            gameState={gameState}
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;
