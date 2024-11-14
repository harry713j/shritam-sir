"use client";
import { type Quiz } from "@/model/Quiz.model";
import { createContext, ReactNode, useContext, useState } from "react";

type QuizContextType = {
  chosenOptions: string[];
  quiz: Quiz | undefined;
  score: number;
  setChosenOptions: (options: string[]) => void;
  setQuiz: (newQuiz: Quiz | undefined) => void;
  calculateScore: (correctAnswers: string[] | undefined) => void;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quiz, setQuiz] = useState<Quiz | undefined>();
  const [chosenOptions, setChosenOptions] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);

  const calculateScore = (correctAnswer: string[] | undefined) => {
    let calculatedScore = 0;

    chosenOptions.forEach((option, index) => {
      if (option === correctAnswer?.[index]) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
  };

  return (
    <QuizContext.Provider
      value={{
        chosenOptions,
        quiz,
        score,
        setChosenOptions,
        setQuiz,
        calculateScore,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export const useQuizResult = () => {
  const context = useContext(QuizContext);

  if (context === undefined) {
    throw new Error("Quiz context is undefined");
  }
  return context;
};
