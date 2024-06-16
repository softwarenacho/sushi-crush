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

const Board = () => {
  const [board, setBoard] = useState<BoardInterface>([]);
  const [score, setScore] = useState<number>(0);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [animating, setAnimating] = useState<boolean>(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchIndicators, setMatchIndicators] = useState<MatchIndicator[]>([]);
  const [swapInfo, setSwapInfo] = useState<SwapInfo>(null);
  const [displayedScore, setDisplayedScore] = useState<number>(0);

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
      if (
        (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
        (Math.abs(selectedCol - col) === 1 && selectedRow === row)
      ) {
        if (isSwapValid(selectedRow, selectedCol, row, col)) {
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
      <div className={styles.score}>Score: {displayedScore}</div>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`${styles.cell} ${
                  selected &&
                  selected[0] === rowIndex &&
                  selected[1] === colIndex
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
                  backgroundImage: `url('/sushi/${cell}.webp')`,
                }}
              ></div>
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
        <button
          className={styles.generate}
          onClick={() => {
            setBoard(generateBoard());
            setScore(0);
            setDisplayedScore(0);
          }}
        >
          Reset Board
        </button>
      )}
    </div>
  );
};

export default Board;
