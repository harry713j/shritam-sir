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
    <div className="w-full flex flex-col space-y-12 px-20 py-8">
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <span className="sr-only">Loading...</span>
          <LoaderCircle className="w-10 h-10 text-blue-400 animate-spin" />
        </div>
      ) : !quiz ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <span className="font-medium text-2xl text-slate-500/60">
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
            <h2 className="text-blue-950/80 capitalize font-semibold text-3xl">
              {quiz.name}
            </h2>
            <p className="text-blue-950/50 capitalize font-light text-base">{`${quiz.subject} - ${quiz.content.length} questions `}</p>
          </section>
          <section>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-start space-y-6"
            >
              {quiz.content.map((cont: Content, index) => (
                <div
                  key={`${index}`}
                  className="flex flex-col items-start space-y-3"
                >
                  <p className="text-slate-600 font-semibold text-base">{`${
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
                              className="w-[18px] h-[18px]"
                            />
                            <Label
                              htmlFor={`${opt}-${i}`}
                              className="capitalize text-sm text-slate-500 font-medium"
                            >
                              {opt}
                            </Label>
                          </span>
                        ))}
                      </RadioGroup>
                    )}
                  />

                  {form.formState.errors.chosenOptions?.[index] && (
                    <p className="pl-6 font-light text-red-400 text-sm">
                      {form.formState.errors.chosenOptions?.[index].message}
                    </p>
                  )}
                </div>
              ))}
              <Button
                type="submit"
                className="text-base font-semibold capitalize mt-6"
              >
                Submit
              </Button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}

export default SingleQuiz;
