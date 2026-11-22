import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

type CardElement = 'div' | 'section' | 'article' | 'aside';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  /** `panel` sits on the desk; `tinted` is for secondary context, e.g. "Carried over from meeting 1". */
  tone?: 'panel' | 'tinted';
  children: ReactNode;
}

/** A plain panel for grouping content. The prep sheet itself uses `Sheet`. */
export function Card({
  as: Element = 'div',
  tone = 'panel',
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Element className={[styles.card, styles[tone], className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Element>
  );
}
