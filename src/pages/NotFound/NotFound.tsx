import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <h1>This page isn't here yet</h1>
      <p>The address may be mistyped, or this part of the prototype is still being built.</p>
      <p>
        <Link to="/">Go to the start page</Link>
      </p>
    </div>
  );
}
