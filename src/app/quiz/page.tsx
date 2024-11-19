"use client";
import type { Quiz } from "@/model/Quiz.model";
import React, { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
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
import { MoveLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { X, Loader2, CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuizCard } from "@/components/QuizCard";
import Link from "next/link";
import { useSpringValue, animated } from "@react-spring/web";
import Image from "next/image";

function Quiz() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [verificationErrorMessage, setVerificationErrorMessage] = useState<
    string | undefined
  >();
  const router = useRouter();

  const opacity = useSpringValue(0, {
    config: {
      duration: 1000,
    },
  });

  useEffect(() => {
    opacity.start(1);
  }, [opacity]);

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

      setIsLoading(false);
    }
  }, []);

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
      <animated.div
        style={{ opacity }}
        className="w-full flex flex-col items-start xl:px-20 xl:py-8 md:px-12 md:py-6 sm:px-8 sm:py-4 p-4 py-3 md:space-y-12 min-[700px]:space-y-11 sm:space-y-10 space-y-8 bg-gradient-to-br from-extralight-cyan to-extralight-sky"
      >
        <section>
          <span className="inline-block xl:w-[240px]  md:w-[200px] w-[180px] ">
            <Link href={"/"} className="w-full h-full">
              <Image
                src="/main_logo.svg"
                width={240}
                height={240}
                layout="responsive"
                alt="logo"
                className="w-full h-full"
              />
            </Link>
          </span>
        </section>
        <div className="w-full flex items-center justify-between md:px-4 px-0">
          <h1 className="xl:text-3xl md:text-[27px] sm:text-2xl text-xl text-blue-950 font-bold capitalize xl:gap-12 md:gap-8 gap-6">
            Active Quizzes
          </h1>
          <span className="flex items-center font-medium md:text-sm text-xs md:space-x-2 space-x-1 transition ease-linear text-sky-600 border-b border-sky-700/0 hover:border-sky-700/100 hover:text-sky-700">
            <MoveLeft className="w-4 h-4" />
            <Link href={"/"}>Back to Home</Link>
          </span>
        </div>
        <section className="w-full h-screen flex flex-col items-center xl:px-4 md:py-2 px-0 py-1 gap-4 md:gap-8 ">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <span className="sr-only">Loading...</span>
              <Loader2 className="text-blue-400 w-10 h-10 animate-spin" />
            </div>
          ) : (
            <>
              <div className=" h-screen flex justify-center items-center">
                <span className="font-medium text-2xl text-slate-500/60">
                  No Live Quiz
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
                      <span className="md:text-base text-sm capitalize font-semibold tracking-wide text-green-400">
                        Create new Quiz
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                      <div className="flex justify-between items-center">
                        <AlertDialogTitle>Verification</AlertDialogTitle>
                        <AlertDialogCancel className="md:w-8 md:h-8 w-6 h-6">
                          <X className="text-red-400" />
                        </AlertDialogCancel>
                      </div>
                      <AlertDialogDescription className="md:text-sm text-xs">
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
                          className="placeholder:text-sm"
                        />
                      </div>
                      <Button size="sm" className="px-3" onClick={onSubmit}>
                        <span className="">Verify</span>
                      </Button>
                    </div>
                    {verificationErrorMessage && (
                      <p className="text-red-400 xl:text-sm md:text-xs text-[10px]">
                        {verificationErrorMessage}
                      </p>
                    )}
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </section>
      </animated.div>
    );
  }

  return (
    <animated.div
      style={{ opacity }}
      className="w-full flex flex-col items-start xl:px-20 xl:py-8 md:px-12 md:py-6 sm:px-8 sm:py-4 p-4 py-3 md:space-y-12 min-[700px]:space-y-11 sm:space-y-10 space-y-8 bg-gradient-to-br from-extralight-cyan to-extralight-sky"
    >
      <section>
        <span className="inline-block xl:w-[240px]  md:w-[200px] w-[180px] ">
          <Link href={"/"} className="w-full h-full">
            <Image
              src="/main_logo.svg"
              width={240}
              height={240}
              layout="responsive"
              alt="logo"
              className="w-full h-full"
            />
          </Link>
        </span>
      </section>
      <div className="w-full flex items-center justify-between md:px-4 px-0">
        <h1 className="xl:text-3xl md:text-[27px] sm:text-2xl text-xl text-blue-950 font-bold capitalize xl:gap-12 md:gap-8 gap-6">
          Active Quizzes
        </h1>
        <span className="flex items-center font-medium md:text-sm text-xs md:space-x-2 space-x-1 transition ease-linear text-sky-600 border-b border-sky-700/0 hover:border-sky-700/100 hover:text-sky-700">
          <MoveLeft className="w-4 h-4" />
          <Link href={"/"}>Back to Home</Link>
        </span>
      </div>

      <section className="w-full h-screen flex flex-col items-center xl:px-4 md:py-2 px-0 py-1 gap-4 md:gap-8 ">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="sr-only">Loading...</span>
            <Loader2 className="text-blue-400 md:w-10 md:h-10 w-6 h-6 animate-spin" />
          </div>
        ) : (
          <>
            <div className="md:w-[90%] w-full flex flex-col items-center gap-6 ">
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
                    <span className="md:text-base text-sm capitalize font-semibold tracking-wide text-green-400">
                      Create new Quiz
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-md max-w-[320px]">
                  <AlertDialogHeader>
                    <div className="flex justify-between items-center">
                      <AlertDialogTitle>Verification</AlertDialogTitle>
                      <AlertDialogCancel className="md:w-8 md:h-8 w-6 h-6">
                        <X className="text-red-400" />
                      </AlertDialogCancel>
                    </div>
                    <AlertDialogDescription className="md:text-sm text-xs">
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
                        className="placeholder:text-sm"
                      />
                    </div>
                    <Button size="sm" className="px-3" onClick={onSubmit}>
                      <span className="">Verify</span>
                    </Button>
                  </div>
                  {verificationErrorMessage && (
                    <p className="text-red-400 xl:text-sm md:text-xs text-[10px]">
                      {verificationErrorMessage}
                    </p>
                  )}
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </section>
    </animated.div>
  );
}

export default Quiz;
