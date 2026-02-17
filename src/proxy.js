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
        console.warn("[AUTH] Token expired");

        const response = NextResponse.redirect(
          new URL("/login", request.url)
        );

        response.cookies.delete("access_token");
        return response;
      }

      // 4️⃣ Roles Configuration
      const ROLE_PERMISSIONS = {
        ADMIN: ["/"],
        SALES_MANAGER: ["/", "/dashboard", "/sheets", "/sign", "/customers"],
        SALES_USER: ["/", "/sheets", "/dashboard", "/customers", "/products", "/workflow"],
        FINANCE: ["/", "/finance", "/reports", "/payments"],
        PRODUCTION: ["/", "/workflow", "/inventory", "/orders"],
        PROCUREMENT: ["/", "/vendors", "/purchase-orders"],
        HR: ["/", "/employees", "/attendance", "/payroll"],
      };

      const allowedPaths = ROLE_PERMISSIONS[userRole] || [];

      // 5️⃣ Admin bypass
      if (userRole === "ADMIN") {
        return NextResponse.next();
      }

      // 6️⃣ Role-based access check
      const isAllowed = allowedPaths.some(
        (path) =>
          pathname === path || pathname.startsWith(`${path}/`)
      );

      if (!isAllowed) {
        console.warn(
          `[SECURITY] Access Denied: Role [${userRole}] tried to access [${pathname}]`
        );

        return NextResponse.redirect(
          new URL("/unauthorized", request.url)
        );
      }
    } catch (error) {
      console.error("[AUTH] Invalid token", error);

      const response = NextResponse.redirect(
        new URL("/login", request.url)
      );

      response.cookies.delete("access_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
