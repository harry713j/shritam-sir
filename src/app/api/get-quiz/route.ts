import connectDb from "@/lib/connectDb";
import QuizModel from "@/model/Quiz.model";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  await connectDb();
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug not provided",
        },
        { status: 400 }
      );
    }

    const existingQuiz = await QuizModel.findOne({ slug });

    if (!existingQuiz) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quiz found successfully",
      quiz: existingQuiz,
    });
  } catch (error) {
    console.log("Error getting the quiz", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get the quiz",
      },
      { status: 500 }
    );
  }
}
