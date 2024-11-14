"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/types";
import Link from "next/link";
import { useSpringValue, animated } from "@react-spring/web";

function RedirectPage() {
  const params = useParams<{ redirectId: string }>();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const opacity = useSpringValue(0, {
    config: {
      duration: 1000,
    },
  });

  useEffect(() => {
    opacity.start(1);
  }, [opacity]);

  const redirect = useCallback(async () => {
    try {
      const response = await axios.get(`/api/redirect/${params.redirectId}`);

      if (response.data) {
        router.replace(response.data.originalLink);
      }
    } catch (error) {
      console.error("Error redirecting", error);
      const axiosError = error as AxiosError<ApiResponse>;
      setErrorMessage(
        axiosError.response?.data.message ||
          "Quiz is not found or may be the owner removed it."
      );
    }
  }, [params, router]);
  useEffect(() => {
    redirect();
  }, [redirect]);

  return (
    <>
      {errorMessage && (
        <animated.div
          style={{ opacity }}
          className="w-screen h-screen flex items-center justify-center xl:px-20 xl:py-8 md:px-12 md:py-6 sm:px-8 sm:py-4 p-4 py-3  bg-gradient-to-br from-extralight-cyan to-extralight-sky"
        >
          <div className="flex flex-col items-start space-y-6">
            <h1 className="md:text-5xl text-4xl text-blue-900 font-bold">
              Oops!
            </h1>
            <h2 className="md:text-2xl text-lg text-blue-950/70 font-semibold capitalize">
              {errorMessage}
            </h2>
            <span className="text-blue-950/50">
              <Link
                className="text-blue-600 md:text-base text-sm hover:underline"
                href={"/quiz"}
              >
                Click here
              </Link>{" "}
              to check out other quizzes
            </span>
          </div>
        </animated.div>
      )}
    </>
  );
}

export default RedirectPage;
