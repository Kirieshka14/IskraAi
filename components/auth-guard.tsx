"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

const isPublicRoute = (path: string) =>
  path === "/auth" || path === "/register" || path === "/auth/callback";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [validatedPath, setValidatedPath] = useState<string | null>(
    isPublicRoute(path) ? path : null,
  );
  const isPublic = isPublicRoute(path);
  const ready = isPublic || validatedPath === path;

  useEffect(() => {
    let active = true;
    if (isPublic) {
      setValidatedPath(path);
      return () => { active = false; };
    }

    // Hide every protected route again while its session is validated. This also
    // prevents a public-to-private client navigation from reusing stale state.
    setValidatedPath(null);
    apiRequest("/api/points")
      .then(() => { if (active) setValidatedPath(path); })
      .catch(() => {
        if (active) router.replace(`/auth?next=${encodeURIComponent(path)}`);
      });

    return () => { active = false; };
  }, [isPublic, path, router]);

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center" aria-busy="true">
        <p>Проверяем сессию…</p>
      </main>
    );
  }

  return <>{children}</>;
}
