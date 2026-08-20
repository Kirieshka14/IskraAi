export const normalizedPathname = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

const PUBLIC_ROUTES = new Set([
  "/auth",
  "/register",
  "/auth/callback",
  "/privacy",
  "/legal",
]);

export const isPublicRoute = (path: string) =>
  PUBLIC_ROUTES.has(normalizedPathname(path));
