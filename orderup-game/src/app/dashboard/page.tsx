"use client";

import { useState } from "react";
import Setup from "../setup/page";
import NewGame from "../new-game/page";

//usecontext to pass data from the setup page to the new game page
//wrap the parent around the div below

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
        <NewGame setGame={setBeginGame} />
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
