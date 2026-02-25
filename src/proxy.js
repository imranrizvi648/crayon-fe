import { NextResponse } from "next/server";

export function proxy(request) {
  const cookie = request.cookies.get("access_token");
  const token = cookie ? cookie.value : null;
  const { pathname } = request.nextUrl;

  // 1️⃣ Authentication Check
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      // 2️⃣ Decode token
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString("utf-8")
      );

      const userRole = payload?.roles?.[0]?.toUpperCase();
      const exp = payload?.exp;
      const now = Math.floor(Date.now() / 1000);

      // 3️⃣ Expired Token Check
      if (!exp || exp < now) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");
        return response;
      }

      // 🌟 NEW: Root Path (/) Instant Redirection Logic
      // Ye logic root page ke client-side redirect se hazar guna fast hai
      if (pathname === "/") {
        const roleRoutes = {
          ADMIN: "/dashboard/analytics",
          SALES_MANAGER: "/dashboard",
          SALES_USER: "/dashboard",
          FINANCE_ANALYST: "/finance",
          OPERATIONS_MANAGER: "/operations",
          SALES_LEAD: "/leads",
          EXECUTIVE: "/executive-summary"
        };

        const targetPath = roleRoutes[userRole] || "/dashboard/profile";
        return NextResponse.redirect(new URL(targetPath, request.url));
      }

      // 4️⃣ Roles Permissions (Baqi pages ki security ke liye)
      const ROLE_PERMISSIONS = {
        ADMIN: ["/"],
        SALES_MANAGER: ["/", "/dashboard", "/team-sheets", "/approval-que", "/report-and-analytic", "/user-management"],
        SALES_USER: ["/", "/sheets", "/dashboard", "/customers", "/products", "/workflow"],
        FINANCE_ANALYST: ["/", "/finance"],
        // Baqi roles ke allowed paths yahan add karein
      };

      const allowedPaths = ROLE_PERMISSIONS[userRole] || [];

      // 5️⃣ Admin bypass
      if (userRole === "ADMIN") {
        return NextResponse.next();
      }

      // 6️⃣ Role-based access check
      const isAllowed = allowedPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
      );

      if (!isAllowed) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|api|_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};