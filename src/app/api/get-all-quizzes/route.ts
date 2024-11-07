import connectDb from "@/lib/connectDb";
import QuizModel from "@/model/Quiz.model";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  await connectDb();
  try {
    const quizzes = await QuizModel.find({}).sort("-createdAt");

    if (quizzes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Quizzes don't exists",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Quizzes get successful",
        quizzes: quizzes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error getting all the quizzes", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get all the quizzes",
      },
      { status: 500 }
    );
  }
}
