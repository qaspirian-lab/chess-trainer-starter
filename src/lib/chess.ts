import { Chess, Square } from "chess.js";

export function moveUci(game: Chess, uci: string) {
  return game.move({ from: uci.slice(0, 2) as Square, to: uci.slice(2, 4) as Square, promotion: "q" });
}

export function loadFen(game: Chess, fen: string) {
  game.reset();
  game.load(fen);
}
