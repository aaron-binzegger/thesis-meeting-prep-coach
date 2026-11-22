import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet';

interface CommonProps {
  variant?: ButtonVariant;
  /** Optional icon shown before the label. Icons are decorative; the label carries the meaning. */
  icon?: ReactNode;
  children: ReactNode;
}

function classNames(variant: ButtonVariant, extra?: string) {
  return [styles.button, styles[variant], extra].filter(Boolean).join(' ');
}

function Content({ icon, children }: Pick<CommonProps, 'icon' | 'children'>) {
  return (
    <>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </>
  );
}

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

/** An action on the current page. Use `ButtonLink` for navigation. */
export function Button({
  variant = 'primary',
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classNames(variant, className)} {...rest}>
      <Content icon={icon}>{children}</Content>
    </button>
  );
}

export type ButtonLinkProps = CommonProps & LinkProps;

/** Navigation that looks like a button, e.g. "Start with your first meeting". */
export function ButtonLink({
  variant = 'primary',
  icon,
  children,
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={classNames(variant, className)} {...rest}>
      <Content icon={icon}>{children}</Content>
    </Link>
  );
}
