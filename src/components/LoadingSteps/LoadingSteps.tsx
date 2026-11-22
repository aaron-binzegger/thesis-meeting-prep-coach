import { PREPARE_STEPS } from './usePrepareFlow.ts';
import styles from './LoadingSteps.module.css';

/** Progress text announced politely to screen readers while the sheet is "prepared". */
export function LoadingSteps({ stepIndex }: { stepIndex: number | undefined }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={stepIndex === undefined ? undefined : styles.box}
    >
      {stepIndex !== undefined && (
        <>
          <span className={styles.dots} aria-hidden="true" />
          <span>{PREPARE_STEPS[Math.min(stepIndex, PREPARE_STEPS.length - 1)]}</span>
        </>
      )}
    </div>
  );
}
