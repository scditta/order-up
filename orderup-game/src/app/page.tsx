"use client";

import { GoogleGenAI, Type } from "@google/genai";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [numberOfResults, setNumberOfResults] = useState<number>(5);
  const [category, setcategory] = useState<string>("anything"); //anything

  const [display, setDisplay] = useState<boolean>(false);

  const [score, setScore] = useState<number>(0);
  const [rounds, setRounds] = useState<number>(0);

  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  // const [question, setQuestion] = useState<JSONResponse>({
  //   title: "",
  //   list: [],
  //   correct_order: [],
  // });
  const [question, setQuestion] = useState<JSONResponse>(sampleResponse);

  useEffect(() => {
    const ai: GoogleGenAI = new GoogleGenAI({
      apiKey: `${process.env.NEXT_PUBLIC_AI_API}`,
    });
    async function main() {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash", //gemma-3-27b-it
          contents: `I have a game that the user needs to order ${numberOfResults} results from least to greatest. The topic / question type is ${category}. Only return the title, a random ordered array of the top ${numberOfResults} results for the topic / question type you choose and it has to have the array key of random_list, and an array in the correct order starting with the greatest in index 0 and it has to have the array key is ordered_list. Finally do not reviel the correct order in the response. The response should be in JSON format and nothing else.`,
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
        // setQuestion(response);
      } catch (error) {
        console.error("Error generating content:", error);
      }
    }

    // main();
    setDataLoaded(true);
    // console.log("AI API Key: ", process.env.NEXT_PUBLIC_AI_API);
  }, [numberOfResults, category]);

  const getQuestion = () => {
    // console.log(question["title"]);
    try {
      if (!dataLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
          <div>
            <h1 className="font-bold">{question.title}</h1>
            <ul>
              {question.list.map((item: string, index: number) => (
                <li key={index}>
                  {index + 1}: {item}
                </li>
              ))}
            </ul>
            <h2>Correct Order:</h2>
            <button
              onClick={() => {
                setDisplay(!display);
              }}
            >
              Show
            </button>
            <ul className={display ? "" : "hidden"}>
              {question.correct_order.map((item: string, index: number) => (
                <li key={index}>
                  {index + 1}: {item}
                </li>
              ))}
            </ul>
          </div>
        );
      }
    } catch (error) {
      console.error("Error parsing question:", error);
      return <div>Error loading question</div>;
    }
  };

  return (
    <>
      <div className="h-screen w-screen">
        <div className="flex h-screen w-full justify-center items-center flex-col">
          <h1 className="relative text-8xl font-bold text-center">Order Up!</h1>
          <div className="my-10">
            <Link
              href={`/dashboard`}
              className="m-1.5 p-3 bg-gray-500 cursor-pointer rounded-md"
            >
              Start
            </Link>
          </div>
        </div>
      </div>

      {/* {getQuestion()} */}
    </>
  );
}
