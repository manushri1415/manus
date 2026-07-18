import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import './SnakeGame.css';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

type SnakeGameProps = {
  isWindowActive?: boolean;
  isCompactViewport?: boolean;
};

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 72;
const HIGH_SCORE_STORAGE_KEY = 'manuSnakeHighScore';
const GAME_HEAD_SRC = `${import.meta.env.BASE_URL}assets/icons/gamehead.png`;
const CELL_PERCENT = 100 / GRID_SIZE;
const OFFER_GOALS = [4, 5, 6, 7, 8, 9];
const DEFAULT_HEAD_SIZE = 42;

const directionVectors: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const initialSnake = (): Position[] => [{ x: 10, y: 10 }];

const areSamePosition = (a: Position, b: Position) => a.x === b.x && a.y === b.y;

const getOppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case 'UP':
      return 'DOWN';
    case 'DOWN':
      return 'UP';
    case 'LEFT':
      return 'RIGHT';
    case 'RIGHT':
      return 'LEFT';
    default:
      return 'LEFT';
  }
};

const shouldShowTouchControls = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 760;
};

const pickRandom = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

export const SnakeGame = ({ isWindowActive = true, isCompactViewport = false }: SnakeGameProps) => {
  const [snake, setSnake] = useState<Position[]>(() => initialSnake());
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showTouchControls, setShowTouchControls] = useState(() => shouldShowTouchControls());
  const [goalOffers, setGoalOffers] = useState(() => pickRandom(OFFER_GOALS));

  const directionRef = useRef<Direction>('RIGHT');
  const rootRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSizePx, setBoardSizePx] = useState(0);

  const generateFood = useCallback((currentSnake: Position[]) => {
    let nextFood = { x: 0, y: 0 };

    do {
      nextFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((segment) => areSamePosition(segment, nextFood)));

    return nextFood;
  }, []);

  const focusBoard = useCallback(() => {
    rootRef.current?.focus({ preventScroll: true });
    setIsFocused(true);
  }, []);

  const resetGame = useCallback(() => {
    const nextSnake = initialSnake();
    setSnake(nextSnake);
    setFood(generateFood(nextSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setHasStarted(false);
    setIsPaused(true);
    setGameOver(false);
    setHasWon(false);
    setGoalOffers(pickRandom(OFFER_GOALS));
    window.setTimeout(() => {
      if (isWindowActive) {
        focusBoard();
      }
    }, 0);
  }, [focusBoard, generateFood, isWindowActive]);

  useEffect(() => {
    try {
      const storedHighScore = window.localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
      if (storedHighScore) {
        const parsed = Number(storedHighScore);
        if (!Number.isNaN(parsed)) {
          setHighScore(parsed);
        }
      }
    } catch {
      // Ignore local storage errors so the game still works in restricted contexts.
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const updateTouchMode = () => setShowTouchControls(shouldShowTouchControls());

    updateTouchMode();
    window.addEventListener('resize', updateTouchMode);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateTouchMode);
      return () => {
        window.removeEventListener('resize', updateTouchMode);
        mediaQuery.removeEventListener('change', updateTouchMode);
      };
    }

    mediaQuery.addListener(updateTouchMode);

    return () => {
      window.removeEventListener('resize', updateTouchMode);
      mediaQuery.removeListener(updateTouchMode);
    };
  }, []);

  useEffect(() => {
    const boardElement = boardRef.current;
    if (!boardElement) {
      return;
    }

    const updateBoardSize = () => {
      setBoardSizePx(boardElement.clientWidth);
    };

    updateBoardSize();

    const resizeObserver = new ResizeObserver(updateBoardSize);
    resizeObserver.observe(boardElement);
    window.addEventListener('resize', updateBoardSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateBoardSize);
    };
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (isWindowActive) {
      window.setTimeout(focusBoard, 0);
      return;
    }

    setIsFocused(false);
    rootRef.current?.blur();
  }, [focusBoard, isWindowActive]);

  useEffect(() => {
    if (!isWindowActive && hasStarted && !gameOver) {
      setIsPaused(true);
    }
  }, [gameOver, hasStarted, isWindowActive]);

  const updateDirection = useCallback((nextDirection: Direction) => {
    if (directionRef.current === getOppositeDirection(nextDirection)) {
      return;
    }

    directionRef.current = nextDirection;
    setDirection(nextDirection);

    if (!gameOver) {
      setHasStarted(true);
      setIsPaused(false);
    }
  }, [gameOver]);

  const handleMoveInput = useCallback((nextDirection: Direction) => {
    if (!isWindowActive) {
      return;
    }

    focusBoard();
    updateDirection(nextDirection);
  }, [focusBoard, isWindowActive, updateDirection]);

  const handleKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isWindowActive || !isFocused) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        updateDirection('UP');
        event.preventDefault();
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        updateDirection('DOWN');
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        updateDirection('LEFT');
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        updateDirection('RIGHT');
        event.preventDefault();
        break;
      case ' ':
        if (hasStarted && !gameOver && !hasWon) {
          setIsPaused((prev) => !prev);
        }
        event.preventDefault();
        break;
      case 'Enter':
        if (gameOver || hasWon) {
          resetGame();
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  }, [gameOver, hasStarted, hasWon, isFocused, isWindowActive, resetGame, updateDirection]);

  useEffect(() => {
    if (isPaused || gameOver || hasWon || !hasStarted) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSnake((currentSnake) => {
        const vector = directionVectors[directionRef.current];
        const nextHead = {
          x: currentSnake[0].x + vector.x,
          y: currentSnake[0].y + vector.y,
        };

        if (
          nextHead.x < 0 ||
          nextHead.x >= GRID_SIZE ||
          nextHead.y < 0 ||
          nextHead.y >= GRID_SIZE ||
          currentSnake.some((segment) => areSamePosition(segment, nextHead))
        ) {
          setGameOver(true);
          setIsPaused(true);
          return currentSnake;
        }

        const nextSnake = [nextHead, ...currentSnake];

        if (areSamePosition(nextHead, food)) {
          setScore((prev) => {
            const nextScore = prev + 10;
            const nextOffersCollected = nextScore / 10;

            setHighScore((currentHighScore) => {
              const nextHighScore = Math.max(currentHighScore, nextScore);
              try {
                window.localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(nextHighScore));
              } catch {
                // Ignore storage failures.
              }
              return nextHighScore;
            });

            if (nextOffersCollected >= goalOffers) {
              setHasWon(true);
              setIsPaused(true);
            }

            return nextScore;
          });

          if (score / 10 + 1 < goalOffers) {
            setFood(generateFood(nextSnake));
            setSpeed((prev) => Math.max(MIN_SPEED, prev - 4));
          }

          return nextSnake;
        }

        nextSnake.pop();
        return nextSnake;
      });
    }, speed);

    return () => window.clearInterval(intervalId);
  }, [food, gameOver, generateFood, goalOffers, hasStarted, hasWon, isPaused, score, speed]);

  const offersCollected = score / 10;
  const bestOffers = highScore / 10;
  const cellSizePx = boardSizePx > 0 ? boardSizePx / GRID_SIZE : 0;
  const headSizePx = cellSizePx > 0 ? Math.max(38, Math.min(48, cellSizePx * 2.75)) : DEFAULT_HEAD_SIZE;
  const usesTouchLayout = isCompactViewport || showTouchControls;
  const canTogglePause = hasStarted && !gameOver && !hasWon;

  const liveStatus = hasWon
    ? 'She got the job.'
    : gameOver
      ? `Application rejected. Applications sent: ${offersCollected}.`
      : !hasStarted
        ? `ManuSnake ready. Help Manushri apply to ${goalOffers} jobs. ${usesTouchLayout ? 'Use the touch pad or arrow keys to start.' : 'Use Arrow Keys or WASD to start.'}`
        : isPaused
          ? `Game paused. Score ${score}. High score ${highScore}.`
          : `Running. Score ${score}. High score ${highScore}.`;

  return (
    <div className={`manu-snake${usesTouchLayout ? ' manu-snake--compact' : ''}`}>
      <div className="manu-snake__status" aria-live="polite">
        {liveStatus}
      </div>

      <div className="manu-snake__toolbar">
        <div className="manu-snake__score-row">
          <span className="manu-snake__score-label">Applications: {offersCollected}/{goalOffers}</span>
          <span className="manu-snake__score-label">Best: {bestOffers}</span>
        </div>
        <div className="manu-snake__actions">
          <button type="button" className="manu-snake__button" onClick={resetGame}>
            New Game
          </button>
        </div>
      </div>

      <div className="manu-snake__playfield">
        <div
          ref={rootRef}
          tabIndex={0}
          role="application"
          aria-label={`ManuSnake game board. ${usesTouchLayout ? 'Use the touch controls or Arrow Keys or WASD to move.' : 'Use Arrow Keys or WASD to move.'} Press Space to pause.`}
          onKeyDown={handleKeyDown}
          onMouseDown={(event) => {
            event.stopPropagation();
            focusBoard();
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`manu-snake__board-shell${isFocused && isWindowActive ? ' is-focused' : ''}`}
        >
          <div
            ref={boardRef}
            className="manu-snake__board"
            style={{
              backgroundSize: `${CELL_PERCENT}% ${CELL_PERCENT}%`,
            }}
          >
            {hasStarted && !gameOver && !hasWon && (
              <>
                {snake.map((segment, index) => {
                  const isHead = index === 0;

                  if (isHead) {
                    const headHalf = headSizePx / 2;
                    const headCenterX = cellSizePx > 0 ? (segment.x + 0.5) * cellSizePx : 0;
                    const headCenterY = cellSizePx > 0 ? (segment.y + 0.5) * cellSizePx : 0;
                    const clampedCenterX = boardSizePx > 0
                      ? Math.min(boardSizePx - headHalf, Math.max(headHalf, headCenterX))
                      : headCenterX;
                    const clampedCenterY = boardSizePx > 0
                      ? Math.min(boardSizePx - headHalf, Math.max(headHalf, headCenterY))
                      : headCenterY;

                    return (
                      <div
                        key={`${segment.x}-${segment.y}-${index}`}
                        className="manu-snake__head"
                        style={{
                          left: `${clampedCenterX}px`,
                          top: `${clampedCenterY}px`,
                          width: `${headSizePx}px`,
                          height: `${headSizePx}px`,
                        }}
                      >
                        <img
                          src={GAME_HEAD_SRC}
                          alt=""
                          aria-hidden="true"
                          className="manu-snake__head-image"
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`${segment.x}-${segment.y}-${index}`}
                      className="manu-snake__segment"
                      style={{
                        left: `${segment.x * CELL_PERCENT}%`,
                        top: `${segment.y * CELL_PERCENT}%`,
                        width: `calc(${CELL_PERCENT}% - 2px)`,
                        height: `calc(${CELL_PERCENT}% - 2px)`,
                      }}
                    />
                  );
                })}

                <div
                  className="manu-snake__food"
                  aria-hidden="true"
                  style={{
                    left: `${(food.x + 0.5) * CELL_PERCENT}%`,
                    top: `${(food.y + 0.5) * CELL_PERCENT}%`,
                  }}
                >
                  <span>@</span>
                </div>
              </>
            )}

            {!hasStarted && !gameOver && (
              <div className="manu-snake__overlay">
                <div className="manu-snake__overlay-title">MANUSNAKE.EXE</div>
                <p>Quick, help Manushri apply to {goalOffers} jobs.</p>
                <p>Goal: submit {goalOffers} applications</p>
                <p>{usesTouchLayout ? 'Tap any direction to start' : 'Use Arrow Keys or WASD to start'}</p>
                <p>Pause anytime with Space or the pause button</p>
              </div>
            )}

            {hasStarted && isPaused && !gameOver && !hasWon && (
              <div className="manu-snake__overlay">
                <div className="manu-snake__overlay-title">GAME PAUSED</div>
                <p>Press Space or Resume to continue</p>
              </div>
            )}

            {hasWon && (
              <div className="manu-snake__overlay">
                <div className="manu-snake__overlay-title">SHE GOT THE JOB</div>
                <p>All the applications paid off.</p>
                <p>Applications sent: {offersCollected} / {goalOffers}</p>
                <button type="button" className="manu-snake__button" onClick={resetGame}>
                  Play Again
                </button>
                <p className="manu-snake__overlay-note">Press Enter or click Play Again.</p>
              </div>
            )}

            {gameOver && (
              <div className="manu-snake__overlay">
                <div className="manu-snake__overlay-title">APPLICATION REJECTED</div>
                <p>Applications sent: {score / 10}</p>
                <button type="button" className="manu-snake__button" onClick={resetGame}>
                  Apply Again
                </button>
                <p className="manu-snake__overlay-note">Windows recommends trying again.</p>
              </div>
            )}
          </div>
        </div>

        <p className="manu-snake__hint">
          {usesTouchLayout ? 'Touch pad or Arrow Keys / WASD to move. Use Space or Pause to stop.' : 'Arrow Keys / WASD to move. Space to pause.'}
        </p>

        {usesTouchLayout && (
          <div className="manu-snake__touch-controls" aria-label="Touch controls">
            <button
              type="button"
              className="manu-snake__touch-button manu-snake__touch-button--up"
              aria-label="Move up"
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onClick={() => handleMoveInput('UP')}
            >
              Up
            </button>
            <button
              type="button"
              className="manu-snake__touch-button manu-snake__touch-button--left"
              aria-label="Move left"
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onClick={() => handleMoveInput('LEFT')}
            >
              Left
            </button>
            <button
              type="button"
              className="manu-snake__touch-button manu-snake__touch-button--down"
              aria-label="Move down"
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onClick={() => handleMoveInput('DOWN')}
            >
              Down
            </button>
            <button
              type="button"
              className="manu-snake__touch-button manu-snake__touch-button--right"
              aria-label="Move right"
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onClick={() => handleMoveInput('RIGHT')}
            >
              Right
            </button>
            <button
              type="button"
              className="manu-snake__touch-button manu-snake__touch-button--pause"
              aria-label={isPaused ? 'Resume game' : 'Pause game'}
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
              onClick={() => {
                if (!canTogglePause) {
                  return;
                }

                focusBoard();
                setIsPaused((prev) => !prev);
              }}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
