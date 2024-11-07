import connectDb from "@/lib/connectDb";
import QuizModel from "@/model/Quiz.model";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/types";

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  await connectDb();
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug not provided",
        },
        { status: 400 }
      );
    }

    const deletedQuiz = await QuizModel.findOneAndDelete({ slug });

    if (!deletedQuiz) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz not exists",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Quiz deletion successful" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting the quiz", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete the quiz",
      },
      { status: 500 }
    );
  }
}
