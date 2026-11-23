import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPersona } from '../../data/index.ts';
import { useSession } from '../../state/useSession.ts';

/**
 * Supports `/#/journey?persona=mia`: on first load a valid persona turns demo mode on
 * and pre-fills the forms (spec 6.8). Runs once.
 */
export function usePersonaParam() {
  const [params] = useSearchParams();
  const { setDemoMode, selectPersona } = useSession();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const persona = getPersona(params.get('persona')?.toLowerCase());
    if (persona) {
      setDemoMode(true);
      selectPersona(persona.id);
    }
  }, [params, setDemoMode, selectPersona]);
}
