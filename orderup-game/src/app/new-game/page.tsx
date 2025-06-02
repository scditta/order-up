"use client";

import { GoogleGenAI, Type } from "@google/genai";
import { useEffect, useState } from "react";

import { categories } from "@/app/catagories.json";

interface SetupProps {
  setGame: (value: boolean) => void;
  gameData: {
    listSize: number;
    categoryID: number;
    difficulty: string;
  };
}

type JSONResponse = {
  title: string;
  list: string[];
  correct_order: string[];
};

const sampleResponse = {
  title: "Test Title",
  list: ["item 3", "item 1", "item 4", "item 2", "item 5"],
  correct_order: ["Item 5", "Item 4", "Item 3", "Item 2", "Item 1"],
};

export default function NewGame({ setGame, gameData }: SetupProps) {
  // const [question, setQuestion] = useState<JSONResponse>({
  //   title: "",
  //   list: [],
  //   correct_order: [],
  // });
  const [question, setQuestion] = useState<JSONResponse>(sampleResponse);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  // const [usersOrder, setUsersOrder] = useState<string[]>(question.list);

  useEffect(() => {
    // Initialize AI and fetch question data
    //   const ai: GoogleGenAI = new GoogleGenAI({
    //   apiKey: `${process.env.NEXT_PUBLIC_AI_API}`,
    // });

    async function fetchQuestion() {
      const ai: GoogleGenAI = new GoogleGenAI({
        apiKey: `${process.env.NEXT_PUBLIC_AI_API}`,
      });
      try {
        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash", //gemini-2.0-flash
          contents: `I have a game that the user needs to order ${
            gameData.listSize
          } results from least to greatest. The topic / question type is ${
            categories.find((cat) => cat.id === gameData.categoryID)?.name
          }. Only return the title, a random ordered array of the top ${
            gameData.listSize
          } results for the topic / question type you choose and it has to have the array key of list, and an array in the correct order starting with the greatest in index 0 and it has to have the array key is correct_order. Finally do not reveal the correct order in the response. The difficulty of the question should be ${
            gameData.difficulty
          } The response should be in JSON format and nothing else.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                list: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correct_order: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              propertyOrdering: ["title", "list", "correct_order"],
              required: ["title", "list", "correct_order"],
            },
          },
        });

        //Parse the response text to JSON -- maybe fixed in the future
        //gemini-1.5-flash should allow for JSON mode parsing however it is not working at the moment
        if (typeof response.text === "string") {
          const json = JSON.parse(response.text);
          setQuestion({
            title: json.title,
            list: json.list,
            correct_order: json.correct_order,
          });
          setDataLoaded(true);
          console.log(json);
        } else {
          console.error(
            "Response text is undefined or not a string:",
            response.text
          );
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        fetchQuestion(); // Retry fetching the question
      }
    }
    fetchQuestion();
    // setDataLoaded(true);
  }, [gameData]);

  const newQuestion = () => {
    // Logic to generate a new question
  };

  return (
    <div className="flex flex-col h-screen">
      {dataLoaded ? (
        <div className="flex flex-col h-1/4 justify-around">
          <h1 className="text-center text-4xl font-bold">{question.title}</h1>
          <div className="text-center">
            {question.list.map((item, index) => (
              <div
                key={index}
                className={`cursor-move relative group`}
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", index.toString());
                  e.currentTarget.classList.add("dragging");
                }}
                onDragEnd={(e) => {
                  e.currentTarget.classList.remove("dragging");
                  // Remove all drop indicators
                  document
                    .querySelectorAll(".drop-indicator")
                    .forEach((el) =>
                      el.classList.remove(
                        "border-t-4",
                        "border-blue-500",
                        "border-b-4"
                      )
                    );
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  const bounding = e.currentTarget.getBoundingClientRect();
                  const offset = e.clientY - bounding.top;
                  const height = bounding.height;
                  // Remove previous indicators
                  e.currentTarget.classList.remove(
                    "border-t-4",
                    "border-b-4",
                    "border-blue-500"
                  );
                  // Add indicator depending on mouse position
                  if (offset < height / 2) {
                    e.currentTarget.classList.add(
                      "border-t-4",
                      "border-blue-500",
                      "drop-indicator"
                    );
                  } else {
                    e.currentTarget.classList.add(
                      "border-b-4",
                      "border-blue-500",
                      "drop-indicator"
                    );
                  }
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove(
                    "border-t-4",
                    "border-b-4",
                    "border-blue-500",
                    "drop-indicator"
                  );
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-t-4",
                    "border-b-4",
                    "border-blue-500",
                    "drop-indicator"
                  );
                  const fromIndex = Number(
                    e.dataTransfer.getData("text/plain")
                  );
                  const bounding = e.currentTarget.getBoundingClientRect();
                  const offset = e.clientY - bounding.top;
                  const height = bounding.height;
                  let toIndex = index;
                  // If dropping in the bottom half, insert after
                  if (offset >= height / 2) {
                    toIndex = index + 1;
                  }
                  if (fromIndex === toIndex || fromIndex + 1 === toIndex)
                    return;
                  setQuestion((prev) => {
                    const newList = [...prev.list];
                    const [moved] = newList.splice(fromIndex, 1);
                    // Adjust toIndex if item is moved downwards
                    const insertAt =
                      fromIndex < toIndex ? toIndex - 1 : toIndex;
                    newList.splice(insertAt, 0, moved);
                    return {
                      ...prev,
                      list: newList,
                    };
                  });
                }}
              >
                <p className="select-none">{item}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <br />
      <button
        onClick={() => {
          setQuestion({
            title: "",
            list: [],
            correct_order: [],
          });
          setDataLoaded(false);
          setGame(false);
        }}
      >
        Back
      </button>
    </div>
  );
}
