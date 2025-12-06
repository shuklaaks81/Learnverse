"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const corruptedText = [
  "█▓░ S̴̢͝E̵̛͢C̴҉R̴͟E̷̢T̵̨Ş̴͝ ░▓█",
  "E̴̢͝R̵̛͢R̴҉O̴͟R̷̢:̵̨ ̴̧͝D̸̢Ą̸T̸̢A̸ ̴C̸O̸R̸R̸U̸P̸T̸E̸D̸!̸",
  "C̴̢͝A̵̛͢N̴҉N̴͟O̷̢T̵̨ ̴̧͝D̸̢I̸S̸P̸L̸A̸Y̸ ̴S̸E̸C̸R̸E̸T̸S̸...",
  "█▓░ U̴̢͝N̵̛͢S̴҉A̴͟F̷̢Ę̵ ̴̧͝T̸O̸ ̸V̸I̸E̸W̸ ░▓█",
  "█▓░ D̴̢͝Ơ̵͢ ̴N̴O̴T̴ ̴P̴R̴O̴C̴E̴E̴D̴ ░▓█"
];

export default function SecretsPage() {
  const [showSecrets, setShowSecrets] = useState(false);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-lime-400 p-6">
      <div className="max-w-xl w-full bg-black bg-opacity-80 rounded-2xl shadow-2xl p-8 flex flex-col items-center border-4 border-red-700">
        <h1 className="text-4xl font-bold mb-4 text-red-500 animate-pulse">❌ ERROR: This info is broken</h1>
        <p className="mb-6 text-center text-red-300 text-lg">Unsafe to see. Proceed at your own risk!</p>
        {!showSecrets ? (
          <button
            onClick={() => setShowSecrets(true)}
            className="px-6 py-2 bg-red-700 text-white rounded-lg font-bold shadow hover:bg-red-900 mb-4 animate-pulse"
          >
            SEE ANYWAY
          </button>
        ) : (
          <div className="w-full flex flex-col items-center">
            {corruptedText.map((line, i) => (
              <div key={i} className="text-2xl font-mono mb-2 animate-pulse" style={{letterSpacing: 2}}>{line}</div>
            ))}
            <Image src="/icon-192.png.svg" alt="Secret Icon" className="w-24 h-24 my-6" width={96} height={96} />
          </div>
        )}
        <Link href="/" className="mt-6 px-6 py-2 bg-gray-700 text-white rounded-lg font-bold shadow hover:bg-gray-900">Back to Home</Link>
      </div>
    </main>
  );
}
