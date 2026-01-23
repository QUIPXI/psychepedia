import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except:
    // - API routes
    // - Static files
    // - Internal Next.js paths
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
