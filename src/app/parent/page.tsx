/**
 * Parent Account Entry Page
 * 
 * Simple redirect page that automatically routes parent accounts to the login screen.
 * Displays a loading message while the redirect happens.
 */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ParentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push("/parent/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <p className="text-white text-2xl font-bold">Redirecting to login... ✨</p>
    </div>
  );
}
