import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    const path = req.nextUrl.pathname;

    if (path.startsWith("/dashboard") && !session) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if ((path === "/login" || path === "/signup") && session) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return res;
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};