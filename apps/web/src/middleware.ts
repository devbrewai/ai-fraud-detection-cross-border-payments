import { NextRequest, NextResponse } from "next/server";
// AUTH_GATE: Uncomment to re-enable auth protection
// import { getSessionCookie } from "better-auth/cookies";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(_request: NextRequest) {
  // AUTH_GATE: Uncomment the block below to re-enable auth protection
  // const sessionCookie = getSessionCookie(request);
  //
  // if (!sessionCookie) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - /login, /logout (auth pages)
     * - /api/auth (Better Auth API routes)
     * - /_next (Next.js internals)
     * - /logos, /favicon.ico (static assets)
     * - /stats (Umami analytics proxy)
     */
    "/((?!login|logout|api/auth|_next|logos|favicon\\.ico|stats).*)",
  ],
};
