import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/audit',
  '/results/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/audit(.*)',
])

export function proxy(...args: Parameters<typeof clerkMiddleware>) {
  return clerkMiddleware((auth, request) => {
    if (!isPublicRoute(request)) {
      auth.protect()
    }
  })(...args)
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
