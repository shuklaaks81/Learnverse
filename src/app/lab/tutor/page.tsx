"use client";

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Track question history for smart learning
function getQuestionHistory(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem('tutorQuestionHistory');
  return stored ? JSON.parse(stored) : {};
}

function saveQuestionType(type: string) {
  if (typeof window === 'undefined') return;
  const history = getQuestionHistory();
  history[type] = (history[type] || 0) + 1;
  localStorage.setItem('tutorQuestionHistory', JSON.stringify(history));
}

function shouldGiveStrategy(type: string): boolean {
  const history = getQuestionHistory();
  return (history[type] || 0) >= 3; // After 3 times, give strategy instead
}

function getWarningIfNeeded(type: string): string | null {
  const history = getQuestionHistory();
  const count = history[type] || 0;
  if (count === 2) {
    return "💡 Heads up! Next time I'll teach you the strategy instead of just giving the answer! That way you'll learn to solve it yourself! 🌟";
  }
  return null;
}

// Helper: Check if string contains any of the words (typo-tolerant)
function containsAny(text: string, words: string[]): boolean {
  return words.some(word => text.includes(word));
}

// Helper: Extract all numbers from text
function extractNumbers(text: string): number[] {
  const matches = text.match(/\d+/g);
  return matches ? matches.map(n => parseInt(n)) : [];
}

// Helper: Detect question type for better responses
function detectQuestionType(text: string): string {
  if (text.match(/\d+\s*[+\-*/×÷]\s*\d+/)) return 'math_problem';
  if (containsAny(text, ['why', 'how come', 'reason'])) return 'why';
  if (containsAny(text, ['how', 'way to', 'steps'])) return 'how';
  if (containsAny(text, ['what', 'whats', 'define', 'meaning'])) return 'what';
  if (containsAny(text, ['when', 'time'])) return 'when';
  if (containsAny(text, ['where'])) return 'where';
  return 'statement';
}

// Universal smart tutor - handles ANY question!
function getResponse(question: string): string {
  const q = question.toLowerCase().trim();
  const questionType = detectQuestionType(q);
  
  // EXPLICIT STRATEGY REQUESTS - Check first!
  if (containsAny(q, ['strategy', 'strategies', 'tip', 'tips', 'trick', 'tricks', 'learn', 'teach me', 'help me'])) {
    
    // Math strategies
    if (containsAny(q, ['add', 'addition', 'plus'])) {
      return "🎯 Addition Strategy!\n\n1️⃣ Start with the BIGGER number in your head\n2️⃣ Count up using fingers or objects\n3️⃣ Check by counting backwards!\n\n💡 Tricks:\n- Use doubles: 6+6=12, so 6+7=13!\n- Make 10 first: 8+5 = (8+2)+3 = 10+3 = 13\n- Draw a number line and hop!\n\nYou've got this! 💪";
    }
    
    if (containsAny(q, ['subtract', 'subtraction', 'minus'])) {
      return "🎯 Subtraction Strategy!\n\n1️⃣ Start with the big number\n2️⃣ Count backward or cross off as you go\n3️⃣ Think: 'What do I add to get back?'\n\n💡 Tricks:\n- Draw it out with circles!\n- Use your fingers\n- Check with addition: 10-3=7 because 7+3=10!\n- Count up from the small number to the big one\n\nPractice makes perfect! 🌟";
    }
    
    if (containsAny(q, ['multiply', 'multiplication', 'times'])) {
      return "🎯 Multiplication Strategy!\n\n1️⃣ Think of it as GROUPS: 3×4 = 3 groups of 4\n2️⃣ Use skip counting: 5×3 = 5, 10, 15!\n3️⃣ Draw pictures of groups\n4️⃣ Use patterns: 5× always ends in 5 or 0!\n\n💡 Tricks:\n- Start with easier ones (×2, ×5, ×10)\n- Use your fingers for ×9 (tricky trick!)\n- Break big problems: 6×7 = (6×5)+(6×2) = 30+12 = 42\n- Make a times table chart!\n\nYou'll memorize them with practice! 🔥";
    }
    
    if (containsAny(q, ['divide', 'division'])) {
      return "🎯 Division Strategy!\n\n1️⃣ Draw circles for each group\n2️⃣ Share items equally, one at a time\n3️⃣ Keep going until nothing's left!\n4️⃣ Count what's in each circle\n\n💡 Tricks:\n- Use multiplication backwards: 20÷4=? Ask \"4×?=20\"\n- Share with your fingers or draw it!\n- Start with easy ones: ÷2 is just half!\n- Remainders are okay - that's what's left over!\n\nDivision is just fair sharing! 🍕";
    }
    
    if (containsAny(q, ['fraction', 'fractions'])) {
      return "🎯 Fractions Strategy!\n\n1️⃣ Draw a picture! Cut a circle or rectangle into pieces\n2️⃣ Top number (numerator) = how many pieces you HAVE\n3️⃣ Bottom number (denominator) = how many pieces TOTAL\n4️⃣ Bigger bottom number = smaller pieces!\n\n💡 Tricks:\n- 1/2 = half (50%)\n- 1/4 = quarter (25¢!)\n- Compare: Which is more pizza - 1/2 or 1/4? Draw it!\n- Equivalent: 1/2 = 2/4 = 3/6 (same amount, different pieces!)\n\nFractions are everywhere! 🍰";
    }
    
    // Reading strategies
    if (containsAny(q, ['read', 'reading'])) {
      return "📚 Reading Strategy!\n\n1️⃣ Sound out each letter slowly\n2️⃣ Blend sounds together: c-a-t = cat!\n3️⃣ Look for chunks you recognize (-ing, -tion, -ed)\n4️⃣ Skip hard words first, come back later\n5️⃣ Ask: \"Does this make sense?\"\n\n💡 Tricks:\n- Read out loud - your ears help!\n- Point to each word as you go\n- Picture it like a movie in your mind\n- Read the same book twice - 2nd time is easier!\n- Read 20 minutes every day!\n\nReading takes practice - you're building a superpower! 🦸";
    }
    
    if (containsAny(q, ['spell', 'spelling'])) {
      return "✍️ Spelling Strategy!\n\n1️⃣ Say the word slowly: rrr-aaa-nnn = ran\n2️⃣ Break long words into chunks: re-mem-ber\n3️⃣ Look for patterns: -ight (light, night, right)\n4️⃣ Write it 3 times to remember!\n5️⃣ Make up a silly memory trick!\n\n💡 Tricks:\n- Vowels in order: A-E-I-O-U\n- \"I before E except after C\" (most of the time!)\n- Double letters: rabbit, bubble, letter\n- Silent letters: knee, knight, write\n- Practice the words YOU use most!\n\nYou'll get better every day! ⭐";
    }
    
    if (containsAny(q, ['write', 'writing'])) {
      return "✏️ Writing Strategy!\n\n1️⃣ Think: What do I want to say?\n2️⃣ Start with simple sentences (noun + verb)\n3️⃣ Add describing words (adjectives!)\n4️⃣ Check: Capital at start? Period at end?\n5️⃣ Read it out loud - does it make sense?\n\n💡 Tricks:\n- Draw your ideas first!\n- Say your sentence before writing it\n- Start sentences different ways\n- Use \"and\" to combine ideas\n- Don't worry about perfect - just START!\n\nWriters write! ✨";
    }
    
    // Study strategies
    if (containsAny(q, ['study', 'studying', 'homework']) && !containsAny(q, ['what', 'when', 'why'])) {
      return "🎓 Study Strategy!\n\n1️⃣ Break big topics into small chunks\n2️⃣ Study for 20-30 mins, then take a 5-min break\n3️⃣ Practice, don't just read!\n4️⃣ Teach it to someone (or a stuffed animal!)\n5️⃣ Quiz yourself without looking!\n\n💡 Power Tips:\n- Study at the same time each day\n- No distractions - phone away!\n- Sleep helps your brain remember!\n- Review a little each day (not all the night before!)\n- Ask questions when confused!\n\nYou're building great habits! 🌟";
    }
    
    if (containsAny(q, ['remember', 'memorize', 'memory'])) {
      return "🧠 Memory Strategy!\n\n1️⃣ Say it out loud 3 times\n2️⃣ Make a silly picture in your mind\n3️⃣ Connect it to something you already know\n4️⃣ Make up a story or song!\n5️⃣ Test yourself the next day\n\n💡 Memory Tricks:\n- Acronyms: HOMES = Great Lakes (Huron, Ontario, Michigan, Erie, Superior)\n- Rhymes: \"30 days has September...\"\n- Chunk it: Phone numbers (555-1234, not 5551234)\n- Teach it to someone!\n- Sleep helps lock in memory!\n\nYour brain is AMAZING at remembering! 🔥";
    }
    
    // General learning
    if (containsAny(q, ['learn', 'learning']) && !containsAny(q, ['what', 'about', 'who', 'when'])) {
      return "🌟 Learning Strategy!\n\n1️⃣ Be curious! Ask lots of questions\n2️⃣ Make mistakes - that's how you learn!\n3️⃣ Practice a little every day\n4️⃣ Connect new stuff to what you know\n5️⃣ Teach others what you learned!\n\n💡 Learning Superpowers:\n- Growth Mindset: \"I can't do it... YET!\"\n- Break hard things into small steps\n- Take breaks when frustrated\n- Celebrate small wins!\n- Everyone learns at their own speed - that's okay!\n\nYou're already a great learner! 💪✨";
    }
    
    // Science strategies
    if (containsAny(q, ['science', 'experiment'])) {
      return "🔬 Science Strategy!\n\n1️⃣ Ask: What do I think will happen? (hypothesis)\n2️⃣ Observe carefully - use all your senses!\n3️⃣ Look for patterns - what's the same? What's different?\n4️⃣ Ask \"Why?\" and \"How?\" questions\n5️⃣ Draw pictures of what you see!\n\n💡 Science Tips:\n- Real scientists make lots of mistakes!\n- Write down what you notice\n- Connect it to your everyday life\n- Everything around you IS science!\n\nStay curious! 🌍✨";
    }
    
    // Problem solving
    if (containsAny(q, ['solve', 'problem', 'stuck', 'help me figure'])) {
      return "🎯 Problem Solving Strategy!\n\n1️⃣ Read/look at the problem carefully\n2️⃣ What do I KNOW? What do I NEED to find?\n3️⃣ Have I seen something like this before?\n4️⃣ Try something! Wrong answers teach you too!\n5️⃣ If stuck, take a break and come back\n\n💡 Problem Solver Tricks:\n- Draw a picture\n- Use objects (coins, blocks, etc.)\n- Break BIG problems into SMALL steps\n- Work backwards from the answer\n- Ask: \"Does my answer make sense?\"\n\nYou're a problem solver! 🧩💪";
    }
  }
  
  // MATH QUESTIONS
  // Detect math problems (handles any size numbers!)
  const mathMatch = q.match(/(\d+)\s*([+\-*/×÷])\s*(\d+)/);
  if (mathMatch) {
    const [_, num1, operator, num2] = mathMatch;
    const a = parseInt(num1);
    const b = parseInt(num2);
    
    // Check if numbers are "big" for different strategies
    const isBig = a >= 100 || b >= 100;
    const isVeryBig = a >= 1000 || b >= 1000;
    const maxNum = Math.max(a, b);
    
    if (shouldGiveStrategy('basic_math')) {
      if (isVeryBig) {
        return `🤔 Whoa, big numbers! Here's the strategy:\n\n${operator === '+' || operator === '-' ? '1️⃣ Line up the numbers vertically (ones under ones, tens under tens)\n2️⃣ Start from the RIGHT side\n3️⃣ Work your way left!' : operator === '*' || operator === '×' ? '1️⃣ Break it into smaller multiplications\n2️⃣ Or use a calculator - these are big!' : '1️⃣ Use long division\n2️⃣ Or use a calculator!'}\n\nYou've got this! 💪`;
      }
      return `🤔 You've got this! ${operator === '+' ? 'Count up from ' + num1 : operator === '-' ? 'Count back from ' + num1 : 'Try breaking it into smaller steps'}! What do YOU think the answer is? 💪`;
    }
    
    const warning = getWarningIfNeeded('basic_math');
    saveQuestionType('basic_math');
    
    let result;
    let explanation;
    let strategy = '';
    
    switch(operator) {
      case '+':
        result = a + b;
        if (isVeryBig) {
          explanation = `Big addition! Line them up vertically and add from right to left!`;
          strategy = `\n\n💡 Strategy for big numbers:\n  ${num1.toString().padStart(6)}\n+ ${num2.toString().padStart(6)}\n= ${result.toString().padStart(6)}\nStart with ones, then tens, then hundreds!`;
        } else if (isBig) {
          explanation = `Add the tens first, then the ones! Like ${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${Math.floor(a/10)*10 + Math.floor(b/10)*10}, then add the rest!`;
        } else {
          explanation = `Start at ${a}, then count up ${b} more!`;
        }
        break;
      case '-':
        result = a - b;
        if (isVeryBig) {
          explanation = `Big subtraction! Line them up vertically and subtract from right to left!`;
          strategy = `\n\n💡 Strategy: Write them vertically, start from the right side, borrow if needed!`;
        } else if (isBig) {
          explanation = `Subtract the tens first, then the ones! Break it into chunks!`;
        } else {
          explanation = `Start at ${a}, then take away ${b}!`;
        }
        break;
      case '*':
      case '×':
        result = a * b;
        if (isVeryBig) {
          explanation = `Wow, big multiplication! Use long multiplication or a calculator!`;
          strategy = `\n\n💡 This is advanced! Break it down:\n${a} × ${b} - Try using a calculator or ask an adult to show you long multiplication!`;
        } else if (isBig) {
          // Show a breakdown for medium numbers
          if (b <= 12) {
            explanation = `That's ${a} groups of ${b}! Or ${b} groups of ${a}!`;
          } else {
            explanation = `Big multiplication! Try: ${a} × ${Math.floor(b/10)*10} + ${a} × ${b%10}`;
            strategy = `\n\n💡 Break it apart:\n${a} × ${Math.floor(b/10)*10} = ${a * Math.floor(b/10)*10}\n${a} × ${b%10} = ${a * (b%10)}\nAdd them: ${a * Math.floor(b/10)*10} + ${a * (b%10)} = ${result}!`;
          }
        } else {
          explanation = `That's ${a} groups of ${b}!`;
        }
        break;
      case '/':
      case '÷':
        result = Math.floor(a / b);
        const remainder = a % b;
        if (isVeryBig) {
          explanation = `Big division! Use long division!`;
          strategy = remainder > 0 ? `\n\n💡 Answer: ${result} with ${remainder} left over (remainder)` : '';
        } else if (isBig) {
          explanation = `Split ${a} into ${b} equal groups!`;
          strategy = remainder > 0 ? `\n\n💡 ${result} groups with ${remainder} left over!` : '';
        } else {
          explanation = `Split ${a} into ${b} equal groups!`;
          strategy = remainder > 0 ? ` That's ${result} with ${remainder} left over!` : '';
        }
        break;
      default:
        result = '?';
        explanation = '';
    }
    
    // Add helpful context for big numbers
    let sizeNote = '';
    if (isVeryBig) {
      sizeNote = `\n\n🌟 You're working with BIG numbers (${maxNum >= 10000 ? 'ten thousands' : 'thousands'})! That's impressive! Real-world math often uses big numbers!`;
    } else if (isBig) {
      sizeNote = `\n\n✨ Nice! You're practicing with ${maxNum >= 500 ? 'hundreds' : 'bigger numbers'}! This builds your skills!`;
    }
    
    const answer = `${num1} ${operator} ${num2} = ${result}! 🎉\n\n${explanation}${strategy}${sizeNote}`;
    return warning ? `${answer}\n\n${warning}` : answer;
  }
  
  // Math concepts
  if (q.includes('add') || q.includes('addition')) {
    if (shouldGiveStrategy('addition_concept')) {
      return "💡 Strategy: When adding, start with the bigger number and count up! Or use your fingers! You're getting good at this! 🌟";
    }
    saveQuestionType('addition_concept');
    return "Addition means putting numbers together! For example, 3 + 4 = 7. Try it with objects you can see! ✨";
  }
  
  if (q.includes('subtract') || q.includes('minus')) {
    if (shouldGiveStrategy('subtraction_concept')) {
      return "💡 Strategy: When subtracting, count backwards or draw it out! Cross off as you go! 💪";
    }
    saveQuestionType('subtraction_concept');
    return "Subtraction means taking away! If you have 5 cookies and eat 2, you have 3 left! 🍪";
  }
  
  if (q.includes('multiply') || q.includes('times') || q.includes('multiplication')) {
    if (shouldGiveStrategy('multiplication_concept')) {
      return "💡 Strategy: Break it into groups! For 3×4, imagine 3 groups of 4 things. Count them all! Or use a multiplication table! 🔢";
    }
    saveQuestionType('multiplication_concept');
    return "Multiplication is repeated addition! 3 × 4 means 'add 3 four times': 3+3+3+3 = 12! 🔢";
  }
  
  if (q.includes('divide') || q.includes('division')) {
    if (shouldGiveStrategy('division_concept')) {
      return "💡 Strategy: Draw circles for groups! Split your number evenly across them. That's division! 🍕";
    }
    saveQuestionType('division_concept');
    return "Division means sharing equally! 12 ÷ 3 asks 'how many groups of 3 can you make from 12?' Answer: 4! 🍕";
  }
  
  // SCIENCE QUESTIONS
  if (q.includes('why') && (q.includes('sky') || q.includes('blue'))) {
    return "The sky looks blue because sunlight bounces off tiny air molecules! Blue light scatters more than other colors! It's called Rayleigh scattering! 🌤️✨";
  }
  
  if (q.includes('plant') || q.includes('grow')) {
    if (shouldGiveStrategy('plants')) {
      return "💡 Think about what YOU need to live - food, water, air! Plants need similar things! What do you think they need? 🌱";
    }
    saveQuestionType('plants');
    return "Plants need 3 things: water 💧, sunlight ☀️, and air! They make food through photosynthesis - turning sunlight into energy! 🌱";
  }
  
  if (q.includes('animal')) {
    if (shouldGiveStrategy('animals')) {
      return "💡 Look around you! Can you name 5 different animals? What makes them different from plants? 🐾";
    }
    saveQuestionType('animals');
    return "Animals are living things that move, eat, and grow! They can be mammals (like us!), birds, fish, reptiles, or insects! 🐾";
  }
  
  if (q.includes('water cycle')) {
    return "Water evaporates into clouds, then falls as rain, flows to oceans, and repeats! It's nature's recycling system! 💧☁️🌧️";
  }
  
  if (q.includes('photosynthesis')) {
    return "Photosynthesis is how plants make food! They use sunlight + water + CO2 to create sugar and oxygen! 🍃☀️";
  }
  
  if (q.includes('moon')) {
    return "The Moon orbits Earth every 27 days! It doesn't make its own light - it reflects sunlight! 🌙✨";
  }
  
  if (q.includes('sun') || q.includes('star')) {
    return "The Sun is a giant star - a huge ball of hot gas! It's 93 million miles away and gives us light and warmth! ☀️";
  }
  
  // READING & LANGUAGE
  if (q.includes('vowel')) {
    if (shouldGiveStrategy('vowels')) {
      return "💡 Try singing the alphabet! The vowels are the ones that sound smooth: A, E, I, O, U! Say your name - which letters are vowels? 📝";
    }
    saveQuestionType('vowels');
    return "Vowels are A, E, I, O, U (and sometimes Y)! Every word needs at least one! Try finding vowels in your name! 📝";
  }
  
  if (q.includes('consonant')) {
    if (shouldGiveStrategy('consonants')) {
      return "💡 Easy trick: Consonants are just 'not vowels'! Take the 26 letters, remove A, E, I, O, U = consonants! 🔤";
    }
    saveQuestionType('consonants');
    return "Consonants are all the letters that aren't vowels! Like B, C, D, F, G, H... There are 21 of them! 🔤";
  }
  
  if (q.includes('spell')) {
    return "Spelling tip: Sound it out slowly, break long words into chunks, and practice writing it 3 times! 📝✨";
  }
  
  if (q.includes('read') && q.includes('better')) {
    return "Reading tips: 1) Read every day! 2) Sound out tricky words 3) Ask yourself what happened in the story! Practice makes perfect! 📚💪";
  }
  
  if (q.includes('noun')) {
    if (shouldGiveStrategy('nouns')) {
      return "💡 Look around you! Point at things and say their names. Those are nouns! Can you name 5 nouns in your room? 🏷️";
    }
    saveQuestionType('nouns');
    return "A noun is a person, place, or thing! Like 'teacher', 'school', 'pencil', or 'happiness'! 🏷️";
  }
  
  if (q.includes('verb')) {
    if (shouldGiveStrategy('verbs')) {
      return "💡 Verbs are action words! Stand up and DO something. Whatever you're doing is a verb! Jump = verb! Sit = verb! Think = verb! 🏃";
    }
    saveQuestionType('verbs');
    return "A verb is an action word! Like 'run', 'jump', 'think', 'learn', or 'eat'! What are YOU doing right now? 🏃";
  }
  
  // GREETINGS
  if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
    return "Hey there! 👋 I can help with math, science, reading, and more! Ask me questions OR ask for learning strategies and study tips! What do you want to know? ✨";
  }
  
  if (q.includes('thank')) {
    return "You're so welcome! I love helping you learn! Keep those questions coming! 💙✨";
  }
  
  // ADVANCED MATH TOPICS
  if (containsAny(q, ['fraction', 'half', 'third', 'quarter'])) {
    return "Fractions show parts of a whole! 1/2 means one piece out of two equal pieces. 🍕 If you cut a pizza into 4 slices, each slice is 1/4! What do you want to know about fractions?";
  }
  
  if (containsAny(q, ['decimal', 'point'])) {
    return "Decimals are another way to show parts! 0.5 = 1/2, and 0.25 = 1/4. The numbers after the dot are the parts! 💰 Money uses decimals: $1.50 means 1 dollar and 50 cents!";
  }
  
  if (containsAny(q, ['percent', 'percentage', '%'])) {
    return "Percent means 'out of 100'! 50% = 50 out of 100 = half! 100% means all of it! 🎯 If you got 8/10 questions right, that's 80%!";
  }
  
  if (containsAny(q, ['square', 'circle', 'triangle', 'rectangle', 'shape'])) {
    return "Shapes are everywhere! 🔷 Triangles have 3 sides, squares have 4 equal sides, rectangles have 4 sides (2 long, 2 short), circles are round with no corners! What shape do you see around you?";
  }
  
  if (containsAny(q, ['angle', 'degree'])) {
    return "An angle is where two lines meet! 📐 A right angle is 90° (like a corner of a square). Bigger angles are obtuse, smaller are acute. Turn in a full circle = 360°!";
  }
  
  if (containsAny(q, ['area', 'perimeter'])) {
    return "Area is the space INSIDE a shape (length × width for rectangles). Perimeter is the distance AROUND the edge (add all sides)! 📏";
  }
  
  // WORD PROBLEMS
  if (containsAny(q, ['have', 'more', 'left', 'total']) && extractNumbers(q).length >= 2) {
    const nums = extractNumbers(q);
    if (containsAny(q, ['left', 'fewer', 'less', 'gave away', 'ate'])) {
      return `This sounds like a subtraction problem! You start with ${nums[0]}, then something changes. Try: ${nums[0]} - ${nums[1]} = ? 🤔`;
    } else if (containsAny(q, ['more', 'total', 'altogether', 'combined'])) {
      return `This sounds like an addition problem! You're combining things! Try: ${nums[0]} + ${nums[1]} = ? ✨`;
    }
  }
  
  // MORE SCIENCE
  if (containsAny(q, ['dinosaur', 'dino', 't-rex'])) {
    return "Dinosaurs were huge reptiles that lived millions of years ago! 🦕 T-Rex was a meat-eater with tiny arms. Triceratops had three horns and ate plants. They all went extinct 65 million years ago!";
  }
  
  if (containsAny(q, ['volcano', 'lava', 'magma'])) {
    return "A volcano is a mountain that can erupt! 🌋 Hot melted rock (magma) comes up from deep underground. When it comes out, we call it lava! Some volcanoes are active, some are sleeping!";
  }
  
  if (containsAny(q, ['earthquake', 'shake'])) {
    return "Earthquakes happen when Earth's crust moves suddenly! The ground shakes because huge pieces of Earth (tectonic plates) are shifting. They can be tiny or very strong!";
  }
  
  if (containsAny(q, ['rain', 'cloud', 'weather'])) {
    return "Weather is what's happening in the sky! ☁️ Clouds are made of tiny water drops. When drops get too heavy, they fall as rain! ☔ Cold enough = snow! ❄️";
  }
  
  if (containsAny(q, ['ocean', 'sea', 'wave'])) {
    return "Oceans are HUGE bodies of salt water covering most of Earth! 🌊 There are 5 oceans: Pacific, Atlantic, Indian, Arctic, and Southern. Waves are made by wind pushing the water!";
  }
  
  if (containsAny(q, ['planet', 'solar', 'mercury', 'venus', 'mars', 'jupiter'])) {
    return "Our solar system has 8 planets! 🪐 From the sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Jupiter is the biggest! Earth is the only one with life (that we know of)!";
  }
  
  if (containsAny(q, ['energy', 'power', 'electricity'])) {
    return "Energy is the power to make things happen! ⚡ Light energy lets us see, heat energy keeps us warm, electrical energy powers devices! Energy can change forms but never disappears!";
  }
  
  if (containsAny(q, ['gravity', 'fall'])) {
    return "Gravity is the force that pulls things down! 🍎 Earth's gravity keeps us on the ground and the Moon orbiting around us. Bigger objects have stronger gravity!";
  }
  
  // HISTORY & SOCIAL STUDIES
  if (containsAny(q, ['president', 'washington', 'lincoln'])) {
    return "The President leads our country! 🇺🇸 George Washington was the first. Abraham Lincoln freed slaves. Presidents serve for 4 years and can be re-elected once!";
  }
  
  if (containsAny(q, ['country', 'nation', 'america', 'usa'])) {
    return "A country is a place with its own government and borders! 🌍 The USA has 50 states. Each country has its own flag, language, and culture!";
  }
  
  // BODY & HEALTH
  if (containsAny(q, ['heart', 'blood', 'pump'])) {
    return "Your heart is a muscle that pumps blood through your body! ❤️ It beats about 100,000 times per day! Blood carries oxygen to every part of you!";
  }
  
  if (containsAny(q, ['brain', 'think', 'memory'])) {
    return "Your brain is your body's computer! 🧠 It controls everything - thinking, moving, breathing, feelings! It has billions of neurons (brain cells) working together!";
  }
  
  if (containsAny(q, ['bone', 'skeleton'])) {
    return "Your skeleton has 206 bones! 🦴 They protect organs, help you move, and make new blood cells! The smallest bone is in your ear (smaller than a grain of rice)!";
  }
  
  // MORE READING & WRITING
  if (containsAny(q, ['adjective', 'describe'])) {
    return "Adjectives describe nouns! They tell you HOW something is. 🎨 'Big dog', 'blue sky', 'happy kid' - the describing words are adjectives! Can you think of 3 adjectives for yourself?";
  }
  
  if (containsAny(q, ['adverb'])) {
    return "Adverbs describe verbs! They often end in 'ly'. 'Run QUICKLY', 'sing LOUDLY', 'think CAREFULLY' - they tell you HOW the action happens! 🏃💨";
  }
  
  if (containsAny(q, ['pronoun', 'i', 'you', 'he', 'she'])) {
    return "Pronouns replace nouns! Instead of 'Sarah', say 'she'. Instead of 'the dog', say 'it'. Common ones: I, you, he, she, it, we, they! Makes talking easier!";
  }
  
  if (containsAny(q, ['punctuation', 'period', 'comma', 'question mark'])) {
    return "Punctuation marks help us read! 📝 Period (.) = end of sentence. Question mark (?) = asking something. Comma (,) = small pause. Exclamation mark (!) = excitement!";
  }
  
  if (containsAny(q, ['capital', 'uppercase'])) {
    return "Capital letters start sentences and names! 'John' and 'Monday' need capitals. The first word in a sentence always starts with a capital! ABC vs abc! ✍️";
  }
  
  // PROBLEM SOLVING & STUDY SKILLS
  if (containsAny(q, ['stuck', 'confused', 'don\'t understand', 'hard', 'difficult'])) {
    return "Feeling stuck is part of learning! 💪 Try: 1) Break it into smaller pieces, 2) Draw a picture, 3) Use objects to help, 4) Take a 5-minute break and try again! You've got this!";
  }
  
  if (containsAny(q, ['remember', 'memorize', 'forget'])) {
    return "Memory tips! 🧠 1) Repeat it 3 times, 2) Make a silly picture in your mind, 3) Connect it to something you know, 4) Practice a little each day! Sleep helps too!";
  }
  
  if (containsAny(q, ['test', 'quiz', 'exam'])) {
    return "Test tips! 📝 1) Study a little each day (don't cram!), 2) Get good sleep, 3) Read questions carefully, 4) Check your work, 5) Stay calm - you know more than you think! 🌟";
  }
  
  // HOW QUESTIONS - Smart context-aware handler
  if (questionType === 'how') {
    // Check for specific subjects in the question
    if (containsAny(q, ['solve', 'calculate', 'math', 'problem'])) {
      return "To solve a math problem: 1) Read it carefully, 2) Find the numbers, 3) Figure out if you're adding, subtracting, multiplying, or dividing, 4) Do the math, 5) Check if your answer makes sense! 🧮";
    }
    if (containsAny(q, ['spell', 'write'])) {
      return "To spell better: 1) Sound it out slowly, 2) Break long words into chunks, 3) Look for patterns (like 'tion' or 'ing'), 4) Write it 3 times, 5) Make up a silly memory trick! 📝";
    }
    return "Great 'how' question! 🤔 Here's my thinking strategy: 1) Break it into steps, 2) Try a simple example first, 3) Build up to the harder stuff! Can you tell me more about what you're trying to do? 💡";
  }
  
  // WHY QUESTIONS - Smart context-aware handler  
  if (questionType === 'why') {
    if (containsAny(q, ['important', 'need', 'should'])) {
      return "Great question about WHY it matters! 🌟 Think about: What would happen if we DIDN'T do it? Who does it help? What problem does it solve? Understanding the 'why' helps you remember better!";
    }
    return "Love the curiosity! 🌟 'Why' questions help us understand! Think about: What happens? What causes it? What would change if it was different? Let's explore that together! 🔍";
  }
  
  // WHAT QUESTIONS - Smart context-aware handler
  if (questionType === 'what') {
    return "Good question! 🎯 When asking 'what', think about: What category is it? What does it do? What's it made of? Can you be more specific about what part you're curious about? 💭";
  }
  
  // SMART DEFAULT - Analyze what they might be asking about
  // Check for numbers - might be math
  const numbers = extractNumbers(q);
  if (numbers.length > 0) {
    return `I see numbers in your question (${numbers.join(', ')})! Is this a math problem? Try asking like: '${numbers[0]} + ${numbers[1] || numbers[0]} = ?' or tell me what you're trying to figure out! 🔢`;
  }
  
  // Check for common topics
  if (containsAny(q, ['learn', 'teach', 'explain', 'tell'])) {
    return "I'd love to teach you about that! 🌟 To give you the best answer, can you be more specific? For example: 'What are fractions?' or 'How do plants grow?' or 'Why is water important?' 💭";
  }
  
  // Encouraging response for any other question
  return "Interesting question! 🌟 I want to help you find the answer! Try: 1) Breaking it into smaller questions, 2) Thinking of what you already know, 3) Making a guess and testing it! What do YOU think might be the answer? 🤔💡\n\nOr rephrase it to ask: 'What is...?' or 'How do I...?' or 'Why does...?'";
}


export default function TutorChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I&apos;m your Tutor! 🤖 I can help with math (even BIG numbers!), science, reading, history, grammar, and tons more! I can solve problems, explain concepts, and teach you learning strategies! Ask me anything! ✨",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isThinking) return;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    }]);
    
    const question = input;
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getResponse(question),
        timestamp: Date.now()
      }]);
      setIsThinking(false);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tutorQuestionHistory');
      alert('✨ History reset! I\'ll give you full answers again!');
    }
  };

  const quickQuestions = [
    "What is 12 + 8?",
    "What is 456 + 789?",
    "Give me a strategy for multiplication",
    "What is 25 × 12?",
    "How do I study better?",
    "What are dinosaurs?",
    "Teach me about fractions",
    "Why is the sky blue?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-t-3xl shadow-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-bounce">🤖</div>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Tutor AI
              </h1>
              <p className="text-gray-600">Handles ANY size numbers + learning strategies! 100% local! ✨</p>
            </div>
            <button
              onClick={resetHistory}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg text-sm"
            >
              🔄 Reset History
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white/90 backdrop-blur-sm overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="text-2xl mb-2">🤖</div>
                )}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  <span className="text-gray-600">Thinking</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions (show only when chat is empty) */}
        {messages.length <= 1 && (
          <div className="bg-white/90 backdrop-blur-sm p-4">
            <p className="text-sm text-gray-600 font-bold mb-3">💡 Try asking:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="text-left text-sm bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 p-3 rounded-lg transition-all duration-200 border border-gray-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white/95 backdrop-blur-sm rounded-b-3xl shadow-2xl p-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me a question... 🤔"
              disabled={isThinking}
              className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Send 🚀
            </button>
          </div>
          
          {/* Stats */}
          <div className="mt-4 flex justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              100% Local AI
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              No Internet Needed
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full" />
              {messages.length} Messages
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
