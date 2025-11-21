import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const path = req.nextUrl.pathname;

    if (path === "/") {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return res;
}

export const config = {
    matcher: ["/"],
};