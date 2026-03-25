import React, { useMemo, useState } from 'react';
import './App.css';

const PLAYER_X = 'X';
const PLAYER_O = 'O';

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

/**
 * PUBLIC_INTERFACE
 * Main application component for the Tic Tac Toe game.
 */
export default function App() {
  const [board, setBoard] = useState(() => Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const status = useMemo(() => {
    if (winner) return `${winner} wins!`;
    if (isDraw) return `It's a draw.`;
    return `${currentPlayer}'s turn`;
  }, [winner, isDraw, currentPlayer]);

  const canPlay = !winner && !isDraw;

  const computeWinner = (nextBoard) => {
    for (const line of WINNING_LINES) {
      const [a, b, c] = line;
      const v = nextBoard[a];
      if (v && v === nextBoard[b] && v === nextBoard[c]) {
        return { winner: v, line };
      }
    }
    return { winner: null, line: null };
  };

  const handleCellClick = (idx) => {
    if (!canPlay) return;
    if (board[idx]) return;

    const nextBoard = board.slice();
    nextBoard[idx] = currentPlayer;

    const { winner: nextWinner, line } = computeWinner(nextBoard);
    const nextIsDraw = !nextWinner && nextBoard.every(Boolean);

    setBoard(nextBoard);
    setWinner(nextWinner);
    setWinningLine(line);
    setIsDraw(nextIsDraw);

    if (!nextWinner && !nextIsDraw) {
      setCurrentPlayer((p) => (p === PLAYER_X ? PLAYER_O : PLAYER_X));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(PLAYER_X);
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
  };

  return (
    <div className="tttApp">
      <main className="tttShell" aria-label="Tic Tac Toe">
        <header className="tttHeader">
          <div className="tttTitleWrap">
            <h1 className="tttTitle">Tic Tac Toe</h1>
            <p className="tttSubtitle">Play locally — take turns and try to get three in a row.</p>
          </div>

          <div className="tttPills" aria-label="Players">
            <span className={`tttPill ${currentPlayer === PLAYER_X ? 'isActive' : ''}`}>
              {PLAYER_X}
            </span>
            <span className={`tttPill ${currentPlayer === PLAYER_O ? 'isActive' : ''}`}>
              {PLAYER_O}
            </span>
          </div>
        </header>

        <section className="tttCard" aria-label="Game board">
          <div
            className="tttBoard"
            role="grid"
            aria-label="3 by 3 Tic Tac Toe board"
            aria-disabled={!canPlay}
          >
            {board.map((value, idx) => {
              const isWinningCell = Boolean(winningLine && winningLine.includes(idx));
              const isFilled = Boolean(value);
              const ariaLabel = value
                ? `Cell ${idx + 1}, ${value}`
                : `Cell ${idx + 1}, empty`;

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    'tttCell',
                    isWinningCell ? 'isWinning' : '',
                    isFilled ? 'isFilled' : '',
                    !canPlay ? 'isLocked' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleCellClick(idx)}
                  aria-label={ariaLabel}
                  aria-pressed={isFilled}
                  disabled={!canPlay || isFilled}
                >
                  <span className={`tttMark ${value === PLAYER_X ? 'isX' : value === PLAYER_O ? 'isO' : ''}`}>
                    {value || ''}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="tttInfo" aria-live="polite">
            <div className="tttStatus">{status}</div>
            <div className="tttHint">
              {canPlay ? 'Click a square to place your mark.' : 'Start a new game to play again.'}
            </div>
          </div>

          <div className="tttActions">
            <button type="button" className="tttButton" onClick={resetGame}>
              New game
            </button>
          </div>
        </section>

        <footer className="tttFooter">
          <span className="tttFooterText">First to three in a row wins.</span>
        </footer>
      </main>
    </div>
  );
}
