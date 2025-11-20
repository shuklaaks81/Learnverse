"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KidPage() {
  const router = useRouter();

  // Redirect to new onboarding flow
  useEffect(() => {
    router.push("/kid/welcome");
  }, [router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
      <p className="text-3xl text-white font-bold">Redirecting to sign up... ✨</p>
    </div>
  );
}
