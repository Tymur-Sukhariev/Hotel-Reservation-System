import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
    const previousPath = req.headers.get('Referer');
    let prevPath = '/'; 

    if (previousPath) {
        const prevUrl = new URL(previousPath);
        prevPath = prevUrl.pathname === '/auth/sign-in' ? '/' : prevUrl.pathname;
    }

    const newUrl = new URL(`/auth/sign-up?previous=${encodeURIComponent(prevPath)}`, req.nextUrl.origin);
    return NextResponse.redirect(newUrl.toString());
}
