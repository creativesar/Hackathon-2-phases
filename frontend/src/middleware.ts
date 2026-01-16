import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next", "_vercel" and all files with an extension (image files)
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/',
  ]
};
