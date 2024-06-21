'use client';

import Board from '@/app/_components/Board';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import Instructions from './_components/Instructions';
import styles from './_styles/page.module.scss';

export default function Home() {
  const [newGame, setNewGame] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hideInstructions, setHideInstructions] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('hideInstructions', (!hideInstructions).toString());
  }, [hideInstructions]);

  useEffect(() => {
    const storedValue = localStorage.getItem('hideInstructions');
    const checked = storedValue === 'true';
    setHideInstructions(checked);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        <Image src='/sushi/onigiri.webp' alt='Onigiri' width={64} height={64} />
        <h1>Sushi Crush</h1>
        {!newGame && (
          <>
            <p>
              Dive into the delicious world of <b>Sushi Crush</b>, a delightful
              match-3 puzzle game built using React and Next.js.
            </p>
            <p>
              Players swap adjacent sushi pieces on a board to create rows or
              columns of three or more identical pieces.
            </p>
            <p>
              The game continues infinitely to achieve the highest score
              possible and the best average.
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
            <button
              className={styles.newGame}
              role='button'
              onClick={() => {
                if (hideInstructions) {
                  setNewGame(true);
                  setIsOpen(false);
                } else {
                  setIsOpen(true);
                }
              }}
            >
              Play
            </button>
            <label>
              <input
                checked={hideInstructions}
                onChange={() => setHideInstructions(!hideInstructions)}
                type='checkbox'
              />
              Hide instructions
            </label>
            {isOpen && (
              <Instructions
                closeModal={() => setIsOpen(false)}
                openGame={(hide: boolean) => {
                  setNewGame(true);
                  setIsOpen(false);
                  setHideInstructions(hide);
                }}
              />
            )}
          </>
        )}
        {newGame && (
          <section>
            <Board close={() => setNewGame(false)} />
          </section>
        )}
      </main>
    </Suspense>
  );
}
