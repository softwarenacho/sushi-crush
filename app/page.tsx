import Image from 'next/image';
import { Suspense } from 'react';
import styles from './page.module.scss';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        <Image src='/icons/152x152.webp' alt='Icon' width={152} height={152} />
        <h1>Nacho&lsquo;s Next.js PWA template</h1>
        <p>
          Use this template to bootstrap your <b>Next.js</b> web application
          with <b>PWA</b> integrated and set to obtaing <b>100%</b> average on
          <b>Lighthouse</b> reports
        </p>
        <section>
          <Image
            src='/screenshots/100 516x186.gif'
            alt='Score'
            width={386}
            height={144}
          />
          <Image
            src='/screenshots/UI 1252x1164.webp'
            alt='Score'
            width={386}
            height={360}
          />
        </section>
      </main>
    </Suspense>
  );
}
