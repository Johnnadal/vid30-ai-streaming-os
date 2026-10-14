import { useState, useCallback, useRef } from 'react';
import type { DiscoveryResultItem, DiscoveryIntent, DiscoverResponse } from './api';
import { discoverContent } from './api';
import './styles.css';

// ── Suggestion chips ───────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Something dark and cinematic under 90 minutes',
  'A funny light comedy for the weekend',
  'Romantic drama under 2 hours',
  'A mysterious sci-fi thriller',
  'A family movie night, something fun for everyone',
  'Something like Blade Runner but shorter',
  'A dark mysterious thriller under 100 minutes with friends',
  'Soirée cinéma en famille',
];

// ── Intent badge ───────────────────────────────────────────────────────────

function IntentBadge({ label, value }: { label: string; value: string | null | boolean | number | string[] }) {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value) && value.length === 0) return null;
  if (value === false) return null;

  const display = Array.isArray(value)
    ? value.join(', ')
    : typeof value === 'boolean'
    ? value ? '✓' : '✗'
    : String(value);

  return (
    <span className="intent-badge">
      <span className="intent-badge-label">{label}</span>
      <span className="intent-badge-value">{display}</span>
    </span>
  );
}

function IntentPanel({ intent }: { intent: DiscoveryIntent }) {
  return (
    <div className="intent-panel">
      <p className="intent-panel-title">What the system understood</p>
      <div className="intent-badges">
        <IntentBadge label="mood" value={intent.mood} />
        <IntentBadge label="cinematic" value={intent.cinematic} />
        <IntentBadge label="max duration" value={intent.maxDurationMinutes !== null ? `${intent.maxDurationMinutes} min` : null} />
        <IntentBadge label="genres" value={intent.genres} />
        <IntentBadge label="keywords" value={intent.keywords} />
        <IntentBadge label="context" value={intent.watchingContext} />
        {intent.familyMode && <IntentBadge label="family mode" value={true} />}
      </div>
    </div>
  );
}

// ── Content rating badge ───────────────────────────────────────────────────

function RatingBadge({ rating }: { rating: string }) {
  const classMap: Record<string, string> = {
    G: 'rating-g',
    PG: 'rating-pg',
    'PG-13': 'rating-pg13',
    R: 'rating-r',
  };
  return (
    <span className={`rating-badge ${classMap[rating] ?? 'rating-pg13'}`}>
      {rating}
    </span>
  );
}

// ── Result card ────────────────────────────────────────────────────────────

function ResultCard({
  item,
  onClick,
}: {
  item: DiscoveryResultItem;
  onClick: (item: DiscoveryResultItem) => void;
}) {
  return (
    <button className="result-card" onClick={() => onClick(item)} type="button">
      <div className="result-card-header">
        <h3 className="result-title">{item.title}</h3>
        <RatingBadge rating={item.contentRating} />
      </div>
      <div className="result-meta">
        <span>{item.durationMinutes} min</span>
        {item.genres.length > 0 && <span>·</span>}
        {item.genres.map((g) => (
          <span key={g} className="genre-chip">{g}</span>
        ))}
        {item.cinematic && <span className="cinematic-chip">Cinematic</span>}
      </div>
      <p className="result-description">{item.description}</p>
    </button>
  );
}

// ── Detail panel ───────────────────────────────────────────────────────────

function DetailPanel({
  item,
  onClose,
}: {
  item: DiscoveryResultItem;
  onClose: () => void;
}) {
  return (
    <div className="detail-overlay" role="dialog" aria-modal="true" aria-label={item.title}>
      <div className="detail-panel">
        <button className="detail-close" onClick={onClose} type="button" aria-label="Close">
          ✕
        </button>
        <div className="detail-header">
          <h2 className="detail-title">{item.title}</h2>
          <RatingBadge rating={item.contentRating} />
        </div>
        <div className="detail-meta">
          <span>{item.durationMinutes} min</span>
          {item.genres.map((g) => (
            <span key={g} className="genre-chip">{g}</span>
          ))}
          {item.cinematic && <span className="cinematic-chip">Cinematic</span>}
          {item.familySafe && (
            <span className="family-chip" title="Family Safe content">
              👨‍👩‍👧 Family Safe
            </span>
          )}
        </div>
        <p className="detail-description">{item.description}</p>
        <div className="detail-moods">
          {item.mood.map((m) => (
            <span key={m} className="mood-chip">{m}</span>
          ))}
        </div>
        <p className="detail-disclaimer">
          Content rating is a demo classification and does not represent an official certification.
          {item.familySafe
            ? ' Family Safe status is based on contentRating metadata, not AI judgment.'
            : ''}
        </p>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────

export function App() {
  const [query, setQuery] = useState('');
  const [familyMode, setFamilyMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<DiscoverResponse | null>(null);
  const [selectedItem, setSelectedItem] = useState<DiscoveryResultItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runDiscover = useCallback(async (q: string, fm: boolean) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setSelectedItem(null);

    try {
      const data = await discoverContent(trimmed, fm);
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discovery failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      runDiscover(query, familyMode);
    },
    [query, familyMode, runDiscover],
  );

  const handleSuggestion = useCallback(
    (s: string) => {
      setQuery(s);
      runDiscover(s, familyMode);
    },
    [familyMode, runDiscover],
  );

  const handleFamilyModeToggle = useCallback(() => {
    setFamilyMode((prev) => !prev);
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-vid">VID</span>
            <span className="logo-30">30</span>
          </div>
          <p className="tagline">AI Streaming Operating System</p>
        </div>
      </header>

      <main className="main">
        {/* Search section */}
        <section className="search-section" aria-label="Content discovery">
          <h1 className="search-heading">What do you want to watch?</h1>
          <p className="search-subheading">
            Describe it in natural language — mood, duration, context, anything.
          </p>

          <form className="search-form" onSubmit={handleSubmit} role="search">
            <div className="input-row">
              <input
                ref={inputRef}
                className="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Something dark and cinematic under 90 minutes"
                aria-label="Describe what you want to watch"
                autoFocus
              />
              <button
                className="search-button"
                type="submit"
                disabled={isLoading || !query.trim()}
                aria-label="Search"
              >
                {isLoading ? '…' : 'Discover'}
              </button>
            </div>

            {/* Family Mode toggle */}
            <div className="family-mode-row">
              <label className="family-mode-label" htmlFor="family-mode-toggle">
                <span className="family-mode-icon">👨‍👩‍👧</span>
                Family Mode
                <span className="family-mode-hint">
                  Only shows content rated G, PG, or PG-13
                </span>
              </label>
              <button
                id="family-mode-toggle"
                className={`toggle-button ${familyMode ? 'toggle-on' : 'toggle-off'}`}
                type="button"
                role="switch"
                aria-checked={familyMode}
                onClick={handleFamilyModeToggle}
              >
                <span className="toggle-knob" />
                <span className="sr-only">{familyMode ? 'Family Mode on' : 'Family Mode off'}</span>
              </button>
            </div>
          </form>

          {/* Suggestion chips */}
          <div className="suggestions" role="list" aria-label="Query suggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="suggestion-chip"
                type="button"
                role="listitem"
                onClick={() => handleSuggestion(s)}
                disabled={isLoading}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Loading */}
        {isLoading && (
          <div className="status-container" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p className="status-text">Analyzing your request with AI…</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="error-container" role="alert">
            <p className="error-text">⚠ {error}</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && response && (
          <section className="results-section" aria-label="Discovery results">
            {/* Intent panel */}
            <IntentPanel intent={response.intent} />

            {response.results.length === 0 ? (
              <div className="empty-state" role="status">
                <p className="empty-title">No results found</p>
                <p className="empty-hint">
                  {response.intent.familyMode
                    ? 'No family-safe content matched your criteria. Try relaxing the filters.'
                    : 'Try a different description or broader criteria.'}
                </p>
              </div>
            ) : (
              <>
                <p className="results-count" aria-live="polite">
                  {response.results.length} film{response.results.length !== 1 ? 's' : ''} found
                  {response.intent.familyMode && (
                    <span className="family-active-badge">
                      👨‍👩‍👧 Family Mode active
                    </span>
                  )}
                </p>
                <ul className="results-list" aria-label="Matching films">
                  {response.results.map((item) => (
                    <li key={item.id}>
                      <ResultCard item={item} onClick={setSelectedItem} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
      </main>

      {/* Detail overlay */}
      {selectedItem && (
        <DetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
