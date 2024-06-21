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
      stars: 0,
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
      stars: 0,
      figures: firstLevelsFigures,
      size: 6,
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
      stars: 0,
      figures: firstLevelsFigures,
      size: 6,
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
      stars: 0,
      figures: secondLevelsFigures,
      size: 8,
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
      stars: 0,
      figures: secondLevelsFigures,
      size: 8,
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
      stars: 0,
      figures: secondLevelsFigures,
      size: 8,
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
      stars: 0,
      figures: thirdLevelsFigures,
      size: 10,
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
      stars: 0,
      figures: thirdLevelsFigures,
      size: 10,
      goal: {
        level: 8,
        score: 150,
        stars: {
          1: { moves: 50 },
          2: { moves: 30 },
          3: { moves: 20 },
        },
      },
    },
    {
      level: 9,
      stars: 0,
      figures: thirdLevelsFigures,
      size: 12,
      goal: {
        level: 9,
        score: 200,
        stars: {
          1: { moves: 80 },
          2: { moves: 50 },
          3: { moves: 35 },
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
        <Board
          close={() => setLevel(0)}
          size={levels[selectedLevel - 1].size}
          figures={levels[selectedLevel - 1].figures}
          goal={levels[selectedLevel - 1].goal}
        />
      )}
    </main>
  );
};

export default Levels;
