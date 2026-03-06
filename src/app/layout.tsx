import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ocean.css";
import ClientOceanSoundsWrapper from "./ClientOceanSoundsWrapper";
import { SecretEventProvider } from "./SecretEventProvider";
import LoadingWrapper from "./LoadingWrapper";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import HolidayBlocker from "@/components/HolidayBlocker";
import { Analytics } from '@vercel/analytics/react';
import ConditionalOceanBg from "./ConditionalOceanBg";
import MigrationWrapper from "./MigrationWrapper";

import VersionLayoutClient from "./VersionLayoutClient";

export const metadata: Metadata = {
  title: "Learnverse - Fun Learning App for Kids | Educational Games & Lessons",
  description: "Learnverse is an interactive learning platform for kids with educational games, lessons, achievements, and fun animations. Learn math, science, reading and more! Perfect for children ages 6-12.",
  keywords: "learning app for kids, educational games, kids learning platform, interactive lessons, educational app, fun learning, kids education, homework help, study app for children",
  authors: [{ name: "Learnverse Team" }],
  openGraph: {
    title: "Learnverse - Fun Learning App for Kids",
    description: "Interactive learning platform with games, lessons, and achievements for kids!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learnverse - Fun Learning App for Kids",
    description: "Interactive learning platform with games, lessons, and achievements!",
  },
  manifest: "/manifest.json",
  verification: {
    google: "kkwMXkR9OHkcPq5sGveqsGx9YFngdxfgxum6XrNGlfE",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Learnverse",
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
        <MigrationWrapper>
          <LoadingWrapper>
            <SecretEventProvider>
              {/* Ocean background - only shows in non-premium mode */}
              <ConditionalOceanBg />
              {/* OceanSounds must be rendered in a client component */}
              <ClientOceanSoundsWrapper />
              <PWAInstallPrompt />
              {/* <HolidayBlocker /> */}
              <VersionLayoutClient>{children}</VersionLayoutClient>
              <Analytics />
            </SecretEventProvider>
          </LoadingWrapper>
        </MigrationWrapper>
      </body>
    </html>
  );
}
