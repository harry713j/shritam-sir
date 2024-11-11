"use client";
import type { Quiz } from "@/model/Quiz.model";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { X, Loader2, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuizCard } from "@/components/QuizCard";

function Quiz() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [verificationErrorMessage, setVerificationErrorMessage] = useState<
    string | undefined
  >();
  const { toast } = useToast();
  const router = useRouter();

  console.log(quizzes);

  const getQuizzes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/get-all-quizzes`);
      if (response.data) {
        setQuizzes(response.data.quizzes || []);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching the quizzes", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Uh oh! Something went wrong",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, [toast]);

  const onSubmit = () => {
    // if the code is correct then push to create quiz page if wrong then show error message

    if (code === process.env.NEXT_PUBLIC_SHRITAM_SECRETE_KEY) {
      router.push(`/quiz/create`);
    } else {
      setVerificationErrorMessage("Invalid code, try again");
    }
  };

  const handleDeleteQuiz = (slug: string) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.filter((quiz) => quiz.slug !== slug)
    );
  };

  useEffect(() => {
    getQuizzes();
  }, [getQuizzes]);

  if (quizzes.length === 0) {
    return (
      <div className="w-full flex flex-col items-start px-8 py-4 gap-4">
        <h1 className="text-4xl text-blue-900 font-bold capitalize gap-12">
          Active Quizzes
        </h1>
        <section className="w-full h-screen flex flex-col items-center px-4 py-2 gap-8 ">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="sr-only">Loading...</span>
              <Loader2 className="text-blue-400 w-10 h-10 animate-spin" />
            </div>
          ) : (
            <>
              <div className=" h-screen flex justify-center items-center">
                <span className="font-medium text-2xl text-slate-500/60">
                  No Quiz Found
                </span>
              </div>
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-green-400 hover:bg-green-100"
                    >
                      <CirclePlus className="w-5 h-5 stroke-2 text-green-400" />
                      <span className="text-base capitalize font-semibold tracking-wide text-green-400">
                        Create new Quiz
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                      <div className="flex justify-between items-center">
                        <AlertDialogTitle>Verification</AlertDialogTitle>
                        <AlertDialogCancel className="w-8 h-8">
                          <X className="text-red-400" />
                        </AlertDialogCancel>
                      </div>
                      <AlertDialogDescription>
                        If you are Shritam Mohanty, please submit your secrete
                        code
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Input
                          id="link"
                          value={code}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setCode(e.target.value)
                          }
                          placeholder="Secrete Code"
                        />
                      </div>
                      <Button size="sm" className="px-3" onClick={onSubmit}>
                        <span className="">Verify</span>
                      </Button>
                    </div>
                    {verificationErrorMessage && (
                      <p className="text-red-400 text-sm">
                        {verificationErrorMessage}
                      </p>
                    )}
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-start px-8 py-4 gap-4">
      <h1 className="text-4xl text-blue-900 font-bold capitalize gap-12">
        Active Quizzes
      </h1>

      <section className="w-full h-screen flex flex-col items-center px-4 py-2 gap-8 ">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="sr-only">Loading...</span>
            <Loader2 className="text-blue-400 w-10 h-10 animate-spin" />
          </div>
        ) : (
          <>
            <div className="w-[80%] flex flex-col items-center gap-6 ">
              {quizzes?.map((quiz: Quiz, index: number) => (
                <QuizCard
                  key={index}
                  name={quiz.name}
                  subject={quiz.subject}
                  slug={quiz.slug}
                  redirectLink={quiz.redirectLink}
                  originalLink={quiz.originalLink}
                  onDelete={() => handleDeleteQuiz(quiz.slug)}
                />
              ))}
            </div>
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-green-400 hover:bg-green-100"
                  >
                    <CirclePlus className="w-5 h-5 stroke-2 text-green-400" />
                    <span className="text-base capitalize font-semibold tracking-wide text-green-400">
                      Create new Quiz
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <div className="flex justify-between items-center">
                      <AlertDialogTitle>Verification</AlertDialogTitle>
                      <AlertDialogCancel className="w-8 h-8">
                        <X className="text-red-400" />
                      </AlertDialogCancel>
                    </div>
                    <AlertDialogDescription>
                      If you are Shritam Mohanty, please submit your secrete
                      code
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Input
                        id="link"
                        value={code}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setCode(e.target.value)
                        }
                        placeholder="Secrete Code"
                      />
                    </div>
                    <Button size="sm" className="px-3" onClick={onSubmit}>
                      <span className="">Verify</span>
                    </Button>
                  </div>
                  {verificationErrorMessage && (
                    <p className="text-red-400 text-sm">
                      {verificationErrorMessage}
                    </p>
                  )}
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Quiz;
