"use client";
import React, { useEffect } from "react";
import {
  Label as RechartLabel,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useQuizResult } from "@/context/QuizContext";
import { Content } from "@/model/Quiz.model";
import Link from "next/link";
import { useSpringValue, animated } from "@react-spring/web";

function ResultPage() {
  const { quiz, score, chosenOptions, calculateScore } = useQuizResult();
  const correctAnswer = quiz?.content.map((ct) => ct.options[ct.answer]);

  const chartConfig = {
    score: {
      label: "Score",
    },
    fillColor: {
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const opacity = useSpringValue(0, {
    config: {
      duration: 1000,
    },
  });

  useEffect(() => {
    opacity.start(1);
  }, [opacity]);

  useEffect(() => {
    calculateScore(correctAnswer);
  }, [calculateScore, correctAnswer]);

  const scorePercentage = score
    ? Math.floor((score / (quiz?.content.length ?? 0)) * 100)
    : 0;

  return (
    <animated.div
      style={{ opacity }}
      className="flex flex-col items-start md:space-y-12 min-[700px]:space-y-11 sm:space-y-10 space-y-8 xl:px-20 xl:py-8 md:px-12 md:py-6 sm:px-8 sm:py-4 p-4 py-3"
    >
      <h1 className="lg:text-4xl md:text-[2rem] sm:text-3xl text-2xl text-blue-950 capitalize font-bold">
        Your Score
      </h1>
      <section className="w-full flex md:flex-row flex-col md:items-center md:justify-center md:space-x-12">
        <div>
          <ChartContainer
            config={chartConfig}
            className="mx-auto min-w-[250px] min-h-[250px] aspect-square max-h-[250px]"
          >
            <RadialBarChart
              width={250}
              height={250}
              startAngle={0}
              endAngle={360 / (100 / scorePercentage)}
              innerRadius={80}
              outerRadius={110}
              data={[
                {
                  name: "Score",
                  value: scorePercentage,
                  fill: "#60A5FA",
                },
              ]}
            >
              <PolarGrid
                radialLines={false}
                gridType="circle"
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey="value" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <RechartLabel
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl text-slate-600 font-bold"
                          >
                            {`${scorePercentage}%`}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Score
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>
        <div className="flex flex-col items-start space-y-2">
          <h2 className="text-2xl md:text-3xl text-slate-600 font-semibold">
            {scorePercentage === 100
              ? "Perfect Score!"
              : scorePercentage > 84
              ? "Excellent!"
              : scorePercentage > 69
              ? "Good job!"
              : scorePercentage > 59
              ? "Well done!"
              : scorePercentage > 49
              ? "Keep it up!"
              : scorePercentage > 39
              ? "Average!"
              : "Poor!"}
          </h2>
          <div className="flex flex-col space-y-4">
            <p className="md:text-base text-sm text-slate-600/70 font-medium">
              You have scored {`${score} / ${quiz?.content.length}.`}
            </p>
            <span className="bg-blue-500 transition-colors ease-in rounded-[3px] flex justify-center px-3 py-1.5 hover:bg-blue-600">
              <Link
                className="text-white md:text-sm text-xs font-semibold capitalize"
                href={`/quiz`}
              >
                Try other quiz
              </Link>
            </span>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-start space-y-6">
        <div className="flex flex-col items-start">
          <h2 className="md:text-2xl text-xl text-slate-600 font-semibold">
            Answers
          </h2>
          <span className="flex items-center space-x-4">
            <section className="flex items-center space-x-1">
              <span className="inline-block w-3 h-3 bg-green-400 border-[0.5px] border-slate-400"></span>
              <p className="md:text-sm text-xs font-light text-slate-500/70 capitalize">
                Correct answer
              </p>
            </section>
            <section className="flex items-center space-x-1">
              <span className="inline-block w-3 h-3 border-[0.5px] border-slate-400 bg-red-400"></span>
              <p className="md:text-sm text-xs font-light text-slate-500/70 capitalize">
                wrong answer by you
              </p>
            </section>
          </span>
        </div>
        {quiz?.content.map((cont: Content, index) => (
          <div
            key={`${index}`}
            className="w-full flex flex-col items-start md:space-y-3 space-y-2"
          >
            <p className="text-slate-600 font-semibold md:text-base text-sm">{`${
              index + 1
            }. ${cont.question}?`}</p>
            <div className="w-full flex flex-col items-start md:pl-6 pl-4 space-y-1 ">
              {cont.options.map((opt: string, optIndex) => (
                <span
                  key={`${opt}-${optIndex}`}
                  className={`w-full flex items-center space-x-2 p-1 ${
                    correctAnswer?.[index] === opt ? "bg-green-400 " : ""
                  } ${
                    opt === chosenOptions[index] &&
                    chosenOptions[index] !== correctAnswer?.[index]
                      ? "bg-red-400 "
                      : ""
                  }`}
                >
                  <p
                    className={` ${
                      correctAnswer?.[index] === opt ||
                      (opt === chosenOptions[index] &&
                        chosenOptions[index] !== correctAnswer?.[index])
                        ? "text-slate-100"
                        : "text-slate-500"
                    } md:text-sm text-xs font-medium `}
                  >
                    {optIndex === 0
                      ? "a)"
                      : optIndex === 1
                      ? "b)"
                      : optIndex === 2
                      ? "c)"
                      : "d)"}
                  </p>
                  <p
                    className={`${
                      correctAnswer?.[index] === opt ||
                      (opt === chosenOptions[index] &&
                        chosenOptions[index] !== correctAnswer?.[index])
                        ? "text-slate-100"
                        : "text-slate-500"
                    }  md:text-sm text-xs font-medium capitalize`}
                  >
                    {opt}
                  </p>
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </animated.div>
  );
}

export default ResultPage;
