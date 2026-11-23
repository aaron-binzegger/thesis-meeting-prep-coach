import { Copy, Download } from 'lucide-react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '../../components/Button/Button.tsx';
import { Callout } from '../../components/Callout/Callout.tsx';
import prompt from '../../data/coach-prompt.md?raw';
import { comparison } from '../../data/index.ts';
import styles from './UseIt.module.css';

const TABS = [
  { id: 'prompt', label: 'Copy-paste prompt' },
  { id: 'skill', label: 'Skill file' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const SKILL_URL = `${import.meta.env.BASE_URL}skill/SKILL.md`;

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
        <ul className={styles.models}>
          {comparison.models.map((m) => (
            <li key={m.name}>
              <strong>{m.name}</strong>
              <span>{m.tested}</span>
              <span className={styles.muted}>{m.result}</span>
            </li>
          ))}
        </ul>
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
            <p>Copy the prompt, paste it into a new chat, then add your notes.</p>
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
            <pre className={styles.code} tabIndex={0} aria-label="Coach prompt text">
              <code>{prompt}</code>
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
              <a href={SKILL_URL} download="SKILL.md" className={styles.download}>
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
