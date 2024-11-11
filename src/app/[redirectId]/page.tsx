"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/types";
import Link from "next/link";

function RedirectPage() {
  const params = useParams<{ redirectId: string }>();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

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
        <div className="w-screen h-screen flex items-center justify-center">
          <div className="flex flex-col items-start space-y-6">
            <h1 className="text-5xl text-blue-900 font-bold">Oops!</h1>
            <h2 className="text-2xl text-blue-950/70 font-semibold capitalize">
              {errorMessage}
            </h2>
            <span className="text-blue-950/50">
              <Link className="text-blue-600 hover:underline" href={"/quiz"}>
                Click here
              </Link>{" "}
              to check out other quizzes
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default RedirectPage;
