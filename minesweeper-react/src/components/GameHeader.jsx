import React, { useEffect, useState } from 'react';
import './GameHeader.css';

const GameHeader = ({ minesRemaining, gameState, gameTime, startTime, onReset }) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let intervalId = null;

    if (startTime && gameState === 'playing') {
      intervalId = setInterval(() => {
        setCurrentTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else if (gameState !== 'playing') {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [startTime, gameState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getFaceEmoji = () => {
    switch (gameState) {
      case 'won':
        return '😎';
      case 'lost':
        return '😵';
      default:
        return '🙂';
    }
  };

  return (
    <div className="game-header">
      <div className="mine-counter">
        💣 {minesRemaining.toString().padStart(3, '0')}
      </div>
      
      <button className="reset-button" onClick={onReset}>
        {getFaceEmoji()}
      </button>
      
      <div className="timer">
        ⏱️ {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default GameHeader;
