import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ocean.css";
import ClientOceanSoundsWrapper from "./ClientOceanSoundsWrapper";

export const metadata: Metadata = {
  title: "Learning App",
  description: "A learning app with parent-kid account system",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Learning App",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="ocean-bg">
          {/* Ripples */}
          <div className="ripple" style={{top: '20%', left: '30%', width: 120, height: 120, animationDelay: '0s'}}></div>
          <div className="ripple" style={{top: '60%', left: '60%', width: 180, height: 180, animationDelay: '1.5s'}}></div>
          <div className="ripple" style={{top: '40%', left: '70%', width: 90, height: 90, animationDelay: '2.5s'}}></div>
          <div className="ripple" style={{top: '75%', left: '20%', width: 150, height: 150, animationDelay: '3s'}}></div>
        </div>
        {/* OceanSounds must be rendered in a client component */}
        <ClientOceanSoundsWrapper />
        {children}
      </body>
    </html>
  );
}
