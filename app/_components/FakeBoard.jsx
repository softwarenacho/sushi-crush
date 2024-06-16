import { useEffect, useState } from 'react';
import './styles.css';

const figures = ['onigiri', 'maki', 'nigiri', 'noodle', 'rice', 'temaki'];
const boardSize = 10;

const getRandomFigure = () =>
  figures[Math.floor(Math.random() * figures.length)];

const generateBoard = () => {
  let board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(null).map(getRandomFigure));

  while (hasMatches(board)) {
    board = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null).map(getRandomFigure));
  }
  return board;
};

const hasMatches = (board) => {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (
        (col < boardSize - 2 &&
          board[row][col] === board[row][col + 1] &&
          board[row][col] === board[row][col + 2]) ||
        (row < boardSize - 2 &&
          board[row][col] === board[row + 1][col] &&
          board[row][col] === board[row + 2][col])
      ) {
        return true;
      }
    }
  }
  return false;
};

const FakeBoard = () => {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [matches, setMatches] = useState([]);
  const [matchIndicators, setMatchIndicators] = useState([]);
  const [swapInfo, setSwapInfo] = useState(null);

  useEffect(() => {
    setBoard(generateBoard());
  }, []);

  const findMatches = (board) => {
    const foundMatches = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        let matchLength = 1;
        while (
          col + matchLength < boardSize &&
          board[row][col] === board[row][col + matchLength]
        ) {
          matchLength++;
        }
        if (matchLength >= 3) {
          foundMatches.push({
            row,
            col,
            length: matchLength,
            horizontal: true,
          });
        }
        matchLength = 1;
        while (
          row + matchLength < boardSize &&
          board[row][col] === board[row + matchLength][col]
        ) {
          matchLength++;
        }
        if (matchLength >= 3) {
          foundMatches.push({
            row,
            col,
            length: matchLength,
            horizontal: false,
          });
        }
      }
    }
    return foundMatches;
  };

  const processMatches = (matches, newBoard) => {
    let newScore = 0;
    matches.forEach((match) => {
      newScore += match.length;
      for (let i = 0; i < match.length; i++) {
        if (match.horizontal) {
          newBoard[match.row][match.col + i] = null;
        } else {
          newBoard[match.row + i][match.col] = null;
        }
      }
    });
    return newScore;
  };

  const handleMatches = (newBoard, initialScore) => {
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
        setAnimating(false);
        setScore(totalScore);
        handleMatches(newBoard, totalScore);
      }, 500);
    } else {
      setBoard(newBoard);
    }
  };

  const fillBoard = (newBoard) => {
    for (let col = 0; col < boardSize; col++) {
      for (let row = boardSize - 1; row >= 0; row--) {
        if (newBoard[row][col] === null) {
          for (let fillRow = row; fillRow >= 0; fillRow--) {
            if (newBoard[fillRow][col] !== null) {
              newBoard[row][col] = newBoard[fillRow][col];
              newBoard[fillRow][col] = null;
              break;
            }
          }
        }
        if (newBoard[row][col] === null) {
          newBoard[row][col] = getRandomFigure();
        }
      }
    }
  };

  const swap = (row1, col1, row2, col2) => {
    const newBoard = board.map((row) => row.slice());
    [newBoard[row1][col1], newBoard[row2][col2]] = [
      newBoard[row2][col2],
      newBoard[row1][col1],
    ];
    return newBoard;
  };

  const handleClick = (row, col) => {
    if (animating) return;
    if (selected) {
      const [selectedRow, selectedCol] = selected;
      if (
        (Math.abs(selectedRow - row) === 1 && selectedCol === col) ||
        (Math.abs(selectedCol - col) === 1 && selectedRow === row)
      ) {
        setSwapInfo({
          row1: selectedRow,
          col1: selectedCol,
          row2: row,
          col2: col,
        });
        setAnimating(true);
        setTimeout(() => {
          const newBoard = swap(selectedRow, selectedCol, row, col);
          handleMatches(newBoard, score);
          setSelected(null);
          setSwapInfo(null);
        }, 1000);
      } else {
        setSelected([row, col]);
      }
    } else {
      setSelected([row, col]);
    }
  };

  return (
    <div className='game'>
      <div className='score'>Score: {score}</div>
      <div className='board'>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className='row'>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${
                  selected &&
                  selected[0] === rowIndex &&
                  selected[1] === colIndex
                    ? 'selected'
                    : ''
                } 
                  ${
                    swapInfo &&
                    swapInfo.row1 === rowIndex &&
                    swapInfo.col1 === colIndex
                      ? 'swap'
                      : ''
                  } 
                  ${
                    swapInfo &&
                    swapInfo.row2 === rowIndex &&
                    swapInfo.col2 === colIndex
                      ? 'swap'
                      : ''
                  } 
                  ${
                    matches.some(
                      (match) =>
                        match.row === rowIndex &&
                        match.col <= colIndex &&
                        colIndex < match.col + match.length &&
                        match.horizontal,
                    )
                      ? 'match'
                      : ''
                  } 
                  ${
                    matches.some(
                      (match) =>
                        match.col === colIndex &&
                        match.row <= rowIndex &&
                        rowIndex < match.row + match.length &&
                        !match.horizontal,
                    )
                      ? 'match'
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
                  backgroundSize: '90%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              ></div>
            ))}
          </div>
        ))}
        {matchIndicators.map((indicator, index) => (
          <div
            key={index}
            className='match-indicator'
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
          className='generate'
          onClick={() => {
            setBoard(generateBoard());
            setScore(0);
          }}
        >
          Generate
        </button>
      )}
    </div>
  );
};

export default FakeBoard;
