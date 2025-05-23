"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { name: "Anything", id: 1 },
  { name: "History", id: 2 },
  { name: "Science", id: 3 },
  { name: "Sports", id: 4 },
  { name: "Entertainment", id: 5 },
  { name: "Art", id: 6 },
  { name: "Geography", id: 7 },
  { name: "Music", id: 8 },
  { name: "Movies", id: 9 },
  { name: "Literature", id: 10 },
  { name: "Technology", id: 11 },
  { name: "Nature", id: 12 },
  { name: "Animals", id: 13 },
  { name: "Mythology", id: 14 },
  { name: "Languages", id: 15 },
  { name: "Philosophy", id: 16 },
  { name: "Psychology", id: 17 },
  { name: "Religion", id: 18 },
  { name: "Politics", id: 19 },
  { name: "Business", id: 20 },
  { name: "Food", id: 21 },
];

export default function Setup({
  setGame,
}: {
  setGame: (value: boolean) => void;
}) {
  const [numberOfResults, setNumberOfResults] = useState<number>(5);
  const [category, setcategory] = useState<string>("anything");

  const updateSetSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 10) {
      alert("The maximum number of results is 10");
      return;
    } else if (value < 1) {
      alert("The minimum number of results is 1");
      return;
    } else if (isNaN(value)) {
      alert("Please enter a valid number");
      return;
    }
    setNumberOfResults(value);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-5xl font-bold text-center">Order Up!</h1>
      <div className="h-1/2 w-1/2 text-center m-auto p-10">
        <div className="h-full m-5 bg-amber-300 rounded-lg flex flex-col justify-around">
          <div>
            <div>Categories</div>
            <div className="grid grid-cols-3 gap-5 mx-5">
              {categories.slice(0, 8).map((category, index) => {
                return (
                  <div
                    key={index}
                    className="bg-amber-500 p-2 cursor-pointer hover:bg-amber-400"
                  >
                    {category.name}
                  </div>
                );
              })}
              <div className="bg-amber-500 p-2 cursor-pointer hover:bg-amber-400">
                Other
              </div>
            </div>
          </div>
          <div>
            <p>Sorting Set Size</p>
            <input
              type="number"
              className="m-2 px-2 w-14 bg-white border-1 rounded-sm"
              value={numberOfResults}
              onChange={updateSetSize}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setGame(true);
            }}
          >
            Begin
          </button>
        </div>
      </div>
      <div className="h-1/2 w-1/2 text-center m-auto p-10">
        <div className="h-full m-5 bg-amber-300 rounded-lg flex flex-col">
          <Link href="/play/leaderboard" className="basis-1/5">
            Leaderboard
          </Link>
          <div>Stats</div>
        </div>
      </div>
    </div>
  );
}
