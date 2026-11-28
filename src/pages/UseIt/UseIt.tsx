import { Copy, Download } from 'lucide-react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '../../components/Button/Button.tsx';
import { Callout } from '../../components/Callout/Callout.tsx';
import { evaluation } from '../../data/index.ts';
import { promptFromCopyPaste } from '../../lib/copyPastePrompt.ts';
import copyPasteFile from '../../../docs/skill/copy-paste-prompt.md?raw';
import skillUrl from '../../../docs/skill/thesis-meeting-prep-coach/SKILL.md?url';
import styles from './UseIt.module.css';

const TABS = [
  { id: 'prompt', label: 'Copy-paste prompt' },
  { id: 'skill', label: 'Skill file' },
] as const;

type TabId = (typeof TABS)[number]['id'];

/** The prompt inside the code block of docs/skill/copy-paste-prompt.md (ROLE to the end). */
const prompt = promptFromCopyPaste(copyPasteFile);

export default function UseIt() {
  const [active, setActive] = useState<TabId>('prompt');
  const [status, setStatus] = useState('');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ prompt: null, skill: null });

  function select(index: number) {
    const next = TABS[(index + TABS.length) % TABS.length]!.id;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case 'ArrowRight':
        select(index + 1);
        break;
      case 'ArrowLeft':
        select(index - 1);
        break;
      case 'Home':
        select(0);
        break;
      case 'End':
        select(TABS.length - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus('Copied');
    } catch {
      setStatus('Could not copy. Select the text and copy it by hand.');
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Use it in your own AI</h1>
        <p className={styles.lead}>
          The coach is a prompt, so it works in any AI chat tool. Paste it in, then add your notes.
        </p>
      </header>

      <section aria-labelledby="tested-heading" className={styles.section}>
        <h2 id="tested-heading">Where we tested it</h2>
        <p>{evaluation.setup[0]}</p>
        <p>
          Final prompt (R3.1), runs that passed every hard criterion:{' '}
          <strong>{evaluation.versions.find((v) => v.id === 'R3.1')?.hardPasses}</strong>
        </p>
      </section>

      <Callout tone="privacy" className={styles.callout}>
        <p>Don&rsquo;t enter real names, grades or confidential company data.</p>
      </Callout>

      <section aria-labelledby="get-heading" className={styles.section}>
        <h2 id="get-heading">Get the coach</h2>
        <div className={styles.tabs}>
          <div role="tablist" aria-label="Ways to get the coach" className={styles.tablist}>
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={active === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={active === tab.id ? 0 : -1}
                className={styles.tab}
                onClick={() => setActive(tab.id)}
                onKeyDown={(e) => onKeyDown(e, index)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id="panel-prompt"
            aria-labelledby="tab-prompt"
            hidden={active !== 'prompt'}
            className={styles.panel}
          >
            <p>
              The guide below is our <code>copy-paste-prompt.md</code>. &ldquo;Copy prompt&rdquo;
              copies only the prompt inside the code block, from ROLE to the end.
            </p>
            <div className={styles.actions}>
              <Button variant="secondary" icon={<Copy size={18} />} onClick={copy}>
                Copy prompt
              </Button>
              <span role="status" aria-live="polite" className={styles.status}>
                {status}
              </span>
            </div>
            {/* Scrollable region: needs focus so keyboard users can scroll it. */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <pre className={styles.code} tabIndex={0} aria-label="copy-paste-prompt.md">
              <code>{copyPasteFile}</code>
            </pre>
          </div>

          <div
            role="tabpanel"
            id="panel-skill"
            aria-labelledby="tab-skill"
            hidden={active !== 'skill'}
            className={styles.panel}
          >
            <p>
              The skill file holds the same instructions in a format some tools can load as a
              reusable setup.
            </p>
            <p>
              <a href={skillUrl} download="SKILL.md" className={styles.download}>
                <Download size={18} aria-hidden="true" />
                <span>Download SKILL.md</span>
              </a>
            </p>
            <h3>Install hints</h3>
            <dl className={styles.hints}>
              <div>
                <dt>Claude</dt>
                <dd>Add the file as a skill, or paste its text into project instructions.</dd>
              </div>
              <div>
                <dt>ChatGPT</dt>
                <dd>Create a custom GPT and paste the text into its instructions.</dd>
              </div>
              <div>
                <dt>Gemini</dt>
                <dd>Create a Gem and paste the text into its instructions.</dd>
              </div>
            </dl>
            <p className={styles.muted}>
              Menus change often, so look for the place where your tool asks for instructions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
