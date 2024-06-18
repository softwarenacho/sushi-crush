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

const Board = ({ close }: { close: () => void }) => {
  const [board, setBoard] = useState<BoardInterface>([]);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [animating, setAnimating] = useState<boolean>(false);
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

  const handleMatches = (newBoard: BoardInterface, initialScore: number) => {
    let totalScore = initialScore;
    let foundMatches = findMatches(newBoard);
    if (foundMatches.length > 0) {
      setMatches(foundMatches);
      setMatchIndicators(
        foundMatches.map((match) => ({ ...match, score: match.length })),
      );
      setAnimating(true);
      setTimeout(() => {
        totalScore += processMatches(foundMatches, newBoard);
        fillBoard(newBoard);
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
    if (animating) return;
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
    e.preventDefault();
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
      targetRow >= 0 &&
      targetRow < board.length &&
      targetCol >= 0 &&
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

  useEffect(() => {
    setBoard(generateBoard());
  }, []);

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
  }, [displayedScore, score]);

  return (
    <div className={styles.game}>
      <div className={styles.board}>
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
      {score > 0 && (
        <button
          className={styles.generate}
          role='button'
          onClick={() => {
            setBoard(generateBoard());
            setScore(0);
            setDisplayedScore(0);
          }}
        >
          Reset Board
        </button>
      )}
      <button
        className={styles.generate}
        role='button'
        onClick={() => {
          close();
        }}
      >
        Close
      </button>
    </div>
  );
};

export default Board;
