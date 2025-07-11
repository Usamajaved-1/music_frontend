import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const url = request.nextUrl.clone();

  const protectedRoutes = ["/courses", "/admin", "/dashboard"];

  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!token) {
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/courses/:path*", "/admin/:path*", "/dashboard/:path*"],
};
