"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MaintenancePage() {
  const router = useRouter();

  useEffect(() => {
    // Instant redirect to kid page
    router.replace("/kid");
  }, [router]);

  return null;
}