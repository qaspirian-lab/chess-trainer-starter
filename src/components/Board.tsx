import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

type Props = {
  game: Chess;
  onDrop: (sourceSquare: string, targetSquare: string) => boolean;
};

export default function Board({ game, onDrop }: Props) {
  return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
}
