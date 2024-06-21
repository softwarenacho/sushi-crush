'use client';

import Link from 'next/link';
import { useState } from 'react';
import Board from '../_components/Board';
import LevelSelector, { Level } from '../_components/LevelSelector';
import Title from '../_components/Title';
import styles from '../_styles/Levels.module.scss';

const Levels = () => {
  const [selectedLevel, setLevel] = useState(0);

  const levels = [
    { number: 1, state: 'played', stars: 2 },
    { number: 2, state: 'unlocked', stars: 0 },
    { number: 3, state: 'locked', stars: 0 },
    { number: 4, state: 'locked', stars: 0 },
    { number: 5, state: 'locked', stars: 0 },
    { number: 6, state: 'locked', stars: 0 },
    { number: 7, state: 'locked', stars: 0 },
    { number: 8, state: 'locked', stars: 0 },
    { number: 9, state: 'locked', stars: 0 },
    { number: 10, state: 'locked', stars: 0 },
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
          size={5}
          figures={['onigiri', 'nigiri', 'rice', 'temaki']}
        />
      )}
    </main>
  );
};

export default Levels;
