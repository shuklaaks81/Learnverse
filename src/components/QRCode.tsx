"use client";
import { useEffect, useRef } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
}

export default function QRCode({ value, size = 180 }: QRCodeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Dynamically import qrcode library (no SSR)
    import("qrcode").then(QR => {
      QR.toCanvas(ref.current!.firstChild as HTMLCanvasElement, value, {
        width: size,
        margin: 2,
      });
    });
  }, [value, size]);

  return (
    <div ref={ref} style={{ width: size, height: size, display: "inline-block" }}>
      <canvas width={size} height={size} />
    </div>
  );
}
