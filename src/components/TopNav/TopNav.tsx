import { Menu, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Wordmark } from '../Wordmark/Wordmark.tsx';
import { DemoSwitch } from './DemoSwitch.tsx';
import { navItems } from './navItems.ts';
import styles from './TopNav.module.css';

export function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  // Close with Escape and return focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className={styles.header} data-print="hide">
      <div className={styles.bar}>
        <Link to="/" className={styles.home} aria-label="Thesis Meeting Prep Coach, home">
          <Wordmark />
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          Menu
        </button>

        <nav id={menuId} className={styles.nav} data-open={menuOpen || undefined} aria-label="Main">
          <ul className={styles.links}>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={styles.link}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <DemoSwitch />
        </nav>
      </div>
    </header>
  );
}
