/* global setTimeout */
import { useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useSM2Store, rateCard, type Card } from "./lib/sm2";
import puzzles from "../puzzles/sample.json";

type Move = string;

export default function App() {
  const [game] = useState(new Chess());
  const [history, setHistory] = useState<Move[]>([]);
  const [message, setMessage] = useState<string>("");
  const { getNextCard, recordResult } = useSM2Store();

  const cards: Card[] = useMemo(() => {
    return (puzzles as Card[]).map((p) => ({ ...p }));
  }, []);

  const [current, setCurrent] = useState<Card | null>(null);

  useEffect(() => {
    const next = getNextCard(cards);
    if (next) {
      setCurrent(next);
      game.reset();
      game.load(next.fen);
      setHistory([]);
      setMessage("Your move");
    } else {
      setMessage("No due puzzles — come back later.");
    }
  }, [getNextCard, cards, game]);

  function onDrop(sourceSquare: string, targetSquare: string) {
    if (!current) return false;
    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    if (!move) return false;

    const uci = `${sourceSquare}${targetSquare}`;
    const step = current.solution[history.length];

    if (uci !== step) {
      setMessage("Incorrect. Try again.");
      game.undo();
      return false;
    }

    const newHist = [...history, uci];
    setHistory(newHist);

    // If there is an opponent reply in solution, play it automatically
    const opp = current.solution[newHist.length];
    if (opp) {
      try {
        game.move({ from: opp.slice(0, 2), to: opp.slice(2, 4), promotion: "q" });
        setHistory([...newHist, opp]);
      } catch {
        // ignore malformed puzzle data
      }
    }

    if (newHist.length >= current.solution.length) {
      setMessage("Solved!");
    } else {
      setMessage("Good — continue.");
    }
    return true;
  }

  function rate(grade: 0 | 1 | 2 | 3 | 4 | 5) {
    if (!current) return;
    const updated = rateCard(current, grade);
    recordResult(updated);
    setCurrent(null); // trigger next via effect
    setTimeout(() => {
      const next = getNextCard(cards);
      if (next) {
        game.reset();
        game.load(next.fen);
        setHistory([]);
        setCurrent(next);
        setMessage("Your move");
      } else {
        setMessage("No due puzzles — come back later.");
      }
    }, 50);
  }

  return (
    <div style={{ maxWidth: 940, margin: "24px auto", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ margin: "0 0 8px" }}>Chess Trainer</h1>
      <p style={{ margin: "0 0 16px", color: "#444" }}>{message}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        <div>
          <Chessboard position={game.fen()} onPieceDrop={onDrop} areArrowsAllowed={true} />
        </div>
        <aside style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <section style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Puzzle</h3>
            <p><strong>ID:</strong> {current?.id ?? "-"}</p>
            <p><strong>Rating:</strong> {current?.rating ?? "-"}</p>
            <p><strong>Tags:</strong> {current?.tags?.join(", ") ?? "-"}</p>
          </section>
          <section style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>Spaced repetition</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              <button onClick={() => rate(0)}>Again</button>
              <button onClick={() => rate(3)}>Good</button>
              <button onClick={() => rate(5)}>Easy</button>
            </div>
            <p style={{ fontSize: 12, color: "#666" }}>
              Grading uses SM-2. Data is stored locally.
            </p>
          </section>
          <section style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>History</h3>
            <code style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>{history.join(" ")}</code>
          </section>
        </aside>
      </div>
      <footer style={{ marginTop: 16, fontSize: 12, color: "#666" }}>
        Edit <code>puzzles/sample.json</code> to add puzzles.
      </footer>
    </div>
  );
}
