import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Sheet.module.css';

export interface SheetProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

/**
 * The paper the prep sheet is printed on: a white page with a red margin line.
 * Rows place notes in the margin on wide screens and below the content on phones.
 */
export function Sheet({ className, children, ...rest }: SheetProps) {
  return (
    <article className={[styles.sheet, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </article>
  );
}

export interface SheetSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Visible heading of the block, e.g. "Questions for your supervisor". */
  heading?: ReactNode;
  /** Heading level inside the page outline. */
  level?: 2 | 3;
  children: ReactNode;
}

/** One block of the sheet, separated from the next by a ruled line. */
export function SheetSection({
  heading,
  level = 2,
  className,
  children,
  ...rest
}: SheetSectionProps) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return (
    <section className={[styles.section, className].filter(Boolean).join(' ')} {...rest}>
      {heading && (
        <div className={styles.row}>
          <Heading className={styles.title}>{heading}</Heading>
        </div>
      )}
      {children}
    </section>
  );
}

export interface SheetRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Shown in the margin on wide screens. Comes after the content in reading order. */
  note?: ReactNode;
  children: ReactNode;
}

export function SheetRow({ note, className, children, ...rest }: SheetRowProps) {
  return (
    <div className={[styles.row, className].filter(Boolean).join(' ')} {...rest}>
      <div className={styles.body}>{children}</div>
      {note && <div className={styles.note}>{note}</div>}
    </div>
  );
}

/**
 * The coach's reference to the student's own notes, set like a pencilled margin note.
 * The text is shown exactly as the coach wrote it, including its own quotation marks.
 */
export function MarginQuote({ children }: { children: ReactNode }) {
  return (
    <p className={styles.quote}>
      <span className={styles.quoteLabel}>From your notes</span>
      <span>{children}</span>
    </p>
  );
}
