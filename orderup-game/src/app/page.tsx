"use client";

import { GoogleGenAI } from "@google/genai";
import { useEffect, useState } from "react";

// type JSONResponse = {
//   title: string;
//   ordered_list: string[];
//   correct_order: string[];
// };

export default function Home() {
  const [numberOfResults, setNumberOfResults] = useState<number>(5);
  const [questionType, setQuestionType] = useState<string>("anything"); //anything

  const [display, setDisplay] = useState<boolean>(false);

  const [question, setQuestion] = useState<string | null>(null);

  useEffect(() => {
    const ai: GoogleGenAI = new GoogleGenAI({
      apiKey: `${process.env.NEXT_PUBLIC_AI_API}`,
    });
    async function main() {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash", //gemma-3-27b-it
          contents: `I have a game that the user needs to order ${numberOfResults} results from least to greatest. The topic / question type is ${questionType}. Only return the title, a random ordered array of the top ${numberOfResults} results for the topic / question type you choose and it has to have the array key of random_list, and an array in the correct order starting with the greatest in index 0 and it has to have the array key is ordered_list. Finally do not reviel the correct order in the response. The response should be in JSON format and nothing else.`,
          config: {
            responseMimeType: "application/json",
          },
        });
        // console.log(response.text);
        setQuestion(response.text!);
      } catch (error) {
        console.error("Error generating content:", error);
      }
    }

    main();
    // console.log("AI API Key: ", process.env.NEXT_PUBLIC_AI_API);
  }, []);

  const getQuestion = () => {
    try {
      if (question === null) {
        return <div>Loading...</div>;
      } else {
        // console.log(question);
        const parsedQuestion = JSON.parse(question);
        return (
          <div>
            <h1 className="font-bold">{parsedQuestion.title}</h1>
            <ul>
              {parsedQuestion.random_list.map((item: string, index: number) => (
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
              {parsedQuestion.ordered_list.map(
                (item: string, index: number) => (
                  <li key={index}>
                    {index + 1}: {item}
                  </li>
                )
              )}
            </ul>
          </div>
        );
      }
    } catch (error) {
      console.error("Error parsing question:", error);
      return <div>Error loading question</div>;
    }
  };

  return <>{getQuestion()}</>;
}
