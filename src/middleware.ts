import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const isAuthorized = await request.cookies.get("is_verified")?.value;

  if (request.nextUrl.pathname === "/quiz/create" && isAuthorized !== "true") {
    return NextResponse.redirect(new URL("/quiz", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/quiz/create",
};
