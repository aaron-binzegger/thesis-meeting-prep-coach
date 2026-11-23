import { ClipboardCopy, NotebookPen, Printer } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ButtonLink } from '../../components/Button/Button.tsx';
import { Callout } from '../../components/Callout/Callout.tsx';
import { PrepSheetView } from '../../components/PrepSheet/PrepSheetView.tsx';
import { getMeetingType, getScenario, getSheet } from '../../data/index.ts';
import { sheetToText } from '../../lib/sheetText.ts';
import { useSession } from '../../state/useSession.ts';
import styles from './PrepSheetPage.module.css';

const EXAMPLE_BANNER =
  'Prototype: this is an example output for a similar student. The real coach would use your notes.';

export default function PrepSheetPage() {
  const { n } = useParams();
  const { session } = useSession();
  const [announcement, setAnnouncement] = useState('');

  const meeting = n === '1' ? 1 : n === '2' ? 2 : undefined;
  if (!meeting) {
    return (
      <div className={styles.message}>
        <h1>No such meeting</h1>
        <p>There are only meetings 1 and 2.</p>
        <ButtonLink to="/journey">Go to your journey</ButtonLink>
      </div>
    );
  }

  const prepared = session[meeting === 1 ? 'meeting1' : 'meeting2'].prepared;
  const scenario = getScenario(prepared?.scenarioId);
  const sheet = getSheet(scenario?.sheetId);

  if (!prepared || !scenario || !sheet) {
    return (
      <div className={styles.message}>
        <h1>You haven't prepared meeting {meeting} yet</h1>
        <p>Add a few notes and the coach builds your prep sheet.</p>
        <ButtonLink to={`/meeting/${meeting}/setup`}>Prepare meeting {meeting}</ButtonLink>
      </div>
    );
  }

  const meetingTitle = getMeetingType(scenario.meeting)?.title ?? `Meeting ${meeting}`;

  async function copy() {
    if (!sheet || !scenario) return;
    try {
      await navigator.clipboard.writeText(sheetToText(sheet, scenario, meetingTitle));
      setAnnouncement('Copied to clipboard');
    } catch {
      setAnnouncement('Could not copy. Select the text on the sheet and copy it by hand.');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.banners} data-print="hide">
        {prepared.isExample && <Callout tone="prototype">{EXAMPLE_BANNER}</Callout>}
        {sheet.privacyWarning && <Callout tone="privacy">{sheet.privacyWarning}</Callout>}
      </div>

      <PrepSheetView sheet={sheet} scenario={scenario} meetingTitle={meetingTitle} />

      <div className={styles.actions} data-print="hide">
        <Button variant="secondary" icon={<ClipboardCopy />} onClick={copy}>
          Copy as text
        </Button>
        <Button variant="secondary" icon={<Printer />} onClick={() => window.print()}>
          Print or save as PDF
        </Button>
        {meeting === 1 ? (
          <ButtonLink to="/meeting/1/after" icon={<NotebookPen />}>
            Add notes after the meeting
          </ButtonLink>
        ) : (
          <ButtonLink to="/journey" variant="secondary">
            Back to your journey
          </ButtonLink>
        )}
        <p className={styles.status} aria-live="polite">
          {announcement}
        </p>
      </div>
    </div>
  );
}
