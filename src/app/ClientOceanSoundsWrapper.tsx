"use client";
import dynamic from "next/dynamic";
const OceanSounds = dynamic(() => import("../components/OceanSounds"), { ssr: false });
export default function ClientOceanSoundsWrapper() {
  return <OceanSounds />;
}
