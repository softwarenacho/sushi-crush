import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  BoardInterface,
  Match,
  MatchIndicator,
  SwapInfo,
} from '../_interfaces/Board.interface';
import styles from '../_styles/Board.module.scss';
import {
  fillBoard,
  findMatches,
  generateBoard,
  processMatches,
} from '../_utils/Board.helper';
import useAudio from '../_utils/useAudio';
import useBgSound from '../_utils/useBackground';
import { Star } from './LevelSelector';

export interface WinLevel {
  stars: number;
  level: number;
}

const Board = ({
  close,
  size = 10,
  figures = ['onigiri', 'maki', 'nigiri', 'noodle', 'rice', 'temaki'],
  goal,
}: {
  close: () => void;
  size?: number;
  figures?: string[];
  goal?: {
    level: number;
    time?: number;
    score?: number;
    stars: {
      1: Star;
      2: Star;
      3: Star;
    };
  };
}) => {
  const [board, setBoard] = useState<BoardInterface>([]);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [animating, setAnimating] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<WinLevel | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchIndicators, setMatchIndicators] = useState<MatchIndicator[]>([]);
  const [swapInfo, setSwapInfo] = useState<SwapInfo>(null);
  const [displayedScore, setDisplayedScore] = useState<number>(0);
  const [firstCell, setFirstCell] = useState<{
    row: number;
    col: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [bgMusicOn, setBgMusicOn] = useState(false);
  const [sfxOn, setSfxOn] = useState(false);

  const { play: matchSound } = useAudio('/sounds/match.mp3');
  const { play: selectSound } = useAudio('/sounds/select.mp3');
  const { play: playWinSound, stop: stopWinSound } = useBgSound(
    '/sounds/end.mp3',
    0.2,
    true,
  );
  const { play: backgroundSound, stop: stopBgSound } = useBgSound(
    '/sounds/bg.mp3',
    0.2,
    true,
  );
  const toggleBgMusic = () => {
    bgMusicOn ? stopBgSound() : backgroundSound();
    const newValue = !bgMusicOn;
    setBgMusicOn(newValue);
    localStorage.setItem('bgMusicOn', JSON.stringify(newValue));
  };

  const toggleSfx = () => {
    const newValue = !sfxOn;
    setSfxOn(newValue);
    localStorage.setItem('sfxOn', JSON.stringify(newValue));
  };

  const handleMatches = (newBoard: BoardInterface, initialScore: number) => {
    let totalScore = initialScore;
    let foundMatches = findMatches(newBoard);
    if (foundMatches.length > 0) {
      setMatches(foundMatches);
      setMatchIndicators(
        foundMatches.map((match) => ({ ...match, score: match.length })),
      );
      setAnimating(true);
      if (sfxOn) matchSound();
      setTimeout(() => {
        totalScore += processMatches(foundMatches, newBoard);
        fillBoard(newBoard, size, figures);
        setMatches([]);
        setMatchIndicators([]);
        setBoard([...newBoard]);
        setAnimating(false);
        setScore(totalScore);
        handleMatches(newBoard, totalScore);
      }, 500);
    } else {
      setBoard(newBoard);
    }
  };

  const swap = (
    row1: number,
    col1: number,
    row2: number,
    col2: number,
  ): BoardInterface => {
    const newBoard = board.map((row) => row.slice());
    [newBoard[row1][col1], newBoard[row2][col2]] = [
      newBoard[row2][col2],
      newBoard[row1][col1],
    ];
    return newBoard;
  };

  const isSwapValid = (
    row1: number,
    col1: number,
    row2: number,
    col2: number,
  ): boolean => {
    const tempBoard = swap(row1, col1, row2, col2);
    const foundMatches = findMatches(tempBoard);
    return foundMatches.length > 0;
  };

  const handleClick = (row: number, col: number) => {
    if (gameOver) return;
    if (animating) return;
    if (sfxOn) selectSound();
    if (selected) {
      const [selectedRow, selectedCol] = selected;
      const isAdyacent =
        (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
        (Math.abs(selectedCol - col) === 1 && selectedRow === row);
      if (isAdyacent) {
        const isValid = isSwapValid(selectedRow, selectedCol, row, col);
        if (isValid) {
          setSwapInfo({
            row1: selectedRow,
            col1: selectedCol,
            row2: row,
            col2: col,
          });
          setAnimating(true);
          setTimeout(() => {
            const newBoard = swap(selectedRow, selectedCol, row, col);
            setBoard(newBoard);
            handleMatches(newBoard, score);
            setSelected(null);
            setSwapInfo(null);
            const newMoves = moves + 1;
            setMoves(newMoves);
          }, 500);
        } else {
          setSelected([row, col]);
        }
      } else {
        setSelected([row, col]);
      }
    } else {
      setSelected([row, col]);
    }
  };

  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    row: number,
    col: number,
  ): void => {
    if (gameOver) return;
    setFirstCell({
      row,
      col,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (!firstCell) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - firstCell.startX;
    const deltaY = endY - firstCell.startY;
    let direction: 'up' | 'down' | 'left' | 'right' | '' = '';
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }
    handleSwipe(firstCell.row, firstCell.col, direction);
    setFirstCell(null);
  };

  const handleSwipe = (
    row: number,
    col: number,
    direction: 'up' | 'down' | 'left' | 'right',
  ): void => {
    let targetRow = row;
    let targetCol = col;
    switch (direction) {
      case 'right':
        targetCol = col + 1;
        break;
      case 'left':
        targetCol = col - 1;
        break;
      case 'down':
        targetRow = row + 1;
        break;
      case 'up':
        targetRow = row - 1;
        break;
      default:
        break;
    }
    if (
      targetRow >= 1 &&
      targetRow < board.length &&
      targetCol >= 1 &&
      targetCol < board[0].length
    ) {
      if (isSwapValid(row, col, targetRow, targetCol)) {
        setSwapInfo({
          row1: row,
          col1: col,
          row2: targetRow,
          col2: targetCol,
        });
        setAnimating(true);
        setTimeout(() => {
          const newBoard = swap(row, col, targetRow, targetCol);
          setBoard(newBoard);
          handleMatches(newBoard, score);
          setSelected(null);
          setSwapInfo(null);
          const newMoves = moves + 1;
          setMoves(newMoves);
        }, 500);
      }
    }
  };

  const calculateStars = () => {
    let stars = 0;
    if (goal?.score) {
      if (goal.score <= score) {
        if (goal.stars[1].moves && moves <= goal.stars[1].moves) {
          stars = 1;
        }
        if (goal.stars[2].moves && moves <= goal.stars[2].moves) {
          stars = 2;
        }
        if (goal.stars[3].moves && moves <= goal.stars[3].moves) {
          stars = 3;
        }
      }
    }
    return stars;
  };

  const setCompleteLevel = async (win: WinLevel) => {
    const localLevels = await JSON.parse(
      localStorage.getItem('levels') as string,
    );
    if (localLevels) {
      const newLevels = localLevels.map((lev: WinLevel) => {
        if (lev.level === win.level && lev.stars < win.stars) {
          return win;
        }
        return lev;
      });
      if (!newLevels.find((lev: WinLevel) => lev.level === win.level)) {
        localStorage.setItem('levels', JSON.stringify([...newLevels, win]));
      } else {
        localStorage.setItem('levels', JSON.stringify(newLevels));
      }
    } else {
      localStorage.setItem('levels', JSON.stringify([win]));
    }
  };

  useEffect(() => {
    if (goal && gameOver) {
      const calculateWin = {
        stars: calculateStars(),
        level: goal.level,
      };
      setCompleteLevel(calculateWin);
      stopBgSound();
      playWinSound();
      setWon(calculateWin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  useEffect(() => {
    if (goal && displayedScore === score) {
      calculateStars() > 0 && setGameOver(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedScore, score]);

  useEffect(() => {
    if (bgMusicOn) backgroundSound();
  }, [backgroundSound, bgMusicOn]);

  useEffect(() => {
    if (score > displayedScore) {
      let currentScore = displayedScore;
      const incrementInterval = setInterval(() => {
        currentScore++;
        setDisplayedScore(currentScore);
        if (currentScore >= score) {
          clearInterval(incrementInterval);
        }
      }, 50);
    }
  }, [displayedScore, gameOver, score]);

  useEffect(() => {
    const storedBgMusic = localStorage.getItem('bgMusicOn');
    const storedSfx = localStorage.getItem('sfxOn');
    if (storedBgMusic !== null) {
      setBgMusicOn(JSON.parse(storedBgMusic));
    }
    if (storedSfx !== null) {
      setSfxOn(JSON.parse(storedSfx));
    }
    setBoard(generateBoard(size, figures));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.game}>
      {goal && (
        <div className={styles.goals}>
          <h2>Goals</h2>
          <div className={styles.scores}>
            <p>
              Score <b>{goal.score}</b> points to win
            </p>
            <p>
              <span className={styles.stars}>
                <Image
                  src='/icons/star-fill.png'
                  alt='Star Full'
                  width={16}
                  height={16}
                />
              </span>
              <b>{goal.stars[1].moves}</b> moves
            </p>
            <p>
              <span className={styles.stars}>
                <Image
                  src='/icons/star-fill.png'
                  alt='Star Full'
                  width={16}
                  height={16}
                />
                <Image
                  src='/icons/star-fill.png'
                  alt='Star Full'
                  width={16}
                  height={16}
                />
              </span>
              <b>{goal.stars[2].moves}</b> moves
            </p>
            <p>
              <span className={styles.stars}>
                <Image
                  src='/icons/star-fill.png'
                  alt='Star Full'
                  width={16}
                  height={16}
                />
                <Image
                  src='/icons/star-fill.png'
                  alt='Star Full'
                  width={16}
                  height={16}
                />
                <Image
                  src='/icons/star-fill.png'
                  alt='Star Full'
                  width={16}
                  height={16}
                />
              </span>
              <b>{goal.stars[3].moves}</b> moves
            </p>
          </div>
        </div>
      )}
      <div
        className={`${styles.board} ${gameOver ? styles.win : ''}`}
        style={{
          gridTemplateColumns: `repeat(${size}, 3rem)`,
          gridTemplateRows: `repeat(${size}, 3rem)`,
        }}
      >
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`${styles.cell} ${
                  (selected &&
                    selected[0] === rowIndex &&
                    selected[1] === colIndex) ||
                  (firstCell &&
                    firstCell.row === rowIndex &&
                    firstCell.col === colIndex)
                    ? styles.selected
                    : ''
                } 
                  ${
                    swapInfo &&
                    ((swapInfo.row1 === rowIndex &&
                      swapInfo.col1 === colIndex) ||
                      (swapInfo.row2 === rowIndex &&
                        swapInfo.col2 === colIndex))
                      ? styles.swap
                      : ''
                  } 
                  ${
                    matches.some(
                      (match) =>
                        match.row === rowIndex &&
                        match.col <= colIndex &&
                        colIndex < match.col + match.length &&
                        match.horizontal,
                    ) ||
                    matches.some(
                      (match) =>
                        match.col === colIndex &&
                        match.row <= rowIndex &&
                        rowIndex < match.row + match.length &&
                        !match.horizontal,
                    )
                      ? styles.match
                      : ''
                  }`}
                onClick={() => handleClick(rowIndex, colIndex)}
                onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                onTouchEnd={handleTouchEnd}
                style={{
                  backgroundColor: gameOver ? '#a9c9aa' : '',
                  borderColor: gameOver ? '#d498a3' : '',
                  transform: swapInfo
                    ? swapInfo.row1 === rowIndex && swapInfo.col1 === colIndex
                      ? `translate(${(swapInfo.col2 - swapInfo.col1) * 40}px, ${
                          (swapInfo.row2 - swapInfo.row1) * 40
                        }px)`
                      : swapInfo.row2 === rowIndex && swapInfo.col2 === colIndex
                      ? `translate(${(swapInfo.col1 - swapInfo.col2) * 40}px, ${
                          (swapInfo.row1 - swapInfo.row2) * 40
                        }px)`
                      : 'none'
                    : 'none',
                  transition: swapInfo ? 'transform 1s' : 'none',
                }}
              >
                <Image
                  src={`/sushi/${cell}.webp`}
                  alt={cell as string}
                  width={32}
                  height={32}
                />
              </div>
            ))}
          </div>
        ))}
        {matchIndicators.map((indicator, index) => (
          <div
            key={index}
            className={styles.matchIndicator}
            style={{
              top: `${indicator.row * 40}px`,
              left: `${
                indicator.horizontal
                  ? (indicator.col + indicator.length / 2) * 40 - 20
                  : indicator.col * 40
              }px`,
              transform: `${
                indicator.horizontal ? 'translateX(-50%)' : 'translateY(-50%)'
              }`,
            }}
          >
            +{indicator.score}
          </div>
        ))}
      </div>
      {won && (
        <>
          <h2 className={styles.won}>Level {won.level} Completed!</h2>
          <div className={styles.stars}>
            {[1, 2, 3].map((n) => {
              if (n <= won.stars) {
                return (
                  <Image
                    key={`Level ${won.level} Star ${n}`}
                    src='/icons/star-fill.png'
                    alt='Star Full'
                    width={16}
                    height={16}
                  />
                );
              } else {
                return (
                  <Image
                    key={`Level ${won.level} Star ${n}`}
                    src='/icons/star-empty.png'
                    alt='Star Empty'
                    width={16}
                    height={16}
                  />
                );
              }
            })}
          </div>
        </>
      )}
      {score > 0 && (
        <div className={styles.score}>
          <span>
            Moves <b>{moves}</b>
          </span>
          <span>
            Score <b>{displayedScore}</b>
          </span>
          <span>
            Avg <b>{(score / moves).toFixed(1)}</b>
          </span>
        </div>
      )}
      <div className={styles.soundSwitch}>
        <label className={styles.switch}>
          <input type='checkbox' checked={bgMusicOn} onChange={toggleBgMusic} />
          <span className={styles.slider}></span>
          <Image
            src='/icons/music.webp'
            width={32}
            height={32}
            alt='Toggle Background Music'
          />
        </label>
        <label className={styles.switch}>
          <input type='checkbox' checked={sfxOn} onChange={toggleSfx} />
          <span className={styles.slider}></span>
          <Image
            src='/icons/sound.webp'
            width={32}
            height={32}
            alt='Toggle Background Music'
          />
        </label>
      </div>
      {score > 0 && !gameOver && (
        <button
          className={styles.generate}
          role='button'
          onClick={() => {
            setBoard(generateBoard(size, figures));
            setScore(0);
            setDisplayedScore(0);
            setGameOver(false);
          }}
        >
          Reset
        </button>
      )}
      <button
        className={styles.generate}
        role='button'
        onClick={() => {
          close();
          stopBgSound();
          stopWinSound();
        }}
      >
        Close
      </button>
    </div>
  );
};

export default Board;
