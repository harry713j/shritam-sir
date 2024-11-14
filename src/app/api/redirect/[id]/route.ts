import connectDb from "@/lib/connectDb";
import QuizModel from "@/model/Quiz.model";
import { ApiResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  const { id } = await params;
  await connectDb();
  try {
    const redirectLink = `${process.env.PUBLIC_BASE_URL}/${id}`;
    const quiz = await QuizModel.findOne({
      redirectLink: redirectLink,
    });

    if (quiz && quiz.originalLink) {
      return NextResponse.json(
        {
          success: true,
          message: "Success",
          originalLink: quiz.originalLink,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz is not found or may be the owner removed it.",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("Error getting the Original Link", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get the Original Link",
      },
      { status: 500 }
    );
  }
}
