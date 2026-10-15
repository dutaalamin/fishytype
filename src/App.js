import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

/* ------------------------------------------------------------------ *
 * Data
 * ------------------------------------------------------------------ */

const WORDS = [
  'go', 'come', 'see', 'make', 'take', 'eat', 'drink', 'sleep', 'wake', 'walk',
  'run', 'sit', 'stand', 'talk', 'hear', 'think', 'feel', 'want', 'learn', 'work',
  'write', 'read', 'play', 'laugh', 'smile', 'jump', 'sing', 'house', 'car', 'book',
  'table', 'chair', 'door', 'window', 'place', 'time', 'day', 'month', 'year', 'morning',
  'night', 'food', 'clothes', 'money', 'shoes', 'bag', 'hat', 'glass', 'lamp', 'phone',
  'radio', 'paper', 'news', 'magazine', 'good', 'bad', 'big', 'small', 'high', 'low',
  'hot', 'cold', 'fast', 'slow', 'hard', 'soft', 'new', 'old', 'easy', 'happy',
  'sad', 'angry', 'afraid', 'beautiful', 'pretty', 'handsome', 'rough', 'smooth', 'bright', 'dark',
  'strong', 'weak', 'in', 'on', 'at', 'to', 'for', 'with', 'from', 'by',
  'into', 'onto', 'about', 'like', 'through', 'after', 'before', 'between', 'under', 'over',
  'behind', 'beside', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that',
  'who', 'what', 'which', 'when', 'why', 'how', 'where', 'whose', 'these', 'those',
  'now', 'later', 'soon', 'today', 'tomorrow', 'yesterday', 'always', 'never', 'often', 'sometimes',
  'rarely', 'weekly', 'daily', 'early', 'late', 'again', 'once', 'twice', 'one', 'two',
  'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'many', 'few',
  'all', 'some', 'most', 'half', 'first', 'second', 'third', 'last', 'please', 'sorry',
  'thank', 'hello', 'welcome', 'excuse', 'pardon', 'okay', 'yes', 'no', 'maybe', 'sure',
  'right', 'wrong', 'true', 'false', 'office', 'school', 'market', 'store', 'bank', 'home',
  'hospital', 'station', 'airport', 'hotel', 'mall', 'park', 'beach', 'mountain', 'city', 'town',
  'street', 'room', 'kitchen', 'space', 'computer', 'tablet', 'screen', 'mouse', 'keyboard', 'internet',
  'email', 'website', 'app', 'data', 'file', 'folder', 'program', 'system', 'network', 'cloud',
  'code', 'game', 'video', 'meeting', 'project', 'client', 'report', 'budget', 'sales', 'team',
  'goal', 'plan', 'strategy', 'success', 'growth', 'value', 'cost', 'price', 'deal', 'task',
];

const THEMES = {
  classic: { name: 'classic', background: '#323437', text: '#d1d0c5', primary: '#e2b714', error: '#ca4754', caret: '#e2b714', sub: '#646669', subAlt: '#2c2e31' },
  ocean: { name: 'ocean', background: '#1b2b34', text: '#d8dee9', primary: '#6699cc', error: '#ec5f67', caret: '#6699cc', sub: '#4f5b66', subAlt: '#161e23' },
  forest: { name: 'forest', background: '#2d3436', text: '#f0f7ee', primary: '#6ab04c', error: '#eb4d4b', caret: '#6ab04c', sub: '#95a5a6', subAlt: '#232829' },
  sunset: { name: 'sunset', background: '#1a1a2e', text: '#ffd460', primary: '#ff6b6b', error: '#ee5253', caret: '#ff6b6b', sub: '#706fd3', subAlt: '#16162a' },
  lavender: { name: 'lavender', background: '#2f3640', text: '#f5f6fa', primary: '#9b59b6', error: '#e84393', caret: '#9b59b6', sub: '#a4b0be', subAlt: '#262b33' },
  mint: { name: 'mint', background: '#222f3e', text: '#f5f6fa', primary: '#00b894', error: '#ff7675', caret: '#00b894', sub: '#8395a7', subAlt: '#1b2631' },
  coffee: { name: 'coffee', background: '#2f3640', text: '#dcdde1', primary: '#cd6133', error: '#e84118', caret: '#cd6133', sub: '#718093', subAlt: '#262b33' },
  retro: { name: 'retro', background: '#2c3e50', text: '#ecf0f1', primary: '#f1c40f', error: '#e74c3c', caret: '#f1c40f', sub: '#95a5a6', subAlt: '#233140' },
  pastel: { name: 'pastel', background: '#f8f4e1', text: '#6d6875', primary: '#f4a261', error: '#e76f51', caret: '#f4a261', sub: '#b5838d', subAlt: '#ffe8d6' },
  candy: { name: 'candy', background: '#ffecf1', text: '#4a4459', primary: '#ff6b9f', error: '#ff4757', caret: '#ff6b9f', sub: '#8b7997', subAlt: '#f7dfe7' },
  neon: { name: 'neon', background: '#000000', text: '#00ff00', primary: '#ff00ff', error: '#ff0000', caret: '#00ffff', sub: '#008800', subAlt: '#0a0a0a' },
  matrix: { name: 'matrix', background: '#000000', text: '#00ff00', primary: '#008f11', error: '#ff0000', caret: '#00ff00', sub: '#003b00', subAlt: '#001a00' },
  dracula: { name: 'dracula', background: '#282a36', text: '#f8f8f2', primary: '#bd93f9', error: '#ff5555', caret: '#bd93f9', sub: '#6272a4', subAlt: '#21222c' },
  gruvbox: { name: 'gruvbox', background: '#282828', text: '#ebdbb2', primary: '#b8bb26', error: '#fb4934', caret: '#b8bb26', sub: '#928374', subAlt: '#1d2021' },
  galaxy: { name: 'galaxy', background: '#0c0c1d', text: '#e2e2ff', primary: '#7f5af0', error: '#ff0055', caret: '#7f5af0', sub: '#4d4d8f', subAlt: '#0a0a18' },
  coral: { name: 'coral', background: '#1d2021', text: '#f8f8f2', primary: '#ff7f50', error: '#ff5555', caret: '#ff7f50', sub: '#6272a4', subAlt: '#161819' },
};

const DURATIONS = [15, 30, 60, 120];
const STORAGE_KEY = 'fishytype.history.v1';

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildWords() {
  const count = window.innerWidth <= 768 ? 20 : 40;
  return shuffle(WORDS).slice(0, count);
}

/* Hitung statistik dari apa yang sudah diketik (kata selesai + kata aktif). */
function countStats(words, typedByWord, typed, wordIndex) {
  let correct = 0;
  let incorrect = 0;
  let keystrokes = 0;

  const add = (target, attempt) => {
    const t = target || '';
    const a = attempt || '';
    const n = Math.max(t.length, a.length);
    for (let i = 0; i < n; i++) {
      if (i >= t.length) {
        incorrect++; // karakter ekstra
        continue;
      }
      if (i >= a.length) continue; // belum diketik
      if (a[i] === t[i]) correct++;
      else incorrect++;
    }
    keystrokes += a.length;
  };

  for (let i = 0; i < wordIndex; i++) add(words[i], typedByWord[i]);
  add(words[wordIndex], typed);

  return { correct, incorrect, keystrokes };
}

/* ------------------------------------------------------------------ *
 * App
 * ------------------------------------------------------------------ */

export default function App() {
  const [words, setWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [typedByWord, setTypedByWord] = useState([]);

  const [duration, setDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState('idle'); // idle | running | finished

  const [theme, setTheme] = useState('classic');
  const [showThemes, setShowThemes] = useState(false);
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState(null);

  const inputRef = useRef(null);
  const wordsInnerRef = useRef(null);
  const startedAtRef = useRef(0);
  const finishedRef = useRef(false);

  /* ---- persistence ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next) => {
    setHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  /* ---- words ---- */
  const newRound = useCallback(() => {
    setWords(buildWords());
    setWordIndex(0);
    setTyped('');
    setTypedByWord([]);
    setTimeLeft(duration);
    setStatus('idle');
    setShowResults(false);
    finishedRef.current = false;
    inputRef.current?.focus();
  }, [duration]);

  useEffect(() => {
    newRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'idle') setTimeLeft(duration);
  }, [duration, status]);

  /* ---- theme vars ---- */
  useEffect(() => {
    const t = THEMES[theme];
    const root = document.documentElement;
    root.style.setProperty('--bg-color', t.background);
    root.style.setProperty('--text-color', t.text);
    root.style.setProperty('--main-color', t.primary);
    root.style.setProperty('--error-color', t.error);
    root.style.setProperty('--caret-color', t.caret);
    root.style.setProperty('--sub-color', t.sub);
    root.style.setProperty('--sub-alt-color', t.subAlt);
  }, [theme]);

  /* ---- timer ---- */
  useEffect(() => {
    if (status !== 'running') return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  /* ---- finish ---- */
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setStatus('finished');

    const { correct, incorrect, keystrokes } = countStats(words, typedByWord, typed, wordIndex);
    const minutes = Math.max((duration - timeLeft) / 60, 1 / 60);
    const totalTyped = correct + incorrect;
    const raw = Math.round(totalTyped / 5 / minutes);
    const wpm = Math.round(correct / 5 / minutes);
    const accuracy = keystrokes > 0 ? Math.round((correct / keystrokes) * 100) : 100;

    const entry = {
      date: Date.now(),
      wpm,
      raw,
      accuracy,
      duration,
      chars: totalTyped,
    };
    setResult(entry);
    persist([...history, entry]);
    setShowResults(true);
  }, [duration, timeLeft, words, typedByWord, typed, wordIndex, history]);

  useEffect(() => {
    if (status === 'running' && timeLeft === 0) finish();
  }, [status, timeLeft, finish]);

  /* ---- typing ---- */
  const startIfNeeded = () => {
    if (status === 'idle') {
      startedAtRef.current = Date.now();
      setStatus('running');
    }
  };

  const handleKeyDown = (e) => {
    if (status === 'finished') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Tab') return;

    const word = words[wordIndex] ?? '';

    if (e.key === 'Backspace') {
      e.preventDefault();
      // Masih di kata aktif → hapus karakter
      if (typed.length > 0) {
        setTyped((prev) => prev.slice(0, -1));
        return;
      }
      // Sudah di awal kata → kembali ke kata sebelumnya (yang sudah selesai)
      if (wordIndex > 0) {
        const prevIdx = wordIndex - 1;
        setWordIndex(prevIdx);
        setTyped(typedByWord[prevIdx] ?? '');
        setTypedByWord((prev) => prev.slice(0, prevIdx));
      }
      return;
    }

    if (e.key === ' ') {
      e.preventDefault();
      if (typed.length === 0) return;
      // Simpan kata ini (tetap tampil di tempatnya) lalu maju
      setTypedByWord((prev) => {
        const next = [...prev];
        next[wordIndex] = typed;
        return next;
      });
      setWordIndex((i) => i + 1);
      setTyped('');
      if (wordIndex >= words.length - 1) {
        setWords((w) => [...w, ...buildWords()]);
      }
      return;
    }

    if (e.key.length !== 1) return;
    e.preventDefault();
    startIfNeeded();
    if (typed.length >= word.length + 8) return; // batasi karakter ekstra
    setTyped((prev) => prev + e.key);
  };

  /* ---- derived ---- */
  const minutes = Math.max((duration - timeLeft) / 60, 1 / 60);
  const liveStats = countStats(words, typedByWord, typed, wordIndex);
  const liveWpm =
    status === 'idle' ? 0 : Math.round(liveStats.correct / 5 / minutes);
  const liveAccuracy =
    liveStats.keystrokes > 0
      ? Math.round((liveStats.correct / liveStats.keystrokes) * 100)
      : 100;
  const best = history.reduce((m, h) => Math.max(m, h.wpm), 0);

  const visible = words.slice(0, wordIndex + 40);

  const activeTheme = THEMES[theme];

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={newRound}>
          fishy<span>type</span>
        </button>

        <div className="controls">
          <div className="theme-wrap">
            <button className="pill" onClick={() => setShowThemes((s) => !s)}>
              <span className="swatch" style={{ background: activeTheme.primary }} />
              {activeTheme.name}
            </button>

            {showThemes && (
              <div className="theme-menu">
                <input
                  className="theme-search"
                  placeholder="search themes"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <div className="theme-list">
                  {Object.entries(THEMES)
                    .filter(([key]) => key.includes(search.toLowerCase()))
                    .map(([key, t]) => (
                      <button
                        key={key}
                        className={`theme-item ${key === theme ? 'active' : ''}`}
                        onClick={() => {
                          setTheme(key);
                          setShowThemes(false);
                          setSearch('');
                          inputRef.current?.focus();
                        }}
                      >
                        <span className="swatch" style={{ background: t.primary }} />
                        {t.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="durations">
            {DURATIONS.map((d) => (
              <button
                key={d}
                className={`pill ${d === duration ? 'active' : ''}`}
                onClick={() => {
                  setDuration(d);
                  setStatus('idle');
                  setTimeLeft(d);
                  newRound();
                }}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="stage" onClick={() => inputRef.current?.focus()}>
        <div className="hud">
          <span className="hud-time">{timeLeft}</span>
          <span className="hud-unit">seconds left</span>
        </div>

        <div className="words" aria-live="polite">
          <div className="words-inner" ref={wordsInnerRef}>
            {visible.map((word, wi) => {
            const isCurrent = wi === wordIndex;
            const isDone = wi < wordIndex;
            const attempt = isCurrent ? typed : isDone ? typedByWord[wi] ?? '' : '';
            const chars = word.split('');

            return (
              <span
                key={`w-${wi}`}
                className={`word ${isCurrent ? 'current' : ''} ${
                  isDone ? 'done' : ''
                }`}
              >
                {chars.map((char, ci) => {
                  let cls = 'char';
                  if (isDone || isCurrent) {
                    if (ci < attempt.length) {
                      cls += attempt[ci] === char ? ' ok' : ' bad';
                    } else if (isCurrent && ci === attempt.length) {
                      cls += ' caret';
                    } else if (isCurrent) {
                      cls += ' pending';
                    } else {
                      cls += ' missed';
                    }
                  }
                  return (
                    <span key={ci} className={cls}>
                      {char}
                    </span>
                  );
                })}
                {attempt.length > chars.length && (
                  <span className="char extra">{attempt.slice(chars.length)}</span>
                )}
                {isDone && (
                  <span className={`space-mark ${attempt.length === 0 ? 'skipped' : ''}`} />
                )}
              </span>
            );
          })}
          </div>
        </div>

        <input
          ref={inputRef}
          className="ghost-input"
          value={typed}
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="typing input"
        />
      </main>

      <footer className="statusbar">
        <div className="stat">
          <span className="k">wpm</span>
          <span className="v">{liveWpm}</span>
        </div>
        <div className="stat">
          <span className="k">acc</span>
          <span className="v">{liveAccuracy}%</span>
        </div>
        <div className="stat">
          <span className="k">best</span>
          <span className="v">{best}</span>
        </div>
        <button className="restart" onClick={newRound} title="Restart (Tab + Enter)">
          restart
        </button>
      </footer>

      {showResults && result && (
        <div className="overlay" onClick={() => setShowResults(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="eyebrow">test complete</span>
              <button className="close" onClick={() => setShowResults(false)}>
                &times;
              </button>
            </div>

            <div className="modal-main">
              <div className="big">
                <span className="v">{result.wpm}</span>
                <span className="k">wpm</span>
              </div>
              <div className="grid">
                <div className="cell">
                  <span className="v">{result.accuracy}%</span>
                  <span className="k">accuracy</span>
                </div>
                <div className="cell">
                  <span className="v">{result.raw}</span>
                  <span className="k">raw</span>
                </div>
                <div className="cell">
                  <span className="v">{result.chars}</span>
                  <span className="k">characters</span>
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <button className="primary" onClick={newRound}>
                next test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
