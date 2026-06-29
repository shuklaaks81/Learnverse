"use client";

import { useState, useEffect } from "react";

type CheckStatus = "pending" | "success" | "error";
type LoadingCheck = {
  name: string;
  status: CheckStatus;
  message?: string;
};

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const [showBuddy, setShowBuddy] = useState(false);
  const [text, setText] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadingStartedAt] = useState(() => Date.now());
  const [checks, setChecks] = useState<LoadingCheck[]>([]);
  const [currentCheck, setCurrentCheck] = useState(0);
  const [funnyMode, setFunnyMode] = useState(false);
  const [stars, setStars] = useState<Array<{width: number; height: number; top: number; left: number; delay: number; duration: number}>>([]);

  const words = ["Learn", "Explore", "Discover", "Create", "Play"];

  const epicMessages = [
    "did you know 1+1 = 2? i know supprizing right?",
    "why do kids just play minecraft but just throw me away in the corner of shame",
    "fun fact: its impossible to load the app in under 3 seconds because its in the code for it to wait 3 seconds?",
    "yeah idk what to do now",
    "dang it an error.. dont tell anyone im using google to solve it",
    "loading the loading screen",
    "theres secrets in this app... look at bob the bana for instense click on him!",
    "did you know theres a answer for all the problems out there? its idk",
    "did you know 1+1 is NOT 1234567890 i know suprizing",
    "loading... and mabye plaing games",
    "quick question did you eat a bannana?",
    "BOOOOOOOOOOOOnana is yum",
    "teachers say we cant use ai for questions... then why do they use it?",
    "teachers say HERES HOMEWORK!!! bro i need to sleep and get rest not write a whole essay",
    "if your sad, just be happy if your bad be good",
    "why to parents complain when we spend an hour playing games but dont when we learn for an hour ON THE PC",
    "homework a wonder invention... to throw away in the corner of shame",
    "wait homework!!?!?!?! 2+2 hmm ALEXA WHATS 2+2????",
    "why do we have to learn math its not like a sign is gonna say FIND THE ANSWER TO 1234X12345 TO THE POWER OF 4 PLUS GOOGLE IN SCIENTICIF TERMS TO KNOW THE SPEED LIMIT",
    "ok history who invented homework... Roberto Nevilis did? hmmmmmm this is Roberto Nevilis what do you want? WHERE DO YOU LIVE???? ooga booga street in south pooprica house number 9 why? ima send the law of kids over there",
    "the law of kids herbly says kids should play video games and have mac and cheese and HOMEWORK IS BANNED valid by the USA kids department printed by fake laws .com",
    "whats 1 +1???????????? 3!!!!!!!!!! your banned",
    "THE CORNER OF SHAMEEEEEEE THE CORNER OF SHAMMMMMMMEEEEEEE",
    "2 year old vs epic buff guy who can lift the moon who will win OHH THE 2 YEAR OLD USES THE ULTIAMTE ATTACK THE MOM ATTACK AND THE DADDY ATTACK and seems like the 2 year old wins!!!",
    "devs work so hard you know? but when you look at it a 4 year old can littelry make an app cuz they use ai",
    "you know that feeling when you at the perfect place but your game cra- wait why are we talking about games?",
    "hmmmmm why is it illiglel to use a ipad for gaming but not for learning like bruhhhhh",
    "ka boom",
    "remember the ka boom message? this is part 2 ka boom wait aint that my house?!?!?!?!!? and pepole are inside?!?!?!!?! oh wait they have pizza its fine",
    "games the wirlds best invention learning games the mediem invention school the worst invention homework wheres the water?",
    "BOB IS SO MEAN!!!!!! oh wait i ate him",
    "the bannana logo looks a bit werird and somehow the owner likes it?!?!?!",
    "3 2 1 GOOOOOOO HOMEWORK TAKES THE LEAD WHILE SCHOOL IS CATHING UP AND BOOOOOM HOMEWORK AND SCHOOL GO RIGHT INTO THE TRASHCANNNNNNNN",
    "when pepole say your grounded you should thank them cuz YAY NO HOMEWORK!!!!! but do nothing? now thats a good reason to be bad",
    "books have a buncha knoege... so lets eat the book to be smart",
    "pizza rolls at 3am hit different when your dodging homework",
    "teacher: why didnt you do homework? me: why didnt YOU give me vbucks?",
    "gorillas in bloxd scary until you remember YOU HAVE TNT MUAHAHAHA",
    "mom said 5 more minutes... that was 5 hours ago she forgot 😎",
    "school be like: heres 7 subjects. youtube be like: heres how to build a rocket in minecraft",
    "homework folder? more like HOMEWORKNT folder cuz its EMPTY",
    "water break! oh wait this is loading not gym class my bad",
    "bob's eating the loading bar sorry its taking longer",
    "fun fact: 83% of statistics are made up including this one",
    "if homework was a boss battle id rage quit",
    "teacher logic: gives 5 pages of homework expects it done in 5 minutes",
    "me: can we have roblox? mom: we have roblox at home. roblox at home: *math homework*",
    "BREAKING NEWS: local kid discovers homework is optional if you believe hard enough",
    "parent paradox: tv rots brain but reading is good?? THEYRE BOTH SCREENS",
    "bob just told me a joke... i cant repeat it its too banana",
    "homework deadline approaching faster than my motivation",
    "sleep schedule? never heard of her",
    "teacher: show your work. me: *shows calculator* teacher: 😡",
    "why do they call it homework when you do it at 3am in bed?",
    "bob's philosophy: if its yellow and curved, its either a banana or a smile... or both",
    "URGENT: this message will self destruct in 3... 2... jk it already did",
    "homework really said 'ima ruin this kids whole career'",
    "parents when you game: 😡 parents when you watch educational youtube: 😊 ITS THE SAME THING",
    "bob tried to teach me fractions but he kept eating the pizza example",
    "school: mitochondria is the powerhouse. me: WHEN WILL I USE THIS AT TACO BELL",
    "loading so hard right now the loading bar needs its own loading bar",
    "teacher: no food in class. teacher: *drinks coffee* me: 🤨",
    "homework is just school cyberbullying you at home",
    "bob says if you rearrange the letters in 'homework' you get 'me do work oh' which is facts",
    "parent logic: pause your online game. me: MOM ITS MULTIPLAYER",
    "the corner of shame is getting crowded with all this homework",
    "AI doing my coding? nah fam AI doing my EVERYTHING",
    "why is bedtime 9pm but adults stay up till 2am watching netflix EXPLAIN",
    "bob fell in the ocean... hes swimming in banana splits now",
    "homework stack so high it reached bob's dimension",
    "teacher said cite your sources so i cited wikipedia 47 times",
    "fun detected. homework deployed. fun eliminated.",
    "parents: money doesnt grow on trees. minecraft: observe",
    "bob tried counting to infinity but got distracted by banana bread",
    "school speed run any% glitchless (impossible)",
    "REALITY CHECK: you could be eating pizza rn but nooooo theres LOADING",
    "homework folder is just the recycle bin with extra steps",
    "bob's law of physics: what goes up must come down unless its my grades",
    "teacher: wikipedia isnt reliable. also teacher: *googles everything*",
    "why they call it 'social studies' when we just stare at textbooks alone?",
    "bob discovered time travel! he went forward to skip all his homework",
    "loading message #62 has left the chat",
    "homework: exists. my brain: aight imma head out",
    "teacher gave homework over break... OVER BREAK?!?! THATS ILLEGAL",
    "bob says learning is cool but have you tried NOT learning? revolutionary",
    "parent: go play outside. me: *plays pokemon go* parent: NOT LIKE THAT",
    "homework really thought it could stop me... IT CANT IM ILLITERATE",
    "the ocean waves in the background are judging your life choices",
    "nice",
    "SHUSH! dont tell anyone type /blocky in your url it prob wont work tho but you might wanna type other stuff too",
    "POV i wanna eat stuff *eats bob*",
    "homework percentage: 0% done, 100% stressed, 200% confused",
    "bob tried making a tiktok but ended up solving world hunger instead",
    "school be like: heres ancient egypt. me be like: WHERES ANCIENT PIZZA",
    "loading faster than my dad coming back with the milk",
    "homework said 'do me' and i said 'pass'",
    "bob's motivational quote: if at first you dont succeed, blame lag",
    "parent: clean your room. me: mom its called ORGANIZED CHAOS",
    "teacher: no phones. also teacher: *texts during class*",
    "homework killed my vibe, my will to live, AND my minecraft dog",
    "bob opened a fortune cookie it said 'do your homework' he ate the fortune",
    "why is school free but lunch costs money? SCHOOL LUNCH DLC",
    "loading screen is just adult timeout change my mind",
    "homework really needs a difficulty setting like BRUH",
    "bob says if life gives you lemons, trade them for bananas",
    "teacher: be creative! also teacher: follow these exact 47 rules",
    "homework exists in a quantum state: both done and not done until teacher checks",
    "parent: pause the game. me: ITS AN ONLINE MATCH. parent: I DONT CARE",
    "bob tried yoga but just turned into a banana peel",
    "school: prepares you for life. also school: *teaches mitochondria* me: ???",
    "loading faster than my motivation on monday morning",
    "homework folder go brrrrrrrrr into the trash",
    "bob discovered the meaning of life: its banana",
    "teacher said show your work so i showed up thats work right?",
    "parent: video games cause violence. also parent: *yells at tv during football*",
    "homework deadline extensions should be a HUMAN RIGHT",
    "bob tried being serious once... once.",
    "why do they call it a restroom when youre literally doing WORK in the STALL",
    "loading message #99 is having an existential crisis",
    "🎉 CONGRATS YOU READ ALL 100 MESSAGES YOU DESERVE A MEDAL OR THERAPY 🎉"
  ];

  // Generate stars only on client side
  useEffect(() => {
    const generatedStars = [...Array(50)].map(() => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2
    }));
    setStars(generatedStars);
  }, []);

  // Real system checks
  const systemChecks = [
    { name: "Checking local storage", test: () => typeof localStorage !== "undefined" },
    { name: "Loading user accounts", test: () => {
      try {
        const accounts = localStorage.getItem('kidAccounts');
        return true;
      } catch {
        return false;
      }
    }},
    { name: "Finding last account", test: () => {
      try {
        const lastAccount = localStorage.getItem('lastKidAccount');
        if (lastAccount) {
          setChecks(prev => prev.map((c, i) => 
            i === currentCheck ? { ...c, message: `Found: ${lastAccount}` } : c
          ));
        }
        return true;
      } catch {
        return false;
      }
    }},
    { name: "Checking if app is awake", test: () => true },
    { name: "Checking app features", test: () => true },
    { name: "Loading Lab components", test: () => true },
    { name: "Verifying game engine", test: () => true },
    { name: "Loading lesson data", test: () => true },
    { name: "Checking achievements", test: () => {
      try {
        localStorage.getItem('achievements');
        return true;
      } catch {
        return false;
      }
    }},
    { name: "Initializing sound system", test: () => true },
    { name: "Ready to learn! 🚀", test: () => true }
  ];

  const funnyChecks = [
    { name: "Teaching hamsters to code", test: () => true },
    { name: "Counting to infinity", test: () => true },
    { name: "This is really boring", test: () => true },
    { name: "I won't even show it", test: () => true },
    { name: "Just kidding! Loading for real now...", test: () => true },
    { name: "Actually checking stuff", test: () => true },
    { name: "Finding your account", test: () => true },
    { name: "Almost there...", test: () => true },
    { name: "Ready! 🎉", test: () => true }
  ];

  useEffect(() => {
    // Random chance for funny mode
    const useFunnyMode = Math.random() < 0.1; // 10% chance
    setFunnyMode(useFunnyMode);

    // Stage 0-4: Show words swooshing in
    if (stage < 5) {
      const timer = setTimeout(() => {
        setStage(stage + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
    
    // Stage 5: Show buddy writing
    if (stage === 5) {
      setShowBuddy(true);
      const timer = setTimeout(() => setStage(6), 500);
      return () => clearTimeout(timer);
    }

    // Stage 6: Buddy writes "Learnverse"
    if (stage === 6) {
      const fullText = "Learnverse";
      let i = 0;
      const interval = setInterval(() => {
        if (i <= fullText.length) {
          setText(fullText.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
          setStage(7);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    // Stage 7: Run system checks
    if (stage === 7) {
      const checksToRun = useFunnyMode ? funnyChecks : systemChecks;
      
      let checkIndex = 0;
      const runCheck = () => {
        if (checkIndex >= checksToRun.length) {
          const elapsed = Date.now() - loadingStartedAt;
          const minimumDisplayTime = 3000;
          const remaining = Math.max(0, minimumDisplayTime - elapsed);
          setTimeout(() => onComplete(), remaining + 800);
          return;
        }

        const check = checksToRun[checkIndex];
        setCurrentCheck(checkIndex);
        
        // Add check as pending
        setChecks(prev => [...prev, { name: check.name, status: "pending" }]);

        // Run the test after a delay
        setTimeout(() => {
          try {
            const result = check.test();
            setChecks(prev => prev.map((c, i) => 
              i === checkIndex 
                ? { ...c, status: result ? "success" : "error", message: result ? c.message : "Failed to load" }
                : c
            ));
          } catch (error) {
            setChecks(prev => prev.map((c, i) => 
              i === checkIndex 
                ? { ...c, status: "error", message: error instanceof Error ? error.message : "Unknown error" }
                : c
            ));
          }
          
          checkIndex++;
          setTimeout(runCheck, 300);
        }, 200);
      };

      runCheck();
    }
  }, [stage, onComplete, funnyMode, loadingStartedAt]);

  useEffect(() => {
    if (stage < 6) {
      return;
    }

    const messageInterval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % epicMessages.length);
    }, 1800);

    return () => clearInterval(messageInterval);
  }, [stage, epicMessages.length]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black overflow-hidden">
      {/* Animated stars/galaxy background */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              width: star.width + "px",
              height: star.height + "px",
              top: star.top + "%",
              left: star.left + "%",
              animationDelay: star.delay + "s",
              animationDuration: star.duration + "s"
            }}
          />
        ))}
      </div>

      {/* Galaxy spiral effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-purple-500/40 via-blue-500/20 to-transparent animate-spin-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Swooshing words */}
        {stage < 5 && (
          <div className="text-6xl font-bold text-white animate-swoosh-in">
            {words[stage] || ""}
          </div>
        )}

        {/* Buddy writing Learnverse */}
        {showBuddy && (
          <div className="flex flex-col items-center gap-4">
            {/* Buddy character */}
            <div className="animate-bounce-in">
              <svg width="120" height="140" viewBox="0 0 90 110" className="filter drop-shadow-2xl">
                {/* Body */}
                <ellipse cx="45" cy="65" rx="32" ry="38" fill="#f0abfc" stroke="#a21caf" strokeWidth="3" />
                {/* Face */}
                <ellipse cx="45" cy="55" rx="22" ry="20" fill="#fff" stroke="#a21caf" strokeWidth="2" />
                {/* Eyes */}
                <ellipse cx="36" cy="55" rx="4" ry="5" fill="#0c0a09" />
                <ellipse cx="54" cy="55" rx="4" ry="5" fill="#0c0a09" />
                {/* Smile */}
                <path d="M38 65 Q45 72 52 65" stroke="#a21caf" strokeWidth="2" fill="none" />
                {/* Arm with pencil */}
                <path d="M15 70 Q0 50 25 45" stroke="#a21caf" strokeWidth="5" fill="none" className="animate-writing" />
                {/* Pencil */}
                <rect x="20" y="40" width="3" height="12" fill="#fbbf24" transform="rotate(-45 20 40)" />
                <polygon points="20,40 22,38 21,42" fill="#78350f" />
                {/* Feet */}
                <ellipse cx="32" cy="100" rx="7" ry="4" fill="#a21caf" />
                <ellipse cx="58" cy="100" rx="7" ry="4" fill="#a21caf" />
              </svg>
            </div>

            {/* Learnverse text being written */}
            <div className="text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fade-in">
              {text}
              {stage === 6 && <span className="animate-blink">|</span>}
            </div>

            {stage >= 6 && (
              <div className="mt-1 max-w-2xl text-center px-4">
                <p className="text-sm sm:text-base text-yellow-200 font-semibold min-h-[24px] animate-fade-in">
                  {epicMessages[loadingMessageIndex]}
                </p>
              </div>
            )}

            {/* System checks */}
            {checks.length > 0 && (
              <div className="mt-8 bg-black/40 backdrop-blur-sm rounded-2xl p-6 min-w-[400px] max-h-[300px] overflow-y-auto">
                {funnyMode && checks.length === 1 && (
                  <div className="text-yellow-300 text-sm mb-3 text-center animate-fade-in">
                    😴 Ok this is really boring... I won't even show it properly!
                  </div>
                )}
                <div className="space-y-2">
                  {checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm animate-fade-in">
                      {check.status === "pending" && (
                        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      )}
                      {check.status === "success" && (
                        <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center text-xs">✓</div>
                      )}
                      {check.status === "error" && (
                        <div className="w-4 h-4 bg-red-400 rounded-full flex items-center justify-center text-xs">✗</div>
                      )}
                      <span className={`flex-1 ${
                        check.status === "success" ? "text-green-300" :
                        check.status === "error" ? "text-red-300" :
                        "text-purple-200"
                      }`}>
                        {check.name}
                      </span>
                      {check.message && (
                        <span className="text-xs text-gray-400">{check.message}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
