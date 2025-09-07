import React, { useState, useCallback } from 'react';
import GameBoard from './GameBoard';
import GameHeader from './GameHeader';
import './Game.css';

const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 }
};

const Game = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [flagCount, setFlagCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [gameTime, setGameTime] = useState(0);

  const config = DIFFICULTIES[difficulty];
  const minesRemaining = config.mines - flagCount;

  const handleGameStart = useCallback(() => {
    setStartTime(Date.now());
    setGameState('playing');
  }, []);

  const handleGameEnd = useCallback((result) => {
    setGameState(result);
    setStartTime(null);
  }, []);

  const handleFlagCountChange = useCallback((newFlagCount) => {
    setFlagCount(newFlagCount);
  }, []);

  const resetGame = () => {
    setGameState('playing');
    setFlagCount(0);
    setStartTime(null);
    setGameTime(0);
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  return (
    <div className="game">
      <h1>Minesweeper</h1>

      <div className="difficulty-selector">
        {Object.keys(DIFFICULTIES).map((level) => (
          <button
            key={level}
            onClick={() => handleDifficultyChange(level)}
            className={difficulty === level ? 'active' : ''}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <GameHeader
        minesRemaining={minesRemaining}
        gameState={gameState}
        gameTime={gameTime}
        startTime={startTime}
        onReset={resetGame}
      />

      <GameBoard
        rows={config.rows}
        cols={config.cols}
        mines={config.mines}
        gameState={gameState}
        onGameStart={handleGameStart}
        onGameEnd={handleGameEnd}
        onFlagCountChange={handleFlagCountChange}
      />
    </div>
  );
};

export default Game;
