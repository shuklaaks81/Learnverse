"use client";
import OceanSounds from "../components/OceanSounds";
import { usePathname } from "next/navigation";

export default function ClientOceanSoundsWrapper() {
  const pathname = usePathname();
  
  // 🚀 PERFORMANCE: Skip ocean sounds on login/landing pages
  const isLightPage = pathname === '/' || 
                       pathname?.includes('/login') || 
                       pathname?.includes('/welcome') ||
                       pathname?.includes('/kid-selector');

  if (isLightPage) {
    return null; // No ocean sounds on login pages
  }

  return <OceanSounds />;
}
