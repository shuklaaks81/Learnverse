"use client";

import { useEffect, useState } from "react";

export default function OpenPage() {
  const [origin, setOrigin] = useState("");
  const [qrSrc, setQrSrc] = useState("");
  const [tinyUrl, setTinyUrl] = useState("");
  const [loadingTiny, setLoadingTiny] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const o = window.location.origin;
      setOrigin(o);
      setQrSrc(
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          o
        )}`
      );
    }
  }, []);

  const generateTiny = async () => {
    if (!origin) return;
    setLoadingTiny(true);
    try {
      const res = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(origin)}`
      );
      const txt = await res.text();
      setTinyUrl(txt);
    } catch (e) {
      setTinyUrl("Failed to create short link");
    } finally {
      setLoadingTiny(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-6">
      <div className="max-w-xl w-full bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 border-4 border-white/50 text-center">
        <div className="flex items-center justify-center mb-4">
          <Image src="/icon-192.png.svg" alt="Learnverse logo" className="w-16 h-16 mr-3" width={64} height={64} />
          <h1 className="text-2xl sm:text-3xl font-bold">Open Learnverse</h1>
        </div>

        <p className="text-sm text-gray-700 mb-6">Open the app on another device quickly:</p>

        <Link
          href="/"
          className="inline-block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-bold text-lg shadow-lg mb-6 hover:scale-105 transition-all"
        >
          Open Learnverse →
        </Link>

        {qrSrc && (
          <div className="mb-6">
            <Image src={qrSrc} alt="QR to open site" className="mx-auto rounded-lg border" width={300} height={300} />
            <p className="text-xs text-gray-500 mt-2">Scan this QR with your phone camera</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              readOnly
              value={tinyUrl || origin}
              className="flex-1 bg-gray-100 px-3 py-2 rounded-lg text-sm"
            />
            <button
              onClick={() => {
                if (tinyUrl) copyToClipboard(tinyUrl);
                else copyToClipboard(origin);
              }}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={generateTiny}
              disabled={loadingTiny}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold"
            >
              {loadingTiny ? "Generating..." : "Create TinyURL"}
            </button>
            <a
              href={tinyUrl || origin}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium"
            >
              Open Link
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
