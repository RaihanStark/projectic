import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = (pathname: string) => {
  return pathname.includes('/dashboard') || pathname.includes('/user-profile');
};

const isAuthPage = (pathname: string) => {
  return pathname.includes('/sign-in') || pathname.includes('/sign-up');
};

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle auth routes
  if (isProtectedRoute(pathname)) {
    // Check for auth cookie
    const authToken = request.cookies.get('auth-token');

    if (!authToken) {
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // If user has auth token and tries to access auth pages, redirect to dashboard
  if (isAuthPage(pathname)) {
    const authToken = request.cookies.get('auth-token');

    if (authToken) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
