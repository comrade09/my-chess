// Updated React Chess App with Chess.com-like styling and Game Review Feature

import React, { useState } from "react";
import Chessboard from "chessboardjsx";
import Chess from "chess.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const game = new Chess();

export default function ChessApp() {
  const [fen, setFen] = useState("start");
  const [history, setHistory] = useState([]);
  const [playerTime, setPlayerTime] = useState({ white: 300, black: 300 });
  const [timerActive, setTimerActive] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(-1);

  React.useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      game.turn() === "w"
        ? setPlayerTime((prev) => ({ ...prev, white: prev.white - 1 }))
        : setPlayerTime((prev) => ({ ...prev, black: prev.black - 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, playerTime.white, playerTime.black]);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    if (move) {
      setFen(game.fen());
      setHistory(game.history({ verbose: true }));
      setTimerActive(true);
      setReviewIndex(-1);
    }
  };

  const resetGame = () => {
    game.reset();
    setFen("start");
    setHistory([]);
    setPlayerTime({ white: 300, black: 300 });
    setTimerActive(false);
    setReviewIndex(-1);
  };

  const reviewMove = (index) => {
    const tempGame = new Chess();
    for (let i = 0; i <= index; i++) {
      tempGame.move(history[i]);
    }
    setFen(tempGame.fen());
    setReviewIndex(index);
    setTimerActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#2f2f2f] text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Chess Game</h1>

      <div className="flex justify-between items-center w-full max-w-xl text-lg font-mono mb-2">
        <span className="text-white">♔ White: {playerTime.white}s</span>
        <span className="text-white">♚ Black: {playerTime.black}s</span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="rounded-lg shadow-md overflow-hidden">
          <Chessboard
            width={360}
            position={fen}
            onDrop={onDrop}
            boardStyle={{
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              border: "4px solid #222"
            }}
            lightSquareStyle={{ backgroundColor: "#eeeed2" }}
            darkSquareStyle={{ backgroundColor: "#769656" }}
          />
        </div>

        <Card className="bg-[#1f1f1f] text-white w-64 h-[360px]">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Move History</h2>
            <ScrollArea className="h-[290px] pr-2">
              {history.map((move, i) => (
                <div
                  key={i}
                  onClick={() => reviewMove(i)}
                  className={`text-sm py-1 border-b border-gray-600 cursor-pointer ${reviewIndex === i ? 'bg-green-700' : ''}`}
                >
                  {i + 1}. {move.from} → {move.to}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="flex mt-6 gap-4">
        <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700 text-white">Restart</Button>
        {reviewIndex > -1 && (
          <Button onClick={() => reviewMove(reviewIndex - 1)} disabled={reviewIndex <= 0}>← Prev</Button>
        )}
        {reviewIndex > -1 && (
          <Button onClick={() => reviewMove(reviewIndex + 1)} disabled={reviewIndex >= history.length - 1}>Next →</Button>
        )}
      </div>
    </div>
);
}
