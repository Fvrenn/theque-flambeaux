"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SSERefresh() {
  const router = useRouter();

  useEffect(() => {
    const source = new EventSource("/api/live-events");

    source.addEventListener("matchUpdated", () => {
      router.refresh();
    });

    return () => source.close();
  }, [router]);

  return null;
}
