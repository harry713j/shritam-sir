"use client";
import React, { use, useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import type { Content, Quiz } from "@/model/Quiz.model";
import { useToast } from "@/hooks/use-toast";
import type { ApiResponse } from "@/types/types";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuizResult } from "@/context/QuizContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSpringValue, animated } from "@react-spring/web";

type FormValues = {
  chosenOptions: string[];
};

function SingleQuiz({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const { quiz, setQuiz, setChosenOptions } = useQuizResult();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormValues>({
    defaultValues: {
      chosenOptions: quiz?.content.map(() => ""),
    },
  });

  const opacity = useSpringValue(0, {
    config: {
      duration: 1000,
    },
  });

  useEffect(() => {
    opacity.start(1);
  }, [opacity]);

  const getQuiz = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        `/api/get-quiz?slug=${slug}`
      );

      if (response.data) {
        setQuiz(response.data.quiz);
      }
    } catch (error) {
      console.error("Error get quiz", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Uh oh! Something went wrong",
        description:
          axiosError.response?.data.message ?? "Quiz not found or removed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, slug, setQuiz]);

  const onSubmit: SubmitHandler<FormValues> = (data: {
    chosenOptions: string[];
  }) => {
    if (!quiz || !quiz.content) return;

    setChosenOptions(data.chosenOptions);
    router.push(`/quiz/${slug}/result`);
  };

  useEffect(() => {
    getQuiz();
  }, [toast, params, getQuiz]);

  return (
    <animated.div
      style={{ opacity }}
      className="w-full flex flex-col md:space-y-12 min-[700px]:space-y-11 sm:space-y-10 space-y-8 xl:px-20 xl:py-8 md:px-12 md:py-6 sm:px-8 sm:py-4 p-4 py-3"
    >
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <span className="sr-only">Loading...</span>
          <LoaderCircle className="md:w-10 md:h-10 w-6 h-6 text-blue-400 animate-spin" />
        </div>
      ) : !quiz ? (
        <div className=" h-screen flex flex-col justify-center items-center">
          <span className="font-medium md:text-2xl text-xl text-slate-500/60">
            No Quiz Found
          </span>
          <span className="text-blue-950/50">
            <Link className="text-blue-600 hover:underline" href={"/quiz"}>
              Click here
            </Link>{" "}
            to checkout other quizzes
          </span>
        </div>
      ) : (
        <>
          <section className="flex flex-col items-center border-b border-slate-400">
            <h2 className="text-blue-950/80 capitalize font-semibold lg:text-3xl md:text-2xl text-[22px]">
              {quiz.name}
            </h2>
            <p className="text-blue-950/50 capitalize font-light lg:text-base md:text-[15px] text-sm">{`${quiz.subject} - ${quiz.content.length} questions `}</p>
          </section>
          <section>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-start md:space-y-6 space-y-4"
            >
              {quiz.content.map((cont: Content, index) => (
                <div
                  key={`${index}`}
                  className="flex flex-col items-start md:space-y-3 space-y-2"
                >
                  <p className="text-slate-600 font-semibold md:text-base text-sm">{`${
                    index + 1
                  }. ${cont.question}?`}</p>
                  <Controller
                    name={`chosenOptions.${index}`}
                    control={form.control}
                    rules={{ required: "Choosing an option is required" }}
                    render={({ field }) => (
                      <RadioGroup
                        className="pl-6 flex flex-col items-start space-y-1"
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value || ""}
                      >
                        {cont.options.map((opt: string, i) => (
                          <span
                            key={`${opt}-${i}`}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={opt}
                              id={`${opt}-${i}`}
                              className="w-[18px] h-[18px] "
                            />
                            <Label
                              htmlFor={`${opt}-${i}`}
                              className="capitalize md:text-sm text-xs text-slate-500 font-medium"
                            >
                              {opt}
                            </Label>
                          </span>
                        ))}
                      </RadioGroup>
                    )}
                  />

                  {form.formState.errors.chosenOptions?.[index] && (
                    <p className="pl-6 font-light text-red-400 md:text-sm text-xs">
                      {form.formState.errors.chosenOptions?.[index].message}
                    </p>
                  )}
                </div>
              ))}
              <Button
                type="submit"
                className="md:text-base text-sm font-semibold capitalize mt-6"
              >
                Submit
              </Button>
            </form>
          </section>
        </>
      )}
    </animated.div>
  );
}

export default SingleQuiz;
