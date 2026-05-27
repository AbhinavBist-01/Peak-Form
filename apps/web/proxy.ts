import { NextResponse, type NextRequest } from "next/server";

const authRoutes = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = Boolean(request.cookies.get("authentication-token")?.value);

  if (authRoutes.includes(pathname) && hasAuthCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup"],
};
