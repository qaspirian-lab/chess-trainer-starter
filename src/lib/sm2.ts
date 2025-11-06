/**
 * Minimal SM-2 style spaced repetition for puzzles.
 * Data persisted in localStorage under 'ct-sm2'.
 */
export type Card = {
  id: string;
  fen: string;
  solution: string[]; // UCI moves, user first
  rating?: number;
  tags?: string[];
  // scheduling
  interval?: number; // days
  ease?: number; // easiness factor
  due?: number; // epoch ms
};

type Store = {
  [id: string]: { interval: number; ease: number; due: number };
};

const KEY = "ct-sm2";

function now(): number {
  return Date.now();
}

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function save(s: Store) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function rateCard(card: Card, quality: 0 | 1 | 2 | 3 | 4 | 5): Card {
  const store = load();
  const prev = store[card.id] ?? { interval: 0, ease: 2.5, due: now() };

  let ease = prev.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease < 1.3) ease = 1.3;

  let interval = prev.interval;
  if (quality < 3) {
    interval = 1;
  } else if (interval === 0) {
    interval = 1;
  } else if (interval === 1) {
    interval = 6;
  } else {
    interval = Math.round(interval * ease);
  }

  const due = now() + interval * 24 * 60 * 60 * 1000;

  const updated: Card = { ...card, ease, interval, due };
  store[card.id] = { ease, interval, due };
  save(store);
  return updated;
}

export function useSM2Store() {
  function getNextCard(cards: Card[]): Card | null {
    const store = load();
    const dueCards = cards
      .map((c) => {
        const s = store[c.id];
        return s ? { ...c, ...s } : { ...c, interval: 0, ease: 2.5, due: 0 };
      })
      .filter((c) => (c.due ?? 0) <= now())
      .sort((a, b) => (a.due ?? 0) - (b.due ?? 0));

    return dueCards[0] ?? null;
  }

  function recordResult(card: Card) {
    const store = load();
    store[card.id] = {
      ease: card.ease ?? 2.5,
      interval: card.interval ?? 0,
      due: card.due ?? now(),
    };
    save(store);
  }

  return { getNextCard, recordResult };
}
