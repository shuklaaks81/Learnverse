
"use client";
import React from "react";

type NewsStory = {
  title: string;
  content: () => React.ReactNode;
};

const newsData: NewsStory[] = [
  {
    title: "BREAKING NEWS: President Bans Bananas!",
    content: () => (
      <>
        <span className="font-bold">Learnverse, Today —</span> In a shocking turn of events, the President of the Learnverse has <span className="underline">herbly banned bananas</span>!<br /><br />
        Today's weather: <span className="italic">Raining Bananas!</span> This has caused a major threat to the ice cream sundae industry. Mr. Ice Cream Sundae himself was quoted as saying, <span className="text-pink-700">“Ummm, I’m scared and stuff. What will be replaced by bananas... broccoli???”</span>
      </>
    ),
  },
  {
    title: "BREAKING NEWS UPDATE: Bananas Go to Court!",
    content: () => (
      <>
        After the banana ban, <span className="font-bold">scientists discovered bananas are actually radioactive!</span> Agents around the snack world are now thinking of building different artificial habitats due to the <span className="italic">raining bananas</span> crisis. <br /><br />
        <span className="font-semibold">More on this in next week's news!</span>
      </>
    ),
  },
  {
    title: "SCIENCE SHOCKER: Octopuses Invade Pipes!",
    content: () => (
      <>
        <span className="font-bold">Sick World, Labs —</span> Octopuses have been spotted sneaking into pipes all over the city! One even made it into a science lab and caused a <span className="text-red-600 font-bold">BIG BOOM!</span><br /><br />
        Scientists were amazed to discover these creatures have <span className="underline">three hearts</span>. Now, people are asking: <span className="italic">“Are octopuses from outer space???”</span>
      </>
    ),
  },
  {
    title: "MATH EMERGENCY: 1 Plus 1 Breakout!",
    content: () => (
      <>
        <span className="font-bold">Learnverse, Mathland —</span> Chaos erupted today when coders declared that 1 plus 1 equals <span className="text-blue-700 font-extrabold">11</span>, while non-coders insisted it equals <span className="text-green-700 font-extrabold">2</span>!<br /><br />
        The debate is so wild that people are thinking of bringing back <span className="underline">Albert Einstein</span> to solve this crisis once and for all!
      </>
    ),
  },
  {
    title: "Joke of the Day",
    content: () => <>Why did the student eat his homework? Because the teacher said it was a piece of cake!</>,
  },
  {
    title: "Fun Puzzle",
    content: () => <>What has keys but can't open locks? (A piano!)</>,
  },
];

export default function KidNewsPage() {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-2xl border-8 border-gray-800 rounded-none p-0 mt-8 font-serif print:bg-white print:shadow-none print:p-2 print:border-0">
      <div className="bg-gray-100 border-b-4 border-black py-4 px-6 flex flex-col items-center print:border-0">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-widest mb-1 text-center print:text-2xl uppercase">Learnverse Gazette</h1>
        <div className="mb-2 text-center text-gray-600 text-lg print:text-xs">{new Date().toLocaleDateString()}</div>
        <div className="w-full h-2 bg-gradient-to-r from-yellow-300 via-pink-200 to-blue-200 rounded-full mb-2 print:hidden" />
      </div>
      <div className="px-8 py-6 print:px-2 print:py-2">
        {newsData.map((item, idx) => (
          <div key={idx} className={`mb-8 print:mb-2 ${idx === 0 ? 'border-b-4 border-gray-700 pb-6 print:border-0 print:pb-1' : ''}`}>
            <h2 className={`text-3xl font-black text-gray-800 mb-2 print:text-lg uppercase ${idx === 0 ? 'tracking-wider' : ''}`}>{item.title}</h2>
            <div className="text-lg print:text-base leading-relaxed">{item.content()}</div>
          </div>
        ))}

        {/* Comic Strip */}
        <div className="my-10 print:my-2 border-t-2 border-b-2 border-gray-400 py-6 print:border-0 print:py-1">
          <h2 className="text-2xl font-bold text-center mb-4 print:text-base">Comic Corner</h2>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <div className="bg-yellow-100 border-2 border-gray-400 rounded p-2 w-32 h-24 flex flex-col justify-center items-center">
                <span className="text-3xl">🍌</span>
                <span className="text-xs mt-2">Banana: "I slipped up!"</span>
              </div>
              <div className="bg-blue-100 border-2 border-gray-400 rounded p-2 w-32 h-24 flex flex-col justify-center items-center">
                <span className="text-3xl">🦑</span>
                <span className="text-xs mt-2">Octopus: "Pipe dreams!"</span>
              </div>
              <div className="bg-pink-100 border-2 border-gray-400 rounded p-2 w-32 h-24 flex flex-col justify-center items-center">
                <span className="text-3xl">🍦</span>
                <span className="text-xs mt-2">Sundae: "I'm melting!"</span>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">(Draw your own comic in the box below!)</div>
            <div className="border-2 border-dashed border-gray-400 w-96 h-24 mt-2 bg-white print:hidden" />
          </div>
        </div>

        {/* Submit Your Own News */}
        <div className="my-10 print:my-2 border-t-2 border-gray-400 pt-6 print:border-0 print:pt-1">
          <h2 className="text-2xl font-bold text-center mb-2 print:text-base">Submit Your Own News!</h2>
          <p className="text-center text-gray-700 mb-4 print:text-xs">Have a funny story, wild fact, or cool drawing? Tell your teacher or parent to help you send it to the Learnverse Gazette!</p>
          <div className="flex flex-col items-center gap-2 print:hidden">
            <textarea
              className="w-80 h-20 border-2 border-gray-300 rounded p-2 mb-2"
              placeholder="Write your news, joke, or fact here! (Not submitted online)"
              disabled
            />
            <button className="bg-gray-400 text-white px-4 py-1 rounded cursor-not-allowed" disabled>
              Submit (Coming Soon)
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center py-4 print:hidden border-t-2 border-gray-300 bg-gray-50">
        <button
          onClick={() => window.print()}
          className="bg-gray-900 text-white px-8 py-2 rounded shadow hover:bg-gray-700 transition font-bold tracking-widest text-lg"
        >
          Print This Newspaper
        </button>
      </div>
    </div>
  );
}
