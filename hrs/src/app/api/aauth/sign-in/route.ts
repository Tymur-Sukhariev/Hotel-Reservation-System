import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
    const previousPath = req.headers.get('Referer');
    let prevPath = '/'; 
    if (previousPath) {
        const prevUrl = new URL(previousPath);
        prevPath = prevUrl.pathname === '/auth/sign-up' ? '/' : prevUrl.pathname;
    }
    const newUrl = new URL(`/auth/sign-in?previous=${encodeURIComponent(prevPath)}`, req.nextUrl.origin);
    return NextResponse.redirect(newUrl.toString());
}
