

"use client";
import React, { useState, useEffect } from "react";
import VersionSelectModal from "./VersionSelectModal";

export default function VersionLayoutClient({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const v = localStorage.getItem("learnverseVersion");
      setVersion(v);
      setReady(true);
      if (v === "premium") {
        document.body.classList.add("premium");
      } else {
        document.body.classList.remove("premium");
      }
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (typeof window !== "undefined") {
      if (version === "premium") {
        document.body.classList.add("premium");
      } else {
        document.body.classList.remove("premium");
      }
    }
  }, [version, ready]);

  if (!ready || !version) {
    return <VersionSelectModal onSelect={setVersion} />;
  }
  return <>{children}</>;
}
