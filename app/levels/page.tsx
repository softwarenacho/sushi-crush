'use client';

import Link from 'next/link';
import { useState } from 'react';
import Board from '../_components/Board';
import LevelSelector, { Level } from '../_components/LevelSelector';
import Title from '../_components/Title';
import styles from '../_styles/Levels.module.scss';

const Levels = () => {
  const [selectedLevel, setLevel] = useState(0);

  const firstLevelsFigures = ['onigiri', 'maki', 'nigiri', 'noodle'];
  const secondLevelsFigures = [...firstLevelsFigures, 'rice'];
  const thirdLevelsFigures = [...secondLevelsFigures, 'temaki'];

  const levels = [
    {
      level: 1,
      figures: firstLevelsFigures,
      size: 5,
      goal: {
        level: 1,
        score: 20,
        stars: {
          1: { moves: 10 },
          2: { moves: 8 },
          3: { moves: 5 },
        },
      },
    },
    {
      level: 2,
      figures: firstLevelsFigures,
      size: 5,
      goal: {
        level: 2,
        score: 50,
        stars: {
          1: { moves: 20 },
          2: { moves: 15 },
          3: { moves: 10 },
        },
      },
    },
    {
      level: 3,
      figures: firstLevelsFigures,
      size: 5,
      goal: {
        level: 3,
        score: 75,
        stars: {
          1: { moves: 30 },
          2: { moves: 20 },
          3: { moves: 15 },
        },
      },
    },
    {
      level: 4,
      figures: secondLevelsFigures,
      size: 5,
      goal: {
        level: 4,
        score: 50,
        stars: {
          1: { moves: 17 },
          2: { moves: 14 },
          3: { moves: 10 },
        },
      },
    },
    {
      level: 5,
      figures: secondLevelsFigures,
      size: 6,
      goal: {
        level: 5,
        score: 100,
        stars: {
          1: { moves: 40 },
          2: { moves: 25 },
          3: { moves: 20 },
        },
      },
    },
    {
      level: 6,
      figures: secondLevelsFigures,
      size: 6,
      goal: {
        level: 6,
        score: 150,
        stars: {
          1: { moves: 50 },
          2: { moves: 35 },
          3: { moves: 25 },
        },
      },
    },
    {
      level: 7,
      figures: secondLevelsFigures,
      size: 6,
      goal: {
        level: 7,
        score: 100,
        stars: {
          1: { moves: 50 },
          2: { moves: 30 },
          3: { moves: 20 },
        },
      },
    },
    {
      level: 8,
      figures: secondLevelsFigures,
      size: 7,
      goal: {
        level: 8,
        score: 120,
        stars: {
          1: { moves: 50 },
          2: { moves: 40 },
          3: { moves: 30 },
        },
      },
    },
    {
      level: 9,
      figures: secondLevelsFigures,
      size: 7,
      goal: {
        level: 9,
        score: 150,
        stars: {
          1: { moves: 80 },
          2: { moves: 55 },
          3: { moves: 45 },
        },
      },
    },
    {
      level: 10,
      figures: thirdLevelsFigures,
      size: 8,
      goal: {
        level: 10,
        score: 175,
        stars: {
          1: { moves: 80 },
          2: { moves: 60 },
          3: { moves: 45 },
        },
      },
    },
    {
      level: 11,
      figures: thirdLevelsFigures,
      size: 8,
      goal: {
        level: 11,
        score: 200,
        stars: {
          1: { moves: 80 },
          2: { moves: 60 },
          3: { moves: 45 },
        },
      },
    },
    {
      level: 12,
      figures: thirdLevelsFigures,
      size: 8,
      goal: {
        level: 12,
        score: 200,
        stars: {
          1: { moves: 60 },
          2: { moves: 50 },
          3: { moves: 40 },
        },
      },
    },
    {
      level: 13,
      figures: thirdLevelsFigures,
      size: 9,
      goal: {
        level: 13,
        score: 200,
        stars: {
          1: { moves: 80 },
          2: { moves: 65 },
          3: { moves: 50 },
        },
      },
    },
    {
      level: 14,
      figures: thirdLevelsFigures,
      size: 10,
      goal: {
        level: 14,
        score: 200,
        stars: {
          1: { moves: 80 },
          2: { moves: 55 },
          3: { moves: 50 },
        },
      },
    },
    {
      level: 15,
      figures: thirdLevelsFigures,
      size: 10,
      goal: {
        level: 15,
        score: 250,
        stars: {
          1: { moves: 90 },
          2: { moves: 65 },
          3: { moves: 50 },
        },
      },
    },
  ] as Level[];

  return (
    <main className={styles.main}>
      <Title
        title={
          selectedLevel
            ? `Sushi Crush - Level ${selectedLevel}`
            : 'Sushi Crush - Levels'
        }
      />
      {!selectedLevel && (
        <>
          <LevelSelector setLevel={setLevel} levels={levels} />
          <Link href='/' className={styles.button} role='button'>
            Close
          </Link>
        </>
      )}
      {!!selectedLevel && (
        <div key={selectedLevel}>
          <Board
            close={() => setLevel(0)}
            next={() =>
              selectedLevel + 1 <= levels.length
                ? setLevel(selectedLevel + 1)
                : alert('Thanks for playing. More levels in process...')
            }
            size={levels[selectedLevel - 1].size}
            figures={levels[selectedLevel - 1].figures}
            goal={levels[selectedLevel - 1].goal}
          />
        </div>
      )}
    </main>
  );
};

export default Levels;
