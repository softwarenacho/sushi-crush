'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Instructions from './_components/Instructions';
import Title from './_components/Title';
import styles from './_styles/page.module.scss';

export default function Home() {
  const router = useRouter();
  const [showInstructions, setInstructions] = useState<boolean>(false);
  const [hideInstructions, setHideInstructions] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('hideInstructions', (!hideInstructions).toString());
  }, [hideInstructions]);

  useEffect(() => {
    const storedValue = localStorage.getItem('hideInstructions');
    setHideInstructions(storedValue === 'true');
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        <Title title='Sushi Crush' />
        <p>
          Dive into the delicious world of <b>Sushi Crush</b>, a delightful
          match-3 puzzle game built using React and Next.js.
        </p>
        <p>
          Players swap adjacent sushi pieces on a board to create rows or
          columns of three or more identical pieces.
        </p>
        <p>
          The game continues infinitely to achieve the highest score possible
          and the best average.
        </p>
        <p>
          Source Code:
          <a
            href='https://github.com/softwarenacho/sushi-crush'
            target='_blank'
            rel='noopener noreferrer'
          >
            Github
          </a>
        </p>
        <div className={styles.buttons}>
          {hideInstructions ? (
            <Link href='/infinite' className={styles.newGame} role='button'>
              Infinite Mode
            </Link>
          ) : (
            <button
              className={styles.newGame}
              role='button'
              onClick={() => {
                setInstructions(true);
              }}
            >
              Infinite Mode
            </button>
          )}
          <Link href='/levels' className={styles.newGame} role='button'>
            Levels
          </Link>
        </div>
        <label>
          <input
            checked={hideInstructions}
            onChange={() => setHideInstructions(!hideInstructions)}
            type='checkbox'
          />
          Don{"'"}t show instructions
        </label>
        {showInstructions && (
          <Instructions
            closeModal={() => setInstructions(false)}
            openGame={(hide: boolean) => {
              router.push('/infinite');
            }}
          />
        )}
      </main>
    </Suspense>
  );
}
