export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/profile/:path*', '/watch/:path*', '/admin/:path*']
};
