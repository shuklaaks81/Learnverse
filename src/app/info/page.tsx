"use client";
import Link from "next/link";
import { useState } from "react";

const base = "https://learnverse-delta.vercel.app";
const features = [
  {
    title: "Kid & Parent Accounts",
    desc: "Switch between kid and parent accounts anytime. Parents can track progress, kids can learn and play!",
    img: "/icon-192.png.svg",
    link: base + "/"
  },
  {
    title: "Lessons & Challenges",
    desc: "40+ lessons and 7,500+ slides in math, science, geography, and more. Daily challenges keep learning fun!",
    img: "/icon-192.png.svg",
    link: base + "/kid/lessons"
  },
  {
    title: "Ocean Theme & Sounds",
    desc: "Animated ocean wallpaper and relaxing wave sounds on every page.",
    img: "/icon-192.png.svg",
    link: base + "/"
  },
  {
    title: "Shop & Unlockables",
    desc: "Earn coins, unlock buddy styles, backgrounds, accessories, power-ups, and secret items!",
    img: "/icon-192.png.svg",
    link: base + "/kid/shop"
  },
  {
    title: "Progress & Achievements",
    desc: "Track your learning, keep streaks, and earn achievements.",
    img: "/icon-192.png.svg",
    link: base + "/kid/achievements"
  },
  {
    title: "Parent Dashboard",
    desc: "See updates, changelogs, and manage your child’s learning.",
    img: "/icon-192.png.svg",
    link: base + "/parent/dashboard"
  },
  {
    title: "Easy Sharing",
    desc: "Open the app with a QR code, TinyURL, or Add to Home.",
    img: "/icon-192.png.svg",
    link: base + "/open"
  },
  {
    title: "Secret Pages",
    desc: "Find /open, /info, /secrets, /owner, and more! Hidden features await!",
    img: "/icon-192.png.svg",
    link: base + "/secrets"
  }
];

export default function InfoPage() {
  const [search, setSearch] = useState("");
  const filtered = features.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.desc.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-200 to-blue-500 text-blue-900 p-6">
      <div className="w-full max-w-3xl">
        {/* Search Bar */}
        <div className="flex items-center mb-8 mt-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search about Learnverse..."
            className="flex-1 px-5 py-3 rounded-l-xl border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow"
          />
          <span className="px-4 py-3 bg-blue-400 text-white rounded-r-xl font-bold text-lg">🔍</span>
        </div>
        {/* Info Cards */}
        <div className="flex flex-col gap-6">
          {filtered.map((f, i) => (
            <a
              key={i}
              href={f.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col md:flex-row items-center bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:bg-blue-50 hover:shadow-2xl transition-all cursor-pointer"
            >
              <img src={f.img} alt={f.title} className="w-24 h-24 mb-4 md:mb-0 md:mr-8 rounded-xl border-2 border-blue-300 bg-blue-100" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{f.title}</h2>
                <p className="text-lg text-blue-800 mb-1">{f.desc}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
