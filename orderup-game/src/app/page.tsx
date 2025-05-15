"use client";

import { GoogleGenAI } from "@google/genai";
import { useEffect, useState } from "react";

// type JSONResponse = {
//   title: string;
//   ordered_list: string[];
//   correct_order: string[];
// };

export default function Home() {
  const [question, setQuestion] = useState<string | null>(null);

  useEffect(() => {
    const ai: GoogleGenAI = new GoogleGenAI({
      apiKey: `${process.env.NEXT_PUBLIC_AI_API}`,
    });
    async function main() {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash", //gemma-3-27b-it
          contents:
            "I have a game that the user needs to order 5 results from least to greatest. \
    The topics can very from music, video games, culture, geography, animals, etc. Only return \
    to me a title, a random ordered array of the top 5 results for any random topic you choose and it has to have the array key of random_list, \
    and the array in the correct order starting with the greatest in the 0 index and it has to have the array key is ordered_list.",
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
            <h1>{parsedQuestion.title}</h1>
            <ul>
              {parsedQuestion.random_list.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h2>Correct Order:</h2>
            <ul>
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
