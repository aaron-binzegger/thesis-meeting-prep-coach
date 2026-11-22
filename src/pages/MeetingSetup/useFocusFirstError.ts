import { useEffect, type RefObject } from 'react';

/** After a failed submit, moves focus to the first invalid field inside the form. */
export function useFocusFirstError(form: RefObject<HTMLFormElement>, attempt: number) {
  useEffect(() => {
    if (attempt === 0) return;
    form.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"] input')
      ?.focus();
  }, [form, attempt]);
}
