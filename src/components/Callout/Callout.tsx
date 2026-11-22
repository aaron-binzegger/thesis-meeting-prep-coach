import { Info, ShieldCheck } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Callout.module.css';

export type CalloutTone = 'boundaries' | 'privacy' | 'prototype';

const icons: Record<CalloutTone, ReactNode> = {
  boundaries: null,
  privacy: <ShieldCheck size={20} />,
  prototype: <Info size={20} />,
};

export interface CalloutProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  tone: CalloutTone;
  /** Short visible heading. Rendered as a paragraph label, not a document heading. */
  heading?: ReactNode;
  children: ReactNode;
}

/**
 * A short aside for fixed texts: the boundaries statement, privacy reminders
 * and the prototype banner ("this is an example output for a similar student").
 */
export function Callout({ tone, heading, className, children, ...rest }: CalloutProps) {
  const icon = icons[tone];
  return (
    <aside
      className={[styles.callout, styles[tone], className].filter(Boolean).join(' ')}
      {...rest}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className={styles.content}>
        {heading && <p className={styles.heading}>{heading}</p>}
        {children}
      </div>
    </aside>
  );
}
