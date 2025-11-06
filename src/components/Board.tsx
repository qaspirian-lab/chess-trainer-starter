import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export function Board() {
  const [game, setGame] = useState(new Chess());

  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // auto-queen for simplicity
    });

    if (move === null) return false; // illegal move

    setGame(new Chess(game.fen())); // update board state
    return true;
  }

  return (
    <Chessboard
      position={game.fen()}
      onPieceDrop={onDrop}
      boardWidth={500}
    />
  );
}
