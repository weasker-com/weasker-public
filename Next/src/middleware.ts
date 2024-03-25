import { NextResponse } from "next/server";

export function middleware(request) {
  const { host } = request.nextUrl;
  if (!host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.hostname = `www.${host}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
