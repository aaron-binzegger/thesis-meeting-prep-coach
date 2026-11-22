import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import styles from './Field.module.css';

interface FieldFrameProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

function describedBy(hintId: string, errorId: string, hint?: ReactNode, error?: ReactNode) {
  return [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
}

export type TextFieldProps = FieldFrameProps & InputHTMLAttributes<HTMLInputElement>;

/** Single-line input with label, optional hint and error. */
export function TextField({ label, hint, error, className, id, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <input
        id={inputId}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId, hint, error)}
        {...rest}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

export type TextAreaProps = FieldFrameProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Multi-line input, ruled like notebook paper for the notes fields. */
export function TextArea({ label, hint, error, className, id, rows = 8, ...rest }: TextAreaProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`${styles.input} ${styles.textarea}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, errorId, hint, error)}
        {...rest}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

export interface RadioOption<T extends string> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
}

export interface RadioGroupProps<T extends string> {
  legend: ReactNode;
  name: string;
  options: RadioOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  hint?: ReactNode;
}

/** A fieldset of radio options shown as selectable rows, e.g. "Do you already have a topic idea?". */
export function RadioGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  hint,
}: RadioGroupProps<T>) {
  const groupId = useId();
  const hintId = `${groupId}-hint`;

  return (
    <fieldset className={styles.fieldset} aria-describedby={hint ? hintId : undefined}>
      <legend className={styles.label}>{legend}</legend>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <div className={styles.options}>
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          return (
            <label key={option.value} htmlFor={optionId} className={styles.option}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className={styles.radio}
              />
              <span className={styles.optionText}>
                <span className={styles.optionLabel}>{option.label}</span>
                {option.description && (
                  <span className={styles.optionDescription}>{option.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
