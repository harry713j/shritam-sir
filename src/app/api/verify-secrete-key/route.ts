import { ApiResponse } from "@/types/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const { secreteKey } = await request.json();
    const cookieStore = await cookies();

    if (
      !secreteKey ||
      typeof secreteKey !== "string" ||
      secreteKey !== process.env.SECRETE_KEY
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect Key, try again",
        },
        { status: 401 }
      );
    }

    cookieStore.set({
      name: "is_verified",
      value: "true",
      secure: true, // if true then it only works for https only
      httpOnly: true,
      maxAge: 3600,
      sameSite: "strict",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Verification Successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error verifying secrete key");
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify",
      },
      { status: 500 }
    );
  }
}
