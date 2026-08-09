"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppSkeleton } from "@/components/app-skeleton";
import { clearCachedSession, hasCachedSession, validateSession } from "@/lib/session";

import { isPublicRoute } from "@/lib/routes";
type GateState = "checking-local" | "validating" | "valid";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const isPublic = isPublicRoute(path);
  const [state, setState] = useState<GateState>(isPublic ? "valid" : "checking-local");

  useEffect(() => {
    let current = true;
    if (isPublic) { setState("valid"); return () => { current = false; }; }

    // The hint only chooses immediate UI. Protected children remain unmounted
    // until the server confirms the HttpOnly-cookie-backed session.
    if (!hasCachedSession()) {
      router.replace(`/auth?next=${encodeURIComponent(path)}`);
      return () => { current = false; };
    }

    setState("validating");
    validateSession().then((result) => {
      if (!current) return;
      if (result === "valid") setState("valid");
      else {
        clearCachedSession();
        router.replace(`/auth?next=${encodeURIComponent(path)}`);
      }
    }).catch(() => {
      if (!current) return;
      clearCachedSession();
      router.replace(`/auth?next=${encodeURIComponent(path)}`);
    });

    return () => { current = false; };
  }, [isPublic, path, router]);

  if (isPublic || state === "valid") return <>{children}</>;
  return <AppSkeleton />;
}
