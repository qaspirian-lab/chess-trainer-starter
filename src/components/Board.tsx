import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Board() {
  const [game, setGame] = useState(new Chess());

  function safeGameMutate(modify: (g: Chess) => void) {
    const updated = new Chess(game.fen());
    modify(updated);
    setGame(updated);
  }

  function onPieceDrop(sourceSquare: string, targetSquare: string) {
    let move = null;
    safeGameMutate((g) => {
      move = g.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    });

    // Return false if the move is illegal (react-chessboard requirement)
    return move !== null;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <Chessboard
        id="BasicBoard"
        position={game.fen()}
        onPieceDrop={onPieceDrop}
        boardWidth={500}
      />
    </div>
  );
}
