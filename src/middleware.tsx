import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useAuth } from "./app/context/AuthContext";

export function middleware(req: NextRequest) {
  const tokenCookie = req.cookies.get("idToken");  
  const token = tokenCookie ? tokenCookie.value : null;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const decodedToken = jwt.decode(token) as JwtPayload | null; 
  if (decodedToken) {
    if (
      decodedToken.iat &&
      decodedToken.iat * 1000 + 7 * 24 * 60 * 60 * 1000 < Date.now()
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    } 

    // if (
    //   req.nextUrl.pathname.startsWith("/gaji") &&
    //   decodedToken.role !== "Owner"
    // ) {
    //   return NextResponse.redirect(new URL("/dashboard", req.url));
    // }
  } else {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
