import connectDb from "@/lib/connectDb";
import QuizModel, { Content } from "@/model/Quiz.model";
import { ApiResponse } from "@/types/types";
import { nanoid } from "nanoid";
import { NextResponse, NextRequest } from "next/server";

type CreateQuizBody = {
  name: string;
  slug: string;
  content: Content[];
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  await connectDb();
  try {
    const { name, slug, content }: CreateQuizBody = await request.json();

    if (!name || !slug || content.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Some fields are missing",
        },
        { status: 400 }
      );
    }

    // check for quiz with same name is exists or not

    const existingQuiz = await QuizModel.findOne({
      name,
      slug,
    });

    if (existingQuiz) {
      return NextResponse.json(
        {
          success: false,
          message: "Quiz with same name is already exists",
        },
        { status: 400 }
      );
    }

    const randomString = nanoid(16);
    const baseUrl = process.env.PUBLIC_BASE_URL ?? "http://localhost:3000"; // Fallback URL
    const redirectLink = `${baseUrl}/${randomString}`;
    const originalLink = `${baseUrl}/quiz?slug=${slug}`;

    const quiz = await QuizModel.create({
      name,
      slug,
      redirectLink,
      originalLink,
      content,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Quiz created successfully",
        quiz: quiz,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating the quiz", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create the quiz",
      },
      { status: 500 }
    );
  }
}
