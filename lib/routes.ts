export const normalizedPathname = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

export const isPublicRoute = (path: string) => {
  const normalized = normalizedPathname(path);
  return normalized === "/auth" || normalized === "/register" || normalized === "/auth/callback";
};
