import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Authentication Check
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Token decode (Edge Compatible)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload?.roles?.[0]?.toUpperCase(); 

      // 2. Roles Configuration (Whitelisting)
      // Har role ke liye sirf allowed paths yahan define karein
      const ROLE_PERMISSIONS = {
        'ADMIN': ['/'], // Admin has access to everything via logic below
        'SALES_MANAGER': ['/', '/dashboard', '/sheets', '/sign', '/customers'],
        'SALES_USER': ['/', '/sheets', '/dashboard', '/customers', '/products'],
        'FINANCE': ['/', '/finance', '/reports', '/payments'],
        'PRODUCTION': ['/', '/workflow', '/inventory', '/orders'],
        'PROCUREMENT': ['/', '/vendors', '/purchase-orders'],
        'HR': ['/', '/employees', '/attendance', '/payroll']
      };

      // 3. Validation Logic
      const allowedPaths = ROLE_PERMISSIONS[userRole] || [];

      // ADMIN bypass logic (Admin ko har jagah jane dein)
      if (userRole === 'ADMIN') {
        return NextResponse.next();
      }

      // Baki roles ke liye check karein
      const isAllowed = allowedPaths.some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
      );

      if (!isAllowed) {
        // Restricted access logs
        console.warn(`[SECURITY] Access Denied: Role [${userRole}] tried to access [${pathname}]`);
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};