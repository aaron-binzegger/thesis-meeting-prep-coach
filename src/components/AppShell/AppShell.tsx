import type { MouseEvent } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../Footer/Footer.tsx';
import { TopNav } from '../TopNav/TopNav.tsx';
import styles from './AppShell.module.css';

const MAIN_ID = 'main-content';

/** HashRouter owns the URL hash, so move focus manually instead of jumping to an anchor. */
function skipToMain(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  document.getElementById(MAIN_ID)?.focus();
}

/** Page frame: skip link, top navigation, main landmark and footer. */
export function AppShell() {
  return (
    <div className={styles.shell}>
      <a href={`#${MAIN_ID}`} className={styles.skipLink} data-print="hide" onClick={skipToMain}>
        Skip to content
      </a>
      <TopNav />
      <main id={MAIN_ID} tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
