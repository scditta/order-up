"use client";

import { useState } from "react";
import Setup from "../setup/page";
import NewGame from "../new-game/page";

export default function Page() {
  const [beginGame, setBeginGame] = useState<boolean>(false);

  const [gameData, setGameData] = useState<{
    listSize: number;
    categoryID: number;
    difficulty: string;
  }>({
    listSize: 5,
    categoryID: 1,
    difficulty: "easy",
  });

  return (
    <div className="h-screen w-screen">
      {beginGame ? (
        <NewGame setGame={setBeginGame} gameData={gameData} />
      ) : (
        <Setup
          setGame={setBeginGame}
          gameData={gameData}
          setGameData={setGameData}
        />
      )}
    </div>
  );
}
