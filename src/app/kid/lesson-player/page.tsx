"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useSoundEffects } from "@/utils/soundEffects";
import { useKeyboardShortcuts, getStoredDeviceInfo } from "@/utils/deviceDetection";
import { updateStreak } from "@/utils/streakTracker";

interface LessonStep {
  text: string;
  emoji?: string;
  isQuestion?: boolean;
  correctAnswer?: string;
  phase?: 'intro' | 'how' | 'solve' | 'practice' | 'quiz';
}

function LessonContent() {
    const [buddyVisible, setBuddyVisible] = useState(true);
  const searchParams = useSearchParams();
  const lessonTitle = searchParams.get("title") || "Lesson";
  const sounds = useSoundEffects();
  const deviceInfo = getStoredDeviceInfo();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [mouthShape, setMouthShape] = useState<'closed' | 'small' | 'medium' | 'wide'>('closed');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [streakPopup, setStreakPopup] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [showRetry, setShowRetry] = useState(false);
  
  // Quiz questions - 4 questions per lesson
  const getQuizQuestions = (title: string) => {
    switch (title) {
      case "Addition Basics":
        return [
          { q: "What is 2 + 3?", a: "5" },
          { q: "What is 4 + 4?", a: "8" },
          { q: "What is 1 + 6?", a: "7" },
          { q: "What is 5 + 2?", a: "7" }
        ];
      default:
        return [
          { q: "What did we just learn about?", a: title.toLowerCase() },
          { q: "Can you remember the main topic?", a: title.toLowerCase() },
          { q: "What was this lesson teaching?", a: title.toLowerCase() },
          { q: "Did you understand the lesson?", a: "yes" }
        ];
    }
  };
  
  const [quizQuestions] = useState(getQuizQuestions(lessonTitle));
  const [practiceQuestions] = useState([
    { q: "What did we just learn about?", a: lessonTitle.toLowerCase() },
    { q: "Can you remember the main topic?", a: lessonTitle.toLowerCase() },
    { q: "What was this lesson teaching?", a: lessonTitle.toLowerCase() }
  ]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleLessonComplete = () => {
    sounds?.playCelebration();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    const result = updateStreak();
    if (result.bonusCoins > 0) {
      setStreakPopup(result.message);
      setTimeout(() => setStreakPopup(null), 4000);
    }
  };

  // Comprehensive lesson content based on the lesson title - i-Ready style with questions
  const getLessonContent = (title: string): LessonStep[] => {
    switch (title) {
      case "Addition Basics":
        return [
          { text: "Hi there! Ready to become an addition superstar? Let's do this!", emoji: "⭐", phase: 'intro' },
          { text: "Addition means putting numbers together. When we add, we combine things!", emoji: "➕", phase: 'intro' },
          { text: "Imagine you have 2 toy cars. Your friend gives you 3 more cars. Now count them all!", emoji: "🚗", phase: 'how' },
          { text: "1, 2... then 3, 4, 5! You have 5 cars total. So 2 plus 3 equals 5!", emoji: "🎉", phase: 'how' },
          { text: "Let me ask you a question! What is 3 + 2? Think carefully!", emoji: "🤔", isQuestion: true, correctAnswer: "5", phase: 'solve' },
          { text: "Awesome job! The answer is 5. You're getting this!", emoji: "✨", phase: 'solve' },
          { text: "Here's a cool trick: You can switch the numbers! 3 + 2 and 2 + 3 both equal 5!", emoji: "🔄", phase: 'practice' },
          { text: "Ready for another? What is 4 + 4? You've got this!", emoji: "💪", isQuestion: true, correctAnswer: "8", phase: 'practice' },
          { text: "Fantastic! 4 + 4 = 8. You're doing amazing!", emoji: "🌟", phase: 'quiz' },
          { text: "You crushed it! You're an addition champion! Keep practicing!", emoji: "🏆", phase: 'quiz' }
        ];
      
      case "Subtraction Fun":
        return [
          { text: "Hey friend! Let's master subtraction together. It's easier than you think!", emoji: "😊" },
          { text: "Subtraction means taking away. We start with some and remove some!", emoji: "➖" },
          { text: "You have 5 cookies. You eat 2 cookies. How many are left? Let's count!", emoji: "🍪" },
          { text: "Start with 5. Take away 1... take away 2. You have 3 cookies left! That's 5 minus 2 equals 3!", emoji: "✨" },
          { text: "Your turn! If you have 6 apples and eat 2, how many are left? What's 6 - 2?", emoji: "🍎", isQuestion: true, correctAnswer: "4" },
          { text: "Perfect! 6 - 2 = 4. You're really good at this!", emoji: "🎯" },
          { text: "Remember: We can only take away what we have. Can't take 5 from 3!", emoji: "💡" },
          { text: "Challenge time! What is 10 - 3? Think it through!", emoji: "🤔", isQuestion: true, correctAnswer: "7" },
          { text: "Incredible! 10 - 3 = 7. You nailed it!", emoji: "🌟" },
          { text: "You're a subtraction star! Great work today!", emoji: "⭐" }
        ];
      
      case "Multiplication Tables":
        return [
          { text: "Welcome, future math champion! Today we're learning multiplication - it's like addition superpowers!", emoji: "⚡" },
          { text: "Multiplication means adding the same number multiple times. It's a shortcut!", emoji: "🚀" },
          { text: "Instead of writing 3 + 3 + 3, we can say 3 times 3! Much faster!", emoji: "✖️" },
          { text: "Let's learn the 2s! 2 times 1 equals 2. Just one group of 2!", emoji: "2️⃣" },
          { text: "2 times 2 equals 4. That's 2 + 2. Two groups of 2!", emoji: "✨" }, 
          { text: "Quiz time! What is 2 times 3? Think: three groups of 2!", emoji: "🤔", isQuestion: true, correctAnswer: "6" },
          { text: "Yes! 2 × 3 = 6. That's 2 + 2 + 2! You're getting it!", emoji: "🎉" },
          { text: "The pattern in 2s is: 2, 4, 6, 8, 10! We add 2 each time!", emoji: "📈" },
          { text: "Big challenge! What is 5 times 5?", emoji: "💪", isQuestion: true, correctAnswer: "25" },
          { text: "Outstanding! 5 × 5 = 25. You're a multiplication master!", emoji: "👑" }
        ];
      
      case "The Water Cycle":
        return [
          { text: "Hello scientist! Let's discover how water travels around our planet!", emoji: "🌍" },
          { text: "Water on Earth never disappears! It just changes and moves in a cycle!", emoji: "♻️" },
          { text: "Step 1 is Evaporation! The sun heats water and it turns into invisible vapor!", emoji: "☀️" },
          { text: "The water vapor floats up, up, up into the sky!", emoji: "⬆️" },
          { text: "Step 2 is Condensation! When vapor gets cold, it turns into tiny water drops and makes clouds!", emoji: "☁️" },
          { text: "Quick quiz! When water vapor turns into clouds, what is that called?", emoji: "❓", isQuestion: true, correctAnswer: "condensation" },
          { text: "Exactly right! Condensation! You're paying attention!", emoji: "🌟" },
          { text: "Step 3 is Precipitation! When clouds get heavy, water falls as rain, snow, or hail!", emoji: "🌧️" },
          { text: "Final question! When rain falls from clouds, what step is that?", emoji: "🤔", isQuestion: true, correctAnswer: "precipitation" },
          { text: "Perfect! Precipitation! Or you can say rain. You understand the water cycle! Amazing work!", emoji: "🎉" }
        ];
      
      case "Solar System":
        return [
          { text: "Greetings space explorer! Ready to blast off and learn about our solar system?", emoji: "🚀" },
          { text: "Our solar system has 8 amazing planets, all orbiting around a giant star called the Sun!", emoji: "☀️" },
          { text: "The Sun isn't a planet - it's a star made of hot, glowing gas! It gives us light and warmth!", emoji: "🌞" },
          { text: "The planets in order from the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune!", emoji: "🪐" },
          { text: "Mercury is closest to the Sun and super hot! Venus is the hottest because of its thick atmosphere!", emoji: "🔥" },
          { text: "Which planet is closest to the Sun?", emoji: "❓", isQuestion: true, correctAnswer: "mercury" },
          { text: "Correct! Mercury! It's the smallest planet too!", emoji: "✨" },
          { text: "Earth is special - it's the only planet we know has life! Mars is the red planet!", emoji: "🌍" },
          { text: "Jupiter is the BIGGEST planet! What's the biggest planet in our solar system?", emoji: "🤔", isQuestion: true, correctAnswer: "jupiter" },
          { text: "Yes! Jupiter! You're a space expert now! Keep exploring!", emoji: "🌟" }
        ];
      
      case "Reading Comprehension":
        return [
          { text: "Hi reader! Let's become super detectives and learn to understand every story!", emoji: "🔍" },
          { text: "Reading isn't just saying words - it's understanding what happens in the story!", emoji: "📚" },
          { text: "Listen to this story: Emma found a lost kitten by the school. It was small and gray.", emoji: "🐱" },
          { text: "Good readers ask questions! Let's practice asking Who, What, Where, When, and Why!", emoji: "❓" },
          { text: "Where did Emma find the kitten? Was it by the school or by the park?", emoji: "🤔", isQuestion: true, correctAnswer: "school" },
          { text: "Perfect! By the school! You were listening carefully!", emoji: "🎯" },
          { text: "Now let's think about details. What color was the kitten in our story?", emoji: "🎨", isQuestion: true, correctAnswer: "gray" },
          { text: "Excellent! Gray! You're paying attention to all the details!", emoji: "✨" },
          { text: "Great readers always ask: Who is in the story? What happened? Where and when did it happen?", emoji: "💡" },
          { text: "You're an amazing reader! Keep asking questions when you read!", emoji: "🌟" }
        ];
      
      case "Grammar Rules":
        return [
          { text: "Hey there writer! Let's learn grammar rules to make our writing super clear!", emoji: "✍️" },
          { text: "Every sentence needs two things: a subject and a verb! The subject is who or what. The verb is the action!", emoji: "📝" },
          { text: "Example: The dog runs. 'Dog' is the subject. 'Runs' is the verb!", emoji: "🐕" },
          { text: "Sentences always start with a capital letter! Like this: The cat sleeps.", emoji: "🔠" },
          { text: "In the sentence 'The bird sings', what is the verb - the action word?", emoji: "🤔", isQuestion: true, correctAnswer: "sings" },
          { text: "Awesome! Sings is the verb! It tells us what the bird does!", emoji: "🎵" },
          { text: "Adjectives are describing words. They tell us more about nouns! Like 'big dog' or 'happy girl'!", emoji: "🎨" },
          { text: "What's the adjective in 'red balloon'? What word describes the balloon?", emoji: "❓", isQuestion: true, correctAnswer: "red" },
          { text: "Perfect! Red is the adjective! It describes the balloon!", emoji: "🎈" },
          { text: "You're a grammar genius! Keep writing great sentences!", emoji: "🏆" }
        ];
      
      case "Shapes & Colors":
        return [
          { text: "Hello artist! Let's explore the wonderful world of shapes and colors!", emoji: "🎨" },
          { text: "Shapes are all around us! Let's learn the basic ones!", emoji: "✨" },
          { text: "A circle is perfectly round with no corners - like a ball or pizza!", emoji: "⭕" },
          { text: "A square has 4 equal sides and 4 corners - like a window!", emoji: "🟦" },
          { text: "A triangle has 3 sides and 3 corners - like a slice of pizza!", emoji: "🔺" },
          { text: "How many sides does a triangle have?", emoji: "🤔", isQuestion: true, correctAnswer: "3" },
          { text: "Correct! 3 sides! You know your shapes!", emoji: "🎯" },
          { text: "Now colors! Red, Blue, and Yellow are primary colors. We can mix them to make others!", emoji: "🌈" },
          { text: "Red plus Blue makes Purple! Blue plus Yellow makes Green! Red plus Yellow makes Orange!", emoji: "🎨" },
          { text: "What color do we get when we mix Red and Blue?", emoji: "❓", isQuestion: true, correctAnswer: "purple" },
          { text: "Yes! Purple! You're amazing at colors! Keep creating!", emoji: "🌟" }
        ];
      
      default:
        return [
          { text: "Hey there! I'm so excited to learn with you today!", emoji: "😊" },
          { text: "We're going to have so much fun learning together!", emoji: "🎉" },
          { text: "Are you ready? Let's get started!", emoji: "🚀" },
          { text: "You're doing great! Keep it up!", emoji: "⭐" },
          { text: "Awesome work! You're a learning superstar!", emoji: "🌟" },
        ];
    }
  };
  
  const lessonSteps: LessonStep[] = getLessonContent(lessonTitle);

  // Mouth shapes for animation
  const mouthShapes: ('closed' | 'small' | 'medium' | 'wide')[] = ['closed', 'small', 'medium', 'wide', 'medium', 'small'];

  // Animate character when speaking - varied mouth shapes for realistic talking
  useEffect(() => {
    if (isSpeaking) {
      // Random mouth shapes to simulate natural speech
      let shapeIndex = 0;
      
      const interval = setInterval(() => {
        shapeIndex = (shapeIndex + 1) % mouthShapes.length;
        setMouthShape(mouthShapes[shapeIndex]);
      }, 120); // Varied timing for natural speech
      
      return () => clearInterval(interval);
    } else {
      setMouthShape('closed');
    }
  }, [isSpeaking]);

  const speakText = (text: string) => {
    setIsSpeaking(true);
    
    // Use Web Speech API with soft, friendly child-like voice
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88; // Slow, chill, natural human pace
      utterance.pitch = 1.2; // Natural, chill boy voice - not robotic
      utterance.volume = 0.85; // Clear but still gentle volume
      
      // Load voices and pick the most natural one
      let voices = window.speechSynthesis.getVoices();
      
      // If voices not loaded yet, wait for them
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          setVoice();
        };
      } else {
        setVoice();
      }
      
      function setVoice() {
        // Priority order: Prefer natural-sounding English voices
        const preferredVoices = [
          'Samantha', 'Karen', 'Moira', 'Tessa', 'Alex',
          'Google US English', 'Microsoft Zira', 'English (US)'
        ];
        
        let selectedVoice = voices.find(voice => 
          preferredVoices.some(preferred => voice.name.includes(preferred))
        );
        
        // Fallback to any English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setMouthShape('closed');
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setMouthShape('closed');
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback animation if speech not supported
      setTimeout(() => {
        setIsSpeaking(false);
        setMouthShape('closed');
      }, 3000);
    }
  };

  const handleNext = () => {
    if (currentStep < lessonSteps.length - 1) {
      // Check answer if it's a question
      if (lessonSteps[currentStep].isQuestion && userAnswer.trim()) {
        const correct = userAnswer.toLowerCase().trim() === lessonSteps[currentStep].correctAnswer?.toLowerCase();
        if (correct) {
          sounds?.playCorrect(); // Play correct sound!
          speakText("That's correct! Great job!");
          setTimeout(() => {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            setUserAnswer("");
            speakText(lessonSteps[nextStep].text);
          }, 1500);
        } else {
          sounds?.playWrong(); // Play wrong answer sound!
          speakText("Not quite! Try again! You can do this!");
          return;
        }
      } else {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setUserAnswer("");
        speakText(lessonSteps[nextStep].text);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      speakText(lessonSteps[prevStep].text);
    }
  };

  const handleReplay = () => {
    speakText(lessonSteps[currentStep].text);
  };

  // Keyboard shortcuts for desktop users
  useKeyboardShortcuts({
    'arrowleft': () => {
      sounds?.playClick();
      handlePrevious();
    },
    'arrowright': () => {
      sounds?.playClick();
      handleNext();
    },
    'r': () => {
      sounds?.playClick();
      handleReplay();
    },
    'enter': () => {
      if (lessonSteps[currentStep].isQuestion && userAnswer.trim()) {
        sounds?.playClick();
        handleNext();
      }
    }
  });

  // Auto-speak first message
  useEffect(() => {
    speakText(lessonSteps[0].text);
      setBuddyVisible(true);
  }, []);

    // Animate buddy in/out on step change
    useEffect(() => {
      setBuddyVisible(false);
      const timer = setTimeout(() => setBuddyVisible(true), 200);
      return () => clearTimeout(timer);
    }, [currentStep]);

  const progressPercent = ((currentStep + 1) * 100) / lessonSteps.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-8 relative overflow-hidden animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-[confetti_3s_ease-out_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)],
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* Streak Popup */}
      {streakPopup && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full shadow-2xl border-4 border-yellow-300">
            <p className="text-xl font-bold text-center">{streakPopup}</p>
          </div>
        </div>
      )}

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullScreen}
        className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 hover:scale-110 transition-all duration-200 shadow-lg"
      >
        {isFullScreen ? '🔙 Exit Fullscreen' : '⛶ Fullscreen'}
      </button>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-white to-purple-50 rounded-2xl shadow-2xl p-6 mb-6 border-4 border-purple-300">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-pulse">{lessonTitle}</h1>
            <Link 
              href="/kid/lessons"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Back to Lessons
            </Link>
          </div>
          {deviceInfo?.hasKeyboard && (
            <p className="text-center text-sm text-gray-500 mt-2">
              ⌨️ Shortcuts: ← Prev | → Next | R Replay | Enter Submit
            </p>
          )}
        </div>

        {/* Main Lesson Area - Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Buddy in Window */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-2xl shadow-2xl p-6 border-4 border-purple-400 sticky top-6 animate-pulse-slow">
              <h3 className="text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold mb-4 text-2xl">👋 Your Learning Buddy!</h3>
              
              {/* Animated Character in Window */}
              <div className={`flex justify-center mb-4 bg-white rounded-xl p-4 shadow-inner overflow-visible transition-transform transition-opacity duration-700 ${buddyVisible ? 'translate-x-0 opacity-100' : '-translate-x-[180px] opacity-0'}`} style={{ willChange: 'transform, opacity' }}>
                <svg 
                  width="150" 
                  height="210" 
                  className={`transition-all duration-500 ${isSpeaking ? 'animate-bounce' : 'hover:scale-110'}`}
                  style={{ 
                    filter: 'url(#roughen)',
                    animation: isSpeaking ? 'bounce 0.5s ease-in-out infinite' : 'float 3s ease-in-out infinite'
                  }}
                >
                  <defs>
                    <filter id="roughen">
                      <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" seed="2"/>
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                    </filter>
                  </defs>
                  
                  {/* Body */}
                  <path d="M 75 60 Q 74 82 75 105" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" />
                  {/* Pointing Arm - RIGHT SIDE pointing at content! */}
                  <path d="M 75 75 Q 95 75 120 70" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="125" cy="68" r="3" fill="#ff0000" /> {/* Pointing finger! */}
                  {/* Left Arm */}
                  <path d="M 75 75 Q 55 78 45 90" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" />
                  {/* Legs */}
                  <path d="M 75 105 Q 67 127 60 150" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M 75 105 Q 83 127 90 150" stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round" />
                  
                  {/* Head */}
                  <circle cx="75" cy="37" r="22" fill="none" stroke="#000000" strokeWidth="3" />
                  
                  {/* Eyes */}
                  <circle cx="67" cy="33" r="3" fill="#000000" />
                  <circle cx="83" cy="33" r="3" fill="#000000" />
                  
                  {/* Mouth */}
                  {mouthShape === 'closed' ? (
                    <path d="M 63 43 Q 75 52 87 43" stroke="#000000" strokeWidth="2" fill="none" strokeLinecap="round" />
                  ) : mouthShape === 'small' ? (
                    <ellipse cx="75" cy="45" rx="6" ry="3" fill="none" stroke="#000000" strokeWidth="2" />
                  ) : mouthShape === 'medium' ? (
                    <ellipse cx="75" cy="45" rx="7" ry="6" fill="none" stroke="#000000" strokeWidth="2" />
                  ) : (
                    <ellipse cx="75" cy="45" rx="9" ry="9" fill="none" stroke="#000000" strokeWidth="2" />
                  )}
                  
                  {/* Pointing arrow animation */}
                  <g className="animate-[bounce_1s_ease-in-out_infinite]">
                    <path d="M 130 68 L 145 68 L 140 63 M 145 68 L 140 73" stroke="#ff0000" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
              
              {/* Buddy Speech */}
              <div className="bg-yellow-100 rounded-xl p-4 border-2 border-yellow-300 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent border-b-yellow-100"></div>
                <p className="text-sm text-gray-700 text-center font-medium">
                  {lessonSteps[currentStep].isQuestion 
                    ? "🤔 Think carefully and type your answer!"
                    : "📖 I'm explaining this to you!"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Content Area with Falling Letters */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Content Section with Falling Letter Animation */}
              <div 
                key={currentStep}
                className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6 relative"
              >
                {!quizMode ? (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      {lessonSteps[currentStep].emoji && (
                        <span 
                          className="text-6xl inline-block"
                          style={{ animation: 'emojiSpin 1.5s ease-in-out infinite' }}
                        >
                          {lessonSteps[currentStep].emoji}
                        </span>
                      )}
                    </div>
                    
                    {/* Text with Letters Falling Into Place */}
                    <div className="text-2xl leading-relaxed text-gray-800">
                      {lessonSteps[currentStep].text.split('').map((char, index) => (
                        <span
                          key={index}
                          style={{
                            display: 'inline-block',
                            animation: `letterFall 0.5s ease-out ${index * 0.03}s both`,
                            whiteSpace: char === ' ' ? 'pre' : 'normal'
                          }}
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </>
                ) : showRetry ? (
                  <>
                    {/* Retry Screen - Need More Practice! */}
                    <div className="text-center py-12">
                      <div className="text-8xl mb-6 animate-bounce">😅</div>
                      <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4 animate-pulse">
                        Need a Little More Practice!
                      </h2>
                      <p className="text-2xl text-gray-700 mb-6">
                        You got {quizScore} out of {quizQuestions.length} correct.
                      </p>
                      <p className="text-xl text-gray-600 mb-8">
                        You need at least {Math.ceil(quizQuestions.length / 2)} correct answers to pass. Let's try the lesson again! 💪
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Quiz Mode */}
                    <div className="text-center mb-6">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-bounce">
                        🎯 QUIZ TIME! 🎯
                      </h2>
                      <p className="text-lg text-gray-600">
                        Question {currentStep + 1} of {quizQuestions.length}
                      </p>
                    </div>
                    
                    {currentStep < quizQuestions.length ? (
                      <>
                        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-xl border-4 border-yellow-400 mb-6 shadow-lg">
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            {quizQuestions[currentStep].q.split('').map((char, index) => (
                              <span
                                key={index}
                                style={{
                                  display: 'inline-block',
                                  animation: `letterFall 0.5s ease-out ${index * 0.03}s both`,
                                  whiteSpace: char === ' ' ? 'pre' : 'normal'
                                }}
                              >
                                {char}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer..."
                          className="w-full px-6 py-4 border-4 border-purple-400 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-600 text-2xl transition-all duration-300 hover:shadow-xl mb-4"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && userAnswer.trim()) {
                              const correct = userAnswer.toLowerCase().trim() === quizQuestions[currentStep].a.toLowerCase();
                              const newAnswers = [...quizAnswers, correct];
                              setQuizAnswers(newAnswers);
                              if (correct) {
                                sounds?.playCorrect();
                                setQuizScore(quizScore + 1);
                              } else {
                                sounds?.playWrong();
                              }
                              setUserAnswer('');
                              if (currentStep + 1 >= quizQuestions.length) {
                                // Quiz complete - check if passed
                                const finalScore = correct ? quizScore + 1 : quizScore;
                                const passThreshold = Math.ceil(quizQuestions.length / 2);
                                if (finalScore < passThreshold) {
                                  setShowRetry(true);
                                }
                              }
                              setCurrentStep(currentStep + 1);
                            }
                          }}
                          autoFocus
                        />
                        
                        <button
                          onClick={() => {
                            const correct = userAnswer.toLowerCase().trim() === quizQuestions[currentStep].a.toLowerCase();
                            const newAnswers = [...quizAnswers, correct];
                            setQuizAnswers(newAnswers);
                            if (correct) {
                              sounds?.playCorrect();
                              setQuizScore(quizScore + 1);
                            } else {
                              sounds?.playWrong();
                            }
                            setUserAnswer('');
                            if (currentStep + 1 >= quizQuestions.length) {
                              // Quiz complete - check if passed
                              const finalScore = correct ? quizScore + 1 : quizScore;
                              const passThreshold = Math.ceil(quizQuestions.length / 2);
                              if (finalScore < passThreshold) {
                                setShowRetry(true);
                              }
                            }
                            setCurrentStep(currentStep + 1);
                          }}
                          disabled={!userAnswer.trim()}
                          className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                        >
                          Submit Answer ✓
                        </button>
                      </>
                    ) : !showRetry ? (
                      <>
                        {/* Quiz Results - PASSED! */}
                        <div className="text-center py-8">
                          <div className="text-8xl mb-6 animate-bounce">🎉</div>
                          <h3 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-4">
                            {quizScore === quizQuestions.length ? 'PERFECT SCORE!' : 'YOU PASSED!'}
                          </h3>
                          <p className="text-3xl text-gray-700 mb-6">
                            You got {quizScore} out of {quizQuestions.length} correct!
                          </p>
                          <div className="text-6xl mb-4 animate-bounce">🏆</div>
                        </div>
                      </>
                    ) : null}
                  </>
                )}
              </div>
            
            {!quizMode && lessonSteps[currentStep].isQuestion && (
              <div className="mt-4 animate-[slideIn_0.5s_ease-out]">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-4 focus:ring-purple-300 focus:border-purple-500 focus:scale-105 text-lg transition-all duration-300 hover:shadow-lg animate-pulse"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userAnswer.trim()) {
                      handleNext();
                    }
                  }}
                  autoFocus
                />
              </div>
            )}

              {/* Controls - MOVED TO TOP */}
              <div className="flex gap-4 justify-center mb-6 mt-4">
            <button
              onClick={() => {
                sounds?.playClick();
                handlePrevious();
              }}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              ← Previous
            </button>
            
            <button
              onClick={() => {
                sounds?.playClick();
                handleReplay();
              }}
              disabled={isSpeaking}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 transition-all duration-200 animate-pulse"
            >
              🔊 Replay
            </button>
            
            {currentStep < lessonSteps.length - 1 ? (
              <button
                onClick={() => {
                  sounds?.playClick();
                  handleNext();
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-200 animate-[pulse_2s_ease-in-out_infinite]"
              >
                Next →
              </button>
            ) : !quizMode ? (
              <button 
                onClick={() => {
                  sounds?.playClick();
                  setQuizMode(true);
                  setCurrentStep(0);
                  setQuizScore(0);
                  setQuizAnswers([]);
                }}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-200 animate-[bounce_1s_ease-in-out_infinite]"
              >
                🎯 Take the Quiz!
              </button>
            ) : showRetry ? (
              <button 
                onClick={() => {
                  sounds?.playClick();
                  setCurrentStep(0);
                  setQuizMode(false);
                  setShowRetry(false);
                  setQuizScore(0);
                  setQuizAnswers([]);
                }}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-200 animate-[bounce_1s_ease-in-out_infinite]"
              >
                🔄 Try Lesson Again
              </button>
            ) : (
              <Link href="/kid/lessons">
                <button 
                  onClick={handleLessonComplete}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-200 animate-[bounce_1s_ease-in-out_infinite]"
                >
                  ✓ Complete Lesson
                </button>
              </Link>
            )}
          </div>

              {/* Progress - Chunked by Phase */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-bold text-purple-700 animate-pulse text-lg">✨ Your Learning Journey ✨</span>
                  <span className="font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent animate-[bounce_1s_ease-in-out_infinite] text-lg">
                    Step {currentStep + 1} of {lessonSteps.length}
                  </span>
                </div>
                
                {/* Phase-based chunked progress */}
                <div className="flex gap-2 mb-2">
                  {['intro', 'how', 'solve', 'practice', 'quiz'].map((phase, idx) => {
                    const phaseNames = ['📚 Intro', '🔍 How', '✏️ Solve', '💪 Practice', '🎯 Quiz'];
                    const phaseColors = [
                      'from-blue-400 to-blue-500',
                      'from-green-400 to-green-500', 
                      'from-yellow-400 to-yellow-500',
                      'from-orange-400 to-orange-500',
                      'from-purple-400 to-purple-500'
                    ];
                    const currentPhase = lessonSteps[currentStep]?.phase || 'intro';
                    const phaseIndex = ['intro', 'how', 'solve', 'practice', 'quiz'].indexOf(currentPhase);
                    const isActive = idx === phaseIndex;
                    const isComplete = idx < phaseIndex;
                    
                    return (
                      <div key={phase} className="flex-1">
                        <div className={`text-xs text-center mb-1 font-bold transition-all ${
                          isActive ? 'text-purple-700 scale-110' : isComplete ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {phaseNames[idx]}
                        </div>
                        <div className={`h-3 rounded-full border-2 transition-all duration-500 ${
                          isActive ? `bg-gradient-to-r ${phaseColors[idx]} border-purple-400 animate-pulse shadow-lg scale-105` :
                          isComplete ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-400' :
                          'bg-gray-200 border-gray-300'
                        }`}>
                          {isComplete && (
                            <div className="flex items-center justify-center h-full text-white text-xs font-bold">✓</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Overall progress bar */}
                <div className="w-full bg-gradient-to-r from-gray-300 via-purple-100 to-gray-300 rounded-full h-2 shadow-lg relative overflow-hidden border border-purple-200 mt-3">
                  <div
                    className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out relative"
                    style={{ 
                      width: `${progressPercent}%`,
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s infinite'
                    }}
                  >
                    <div className="absolute inset-0 bg-white opacity-40 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-gradient-shift {
          animation: gradient-shift 8s ease infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function LessonTeacherPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LessonContent />
    </Suspense>
  );
}
