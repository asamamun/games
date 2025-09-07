import React from 'react';
import './Cell.css';

const Cell = ({ cell, onClick, onRightClick, gameState }) => {
  const getCellContent = () => {
    if (cell.isFlagged) {
      return '🚩';
    }
    
    if (!cell.isRevealed) {
      return '';
    }
    
    if (cell.isMine) {
      return '💣';
    }
    
    if (cell.neighborMines > 0) {
      return cell.neighborMines;
    }
    
    return '';
  };

  const getCellClass = () => {
    let className = 'cell';
    
    if (cell.isRevealed) {
      className += ' revealed';
      
      if (cell.isMine) {
        className += ' mine';
        if (gameState === 'lost') {
          className += ' exploded';
        }
      } else if (cell.neighborMines > 0) {
        className += ` number-${cell.neighborMines}`;
      }
    } else {
      className += ' hidden';
      
      if (cell.isFlagged) {
        className += ' flagged';
      }
    }
    
    // Highlight incorrectly flagged cells when game is over
    if (gameState === 'lost' && cell.isFlagged && !cell.isMine) {
      className += ' wrong-flag';
    }
    
    return className;
  };

  return (
    <button
      className={getCellClass()}
      onClick={onClick}
      onContextMenu={onRightClick}
      disabled={cell.isRevealed && !cell.isMine}
    >
      {getCellContent()}
    </button>
  );
};

export default Cell;
