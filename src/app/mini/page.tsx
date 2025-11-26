"use client";
import React, { useState } from "react";

const lessons = [
  { title: "Welcome!", slides: ["Welcome to Mini Learnverse!", "This is a lightweight backup app.", "Enjoy simple lessons and a tiny shop!"] },
  { title: "The Ocean", slides: ["Oceans cover 71% of Earth.", "They are home to amazing creatures!", "Protect our oceans!"] },
  { title: "Space", slides: ["Space is vast and mysterious.", "The sun is a star.", "There are 8 planets in our solar system."] },
  { title: "Plants", slides: ["Plants make oxygen.", "They need sunlight, water, and soil.", "Trees are the biggest plants!"] },
  { title: "Animals", slides: ["Animals live everywhere.", "Some fly, some swim, some run!", "Be kind to animals."] },
  { title: "Math Fun", slides: ["2 + 2 = 4", "Multiplication is repeated addition.", "Math is everywhere!"] },
  { title: "Weather", slides: ["Rain, sun, snow, and wind.", "Weather changes every day.", "Always check the forecast!"] },
  { title: "Healthy Habits", slides: ["Wash your hands.", "Eat fruits and veggies.", "Get plenty of sleep!"] },
  { title: "Art & Creativity", slides: ["Draw, paint, and create!", "Art is for everyone.", "Express yourself!"] },
  { title: "Kindness", slides: ["Say please and thank you.", "Help others.", "A smile can make someone's day!"] },
];

const shopItems = [
  { name: "Sticker Pack", price: 10 },
  { name: "Fun Avatar", price: 25 },
  { name: "Rainbow Theme", price: 50 },
];

export default function MiniApp() {
  const [lessonIdx, setLessonIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [coins, setCoins] = useState(() => Number(localStorage.getItem("miniCoins") || 20));
  const [owned, setOwned] = useState(() => JSON.parse(localStorage.getItem("miniOwned") || "[]"));
  const [error, setError] = useState("");

  // Save coins/owned to localStorage
  React.useEffect(() => {
    localStorage.setItem("miniCoins", coins.toString());
    localStorage.setItem("miniOwned", JSON.stringify(owned));
  }, [coins, owned]);

  // Error boundary (simple)
  React.useEffect(() => {
    window.onerror = () => {
      setError("Oops! Something went wrong. Please reload the mini app.");
      return true;
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Mini App Error</h1>
        <p className="mb-4">{error}</p>
        <button className="bg-blue-500 px-4 py-2 rounded" onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  const lesson = lessons[lessonIdx];
  const slide = lesson.slides[slideIdx];

  function nextSlide() {
    if (slideIdx < lesson.slides.length - 1) setSlideIdx(slideIdx + 1);
    else if (lessonIdx < lessons.length - 1) {
      setLessonIdx(lessonIdx + 1);
      setSlideIdx(0);
    }
  }
  function prevSlide() {
    if (slideIdx > 0) setSlideIdx(slideIdx - 1);
    else if (lessonIdx > 0) {
      setLessonIdx(lessonIdx - 1);
      setSlideIdx(lessons[lessonIdx - 1].slides.length - 1);
    }
  }
  function buy(item: { name: string; price: number }) {
    if (owned.includes(item.name)) return;
    if (coins >= item.price) {
      setCoins(coins - item.price);
      setOwned([...owned, item.name]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 mb-8">
        <h1 className="text-2xl font-bold mb-2 text-blue-700">Mini Learnverse</h1>
        <div className="mb-4">
          <div className="text-lg font-semibold text-gray-700">Lesson: {lesson.title}</div>
          <div className="text-gray-600 mb-2">{slide}</div>
          <div className="flex gap-2">
            <button onClick={prevSlide} disabled={lessonIdx === 0 && slideIdx === 0} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
            <button onClick={nextSlide} disabled={lessonIdx === lessons.length - 1 && slideIdx === lesson.slides.length - 1} className="px-3 py-1 bg-blue-300 rounded disabled:opacity-50">Next</button>
          </div>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-green-700">Coins: {coins}</div>
        </div>
        <div>
          <div className="font-bold mb-2">Mini Shop</div>
          <div className="flex flex-col gap-2">
            {shopItems.map((item) => (
              <button
                key={item.name}
                disabled={owned.includes(item.name) || coins < item.price}
                onClick={() => buy(item)}
                className={`flex justify-between items-center px-4 py-2 rounded border ${owned.includes(item.name) ? 'bg-gray-300' : 'bg-yellow-100'} disabled:opacity-50`}
              >
                <span>{item.name}</span>
                <span>{owned.includes(item.name) ? 'Owned' : `${item.price} coins`}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500">Offline backup mode. No login required. Minimal features for reliability.</div>
    </div>
  );
}
