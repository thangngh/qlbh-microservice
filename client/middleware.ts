import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';

const intlMiddleware = createMiddleware({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default async function middleware(request: NextRequest) {
  // Run i18n middleware first
  const response = intlMiddleware(request);

  // Get session for authentication
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Check if accessing protected routes
  const isProtectedRoute = pathname.includes('/(dashboard)') || pathname.includes('/dashboard');

  if (isProtectedRoute && !session) {
    // Redirect to sign in if not authenticated
    const locale = pathname.split('/')[1]; // Extract locale
    const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Forward session token to API requests
  if (session?.accessToken) {
    response.cookies.set('access-token', session.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
