interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TopicLesson {
  id: number;
  title: string;
  icon: string;
  description: string;
  content: string[];
  questions: Question[];
}

export const lessons: { [key: number]: TopicLesson } = {
  101: {
    id: 101,
    title: 'Understanding Place Value',
    icon: '1️⃣',
    description: 'Learn about ones, tens, hundreds, and thousands',
    content: [
      "Hi! Today we're learning about place value - where each digit sits in a number!",
      "Place value is one of the most important ideas in all of math!",
      "Every digit in a number has a VALUE based on where it sits!",
      "Let's start small. Look at the number 5. It's just 5 ones!",
      "Now look at 52. The 2 is in the ones place, meaning 2 ones.",
      "But the 5 is in the TENS place! It means 5 tens, which is 50!",
      "So 52 = 50 + 2. We're breaking the number into parts!",
      "Let's go bigger! Look at the number 347.",
      "The 7 is in the ONES place. That's 7 ones.",
      "The 4 is in the TENS place. That's 4 tens, or 40!",
      "The 3 is in the HUNDREDS place. That's 3 hundreds, or 300!",
      "So 347 = 300 + 40 + 7. See how we broke it down?",
      "Now let's go even BIGGER! Look at 3,456!",
      "The 6 is in the ONES place. It means 6 ones.",
      "The 5 is in the TENS place. It means 5 tens, or 50!",
      "The 4 is in the HUNDREDS place. It means 4 hundreds, or 400!",
      "The 3 is in the THOUSANDS place. It means 3 thousands, or 3,000!",
      "So 3,456 = 3,000 + 400 + 50 + 6. Amazing!",
      "Each place is 10 times bigger as you go left!",
      "Ones → Tens (10) → Hundreds (100) → Thousands (1,000)!",
      "This pattern goes on: Ten thousands, Hundred thousands, Millions!",
      "The place of each digit tells us its value. That's place value!",
      "Place value helps us understand big numbers and do math!",
      "Great job learning! Now let's practice with some questions!"
    ],
    questions: [
      {
        question: "In the number 5,234, what place is the 2 in?",
        options: ["Ones", "Tens", "Hundreds", "Thousands"],
        correctAnswer: 2,
        explanation: "The 2 is in the hundreds place! It represents 200."
      },
      {
        question: "What is the value of the 7 in 1,789?",
        options: ["7", "70", "700", "7,000"],
        correctAnswer: 2,
        explanation: "The 7 is in the hundreds place, so it's worth 700!"
      },
      {
        question: "Which number has 4 in the tens place?",
        options: ["4,321", "1,234", "3,412", "2,143"],
        correctAnswer: 3,
        explanation: "In 2,143, the 4 is in the tens place! The others have 4 in different places."
      },
      {
        question: "What does the 9 represent in 9,876?",
        options: ["9 ones", "9 tens", "9 hundreds", "9 thousands"],
        correctAnswer: 3,
        explanation: "The 9 is in the thousands place, so it represents 9,000!"
      },
      {
        question: "How much bigger is the tens place than the ones place?",
        options: ["2 times", "5 times", "10 times", "100 times"],
        correctAnswer: 2,
        explanation: "The tens place is 10 times bigger than the ones place!"
      },
      {
        question: "In 6,543, what is the value of the 5?",
        options: ["5", "50", "500", "5,000"],
        correctAnswer: 2,
        explanation: "The 5 is in the hundreds place, so its value is 500!"
      },
      {
        question: "Which digit is in the ones place in 2,849?",
        options: ["2", "8", "4", "9"],
        correctAnswer: 3,
        explanation: "The 9 is in the ones place - it's the rightmost digit!"
      },
      {
        question: "What number is 4 thousands + 2 hundreds + 3 tens + 7 ones?",
        options: ["4,237", "7,324", "2,437", "3,427"],
        correctAnswer: 0,
        explanation: "4,000 + 200 + 30 + 7 = 4,237!"
      }
    ]
  },
  102: {
    id: 102,
    title: 'Addition Strategies',
    icon: '➕',
    description: 'Different ways to add numbers quickly',
    content: [
      "Welcome! Today we're learning amazing strategies to add numbers faster!",
      "Addition is combining numbers together to find the total!",
      "There are many different ways to add - let's learn them all!",
      "Strategy 1: COUNT ON! This works great for adding small numbers!",
      "If you have 47 + 5, start at the bigger number (47) and count up!",
      "47... 48, 49, 50, 51, 52! The answer is 52!",
      "Try another: 83 + 4. Start at 83: 84, 85, 86, 87. That's 87!",
      "Counting on is easy when you're adding 1, 2, 3, 4, or 5!",
      "Strategy 2: MAKE A TEN! This is super helpful!",
      "Our brains love working with 10s - they're easier!",
      "For 8 + 7, think: How can I make 10 first?",
      "8 needs 2 more to make 10. So take 2 from the 7!",
      "8 + 2 = 10, and we have 5 left from the 7!",
      "So 10 + 5 = 15! That's your answer!",
      "Try 9 + 6. 9 + 1 = 10, then 10 + 5 = 15!",
      "Strategy 3: BREAK IT APART! Also called decomposing!",
      "For bigger numbers like 23 + 15, break them into tens and ones!",
      "23 = 20 + 3, and 15 = 10 + 5!",
      "Add the tens: 20 + 10 = 30!",
      "Add the ones: 3 + 5 = 8!",
      "Put them together: 30 + 8 = 38!",
      "This works for any size numbers!",
      "Strategy 4: DOUBLES! These are numbers added to themselves!",
      "Memorize these: 1+1=2, 2+2=4, 3+3=6, 4+4=8, 5+5=10!",
      "Also: 6+6=12, 7+7=14, 8+8=16, 9+9=18, 10+10=20!",
      "Strategy 5: NEAR DOUBLES! Use doubles to help!",
      "If you see 7 + 8, think: I know 7 + 7 = 14!",
      "8 is just 1 more than 7, so 7 + 8 = 14 + 1 = 15!",
      "Or for 6 + 7: You know 6 + 6 = 12, so 6 + 7 = 13!",
      "Pick the strategy that feels easiest for each problem!",
      "Some problems work better with different strategies!",
      "The more you practice, the faster you'll get!",
      "Soon you'll be an addition expert! Let's practice!"
    ],
    questions: [
      {
        question: "What is 8 + 7 using the 'make a ten' strategy?",
        options: ["14", "15", "16", "17"],
        correctAnswer: 1,
        explanation: "8 + 2 = 10, then 10 + 5 = 15! You broke the 7 into 2 and 5."
      },
      {
        question: "Using 'break it apart', what is 34 + 25?",
        options: ["57", "58", "59", "60"],
        correctAnswer: 2,
        explanation: "30 + 20 = 50, then 4 + 5 = 9, so 50 + 9 = 59!"
      },
      {
        question: "If 6 + 6 = 12, what is 6 + 7?",
        options: ["12", "13", "14", "15"],
        correctAnswer: 1,
        explanation: "Since 6 + 6 = 12, then 6 + 7 is just one more, which is 13!"
      },
      {
        question: "Using count on, what is 56 + 3?",
        options: ["58", "59", "60", "61"],
        correctAnswer: 1,
        explanation: "Start at 56 and count: 57, 58, 59! The answer is 59!"
      },
      {
        question: "What is 9 + 8 using near doubles?",
        options: ["15", "16", "17", "18"],
        correctAnswer: 2,
        explanation: "9 + 9 = 18, but 8 is one less, so 9 + 8 = 17!"
      },
      {
        question: "Using make a ten, what is 7 + 6?",
        options: ["12", "13", "14", "15"],
        correctAnswer: 1,
        explanation: "7 + 3 = 10, then 10 + 3 = 13! (We split the 6 into 3 and 3)"
      },
      {
        question: "What is 45 + 32 using break it apart?",
        options: ["76", "77", "78", "79"],
        correctAnswer: 1,
        explanation: "40 + 30 = 70, then 5 + 2 = 7, so 70 + 7 = 77!"
      },
      {
        question: "Which double equals 16?",
        options: ["7 + 7", "8 + 8", "9 + 9", "6 + 6"],
        correctAnswer: 1,
        explanation: "8 + 8 = 16! That's a double you should memorize!"
      }
    ]
  },
  103: {
    id: 103,
    title: 'Subtraction Mastery',
    icon: '➖',
    description: 'Master taking numbers away',
    content: [
      "Hello! Today we're mastering subtraction - taking numbers away!",
      "Subtraction is the opposite of addition!",
      "Think of subtraction as 'how many are left' or 'what's the difference'!",
      "If you have 10 apples and eat 3, how many are left? 10 - 3 = 7!",
      "Strategy 1: COUNT BACK! Start at the big number and count down!",
      "For 15 - 3, start at 15 and count back: 14, 13, 12!",
      "The answer is 12! Easy!",
      "Try 28 - 4. Count back: 27, 26, 25, 24. Answer: 24!",
      "Counting back works great for subtracting small numbers!",
      "Strategy 2: THINK ADDITION! This is really clever!",
      "For 12 - 5, ask yourself: 5 + ? = 12",
      "What do you add to 5 to get 12? That's 7!",
      "So 12 - 5 = 7! You used addition to subtract!",
      "This works because addition and subtraction are opposites!",
      "Try 16 - 9. Think: 9 + ? = 16. That's 7! So 16 - 9 = 7!",
      "Strategy 3: USE A NUMBER LINE! Draw or imagine a line!",
      "For 20 - 6, start at 20 and jump back 6 spaces!",
      "You land on 14! That's your answer!",
      "Strategy 4: BREAK IT APART! Like we did with addition!",
      "For bigger numbers like 45 - 23, break the 23 into 20 and 3!",
      "First: 45 - 20 = 25",
      "Then: 25 - 3 = 22!",
      "So 45 - 23 = 22!",
      "Strategy 5: FACT FAMILIES! These are related facts!",
      "If you know 8 + 5 = 13, then you also know:",
      "13 - 5 = 8 and 13 - 8 = 5!",
      "They're all in the same family!",
      "Knowing your addition facts helps you subtract faster!",
      "Remember: Subtraction is just backwards addition!",
      "The more you practice, the easier it gets!",
      "Let's test what you learned!"
    ],
    questions: [
      {
        question: "What is 17 - 9?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2,
        explanation: "Think: 9 + 8 = 17, so 17 - 9 = 8!"
      },
      {
        question: "Using 'break it apart', what is 54 - 32?",
        options: ["20", "21", "22", "23"],
        correctAnswer: 2,
        explanation: "54 - 30 = 24, then 24 - 2 = 22!"
      },
      {
        question: "If 7 + 6 = 13, what is 13 - 7?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 1,
        explanation: "Since 7 + 6 = 13, then 13 - 7 = 6!"
      },
      {
        question: "Using count back, what is 25 - 4?",
        options: ["19", "20", "21", "22"],
        correctAnswer: 2,
        explanation: "Count back from 25: 24, 23, 22, 21. The answer is 21!"
      },
      {
        question: "What is 14 - 6 using think addition?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2,
        explanation: "Think: 6 + ? = 14. That's 8! So 14 - 6 = 8!"
      },
      {
        question: "What is 38 - 15 using break it apart?",
        options: ["21", "22", "23", "24"],
        correctAnswer: 2,
        explanation: "38 - 10 = 28, then 28 - 5 = 23!"
      },
      {
        question: "If 9 + 4 = 13, what is 13 - 4?",
        options: ["7", "8", "9", "10"],
        correctAnswer: 2,
        explanation: "They're in the same fact family! 13 - 4 = 9!"
      },
      {
        question: "What is 50 - 8?",
        options: ["40", "41", "42", "43"],
        correctAnswer: 2,
        explanation: "Think: 8 + 42 = 50, so 50 - 8 = 42!"
      }
    ]
  },
  104: {
    id: 104,
    title: 'Multiplication Tables',
    icon: '✖️',
    description: 'Learn your times tables',
    content: [
      "Welcome to multiplication! This is a super useful math shortcut!",
      "Multiplication is REPEATED ADDITION!",
      "Instead of adding 3 + 3 + 3 + 3, we can say 4 × 3!",
      "4 × 3 means '4 groups of 3' or 'add 3 four times'!",
      "Let's learn the multiplication tables step by step!",
      "The 1s are super easy! Anything times 1 is itself!",
      "1×1=1, 1×2=2, 1×3=3, 1×4=4... you get it!",
      "The 2s are just doubles! Add the number to itself!",
      "2×1=2, 2×2=4, 2×3=6, 2×4=8, 2×5=10!",
      "Keep going: 2×6=12, 2×7=14, 2×8=16, 2×9=18, 2×10=20!",
      "The 5s have a pattern! They always end in 0 or 5!",
      "5×1=5, 5×2=10, 5×3=15, 5×4=20, 5×5=25!",
      "5×6=30, 5×7=35, 5×8=40, 5×9=45, 5×10=50!",
      "The 10s are amazing! Just add a zero to the end!",
      "10×1=10, 10×2=20, 10×3=30, 10×4=40!",
      "10×5=50, 10×6=60, 10×7=70, 10×8=80, 10×9=90, 10×10=100!",
      "Now the 3s! These take practice but you can do it!",
      "3×1=3, 3×2=6, 3×3=9, 3×4=12, 3×5=15!",
      "3×6=18, 3×7=21, 3×8=24, 3×9=27, 3×10=30!",
      "The 4s are like doubling the 2s!",
      "4×1=4, 4×2=8, 4×3=12, 4×4=16, 4×5=20!",
      "4×6=24, 4×7=28, 4×8=32, 4×9=36, 4×10=40!",
      "Here's a COOL TRICK: 3 × 4 is the same as 4 × 3!",
      "You can flip multiplication around! It's called the commutative property!",
      "So if you know 7 × 3 = 21, then you also know 3 × 7 = 21!",
      "SQUARES are fun! A number times itself!",
      "1×1=1, 2×2=4, 3×3=9, 4×4=16, 5×5=25!",
      "6×6=36, 7×7=49, 8×8=64, 9×9=81, 10×10=100!",
      "Practice these every day and you'll memorize them!",
      "Multiplication makes math SO much faster!",
      "You'll use these for the rest of your life!",
      "Let's see how much you remember!"
    ],
    questions: [
      {
        question: "What is 7 × 3?",
        options: ["18", "19", "20", "21"],
        correctAnswer: 3,
        explanation: "7 × 3 = 21. You can think of it as 7 + 7 + 7!"
      },
      {
        question: "What is 6 × 4?",
        options: ["20", "22", "24", "26"],
        correctAnswer: 2,
        explanation: "6 × 4 = 24. That's the same as 4 × 6!"
      },
      {
        question: "What is 9 × 5?",
        options: ["40", "42", "45", "50"],
        correctAnswer: 2,
        explanation: "9 × 5 = 45. The 5s always end in 0 or 5!"
      },
      {
        question: "What is 8 × 8?",
        options: ["56", "64", "72", "80"],
        correctAnswer: 1,
        explanation: "8 × 8 = 64. That's a square number!"
      },
      {
        question: "If 4 × 7 = 28, what is 7 × 4?",
        options: ["24", "28", "32", "35"],
        correctAnswer: 1,
        explanation: "7 × 4 = 28 too! You can flip multiplication around!"
      },
      {
        question: "What is 10 × 6?",
        options: ["16", "50", "60", "66"],
        correctAnswer: 2,
        explanation: "10 × 6 = 60. Just add a zero to 6!"
      },
      {
        question: "What is 3 × 9?",
        options: ["24", "27", "30", "33"],
        correctAnswer: 1,
        explanation: "3 × 9 = 27!"
      },
      {
        question: "What is 5 × 7?",
        options: ["30", "32", "35", "40"],
        correctAnswer: 2,
        explanation: "5 × 7 = 35. Remember, 5s end in 0 or 5!"
      }
    ]
  },
  105: {
    id: 105,
    title: 'Division Methods',
    icon: '➗',
    description: 'How to divide numbers into groups',
    content: [
      "Hi! Today we're learning division - sharing things equally!",
      "Division is splitting a number into equal groups!",
      "Division asks two questions: How many groups? Or how many in each group?",
      "Let's start with an example: You have 12 cookies and 3 friends!",
      "12 ÷ 3 means 'split 12 into 3 equal groups'!",
      "Each friend gets 4 cookies! So 12 ÷ 3 = 4!",
      "Division is the OPPOSITE of multiplication!",
      "They work together, just like addition and subtraction!",
      "If you know 3 × 4 = 12, then you know 12 ÷ 3 = 4!",
      "And you also know 12 ÷ 4 = 3! They're all related!",
      "This is called a FACT FAMILY!",
      "The fact family for 3, 4, and 12 is:",
      "3 × 4 = 12, 4 × 3 = 12, 12 ÷ 3 = 4, and 12 ÷ 4 = 3!",
      "Knowing your multiplication tables helps you divide!",
      "Strategy 1: THINK MULTIPLICATION!",
      "For 24 ÷ 4, ask: 4 × ? = 24",
      "You know 4 × 6 = 24, so 24 ÷ 4 = 6!",
      "Try 35 ÷ 5. Think: 5 × ? = 35. That's 7! So 35 ÷ 5 = 7!",
      "Strategy 2: REPEATED SUBTRACTION!",
      "For 15 ÷ 3, keep subtracting 3 until you reach 0!",
      "15 - 3 = 12, 12 - 3 = 9, 9 - 3 = 6, 6 - 3 = 3, 3 - 3 = 0!",
      "How many times did we subtract? 5 times! So 15 ÷ 3 = 5!",
      "Strategy 3: SHARE IT OUT!",
      "For 20 ÷ 4, imagine dealing out 20 items to 4 people!",
      "Give 1 to each person, then 1 more, then 1 more...",
      "Each person gets 5! So 20 ÷ 4 = 5!",
      "SPECIAL RULE: You can NEVER divide by zero!",
      "Why? Because zero times any number is zero!",
      "There's no number that makes sense for 8 ÷ 0!",
      "Remember: Any number divided by 1 equals itself!",
      "And any number divided by itself equals 1!",
      "Division is super useful in real life - sharing pizza, splitting bills, measuring!",
      "Practice with your multiplication facts and division gets easy!",
      "Let's test your division skills!"
    ],
    questions: [
      {
        question: "What is 18 ÷ 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: 2,
        explanation: "18 ÷ 3 = 6 because 3 × 6 = 18!"
      },
      {
        question: "What is 35 ÷ 5?",
        options: ["5", "6", "7", "8"],
        correctAnswer: 2,
        explanation: "35 ÷ 5 = 7 because 5 × 7 = 35!"
      },
      {
        question: "If 8 × 6 = 48, what is 48 ÷ 6?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2,
        explanation: "48 ÷ 6 = 8! Division is the opposite of multiplication!"
      },
      {
        question: "What is 27 ÷ 9?",
        options: ["2", "3", "4", "5"],
        correctAnswer: 1,
        explanation: "27 ÷ 9 = 3 because 9 × 3 = 27!"
      },
      {
        question: "What is 42 ÷ 6?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 1,
        explanation: "42 ÷ 6 = 7 because 6 × 7 = 42!"
      },
      {
        question: "What is 56 ÷ 8?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 1,
        explanation: "56 ÷ 8 = 7 because 8 × 7 = 56!"
      },
      {
        question: "What is any number divided by 1?",
        options: ["0", "1", "The number itself", "Impossible"],
        correctAnswer: 2,
        explanation: "Any number divided by 1 equals itself! Like 10 ÷ 1 = 10!"
      },
      {
        question: "If 7 × 8 = 56, what is 56 ÷ 7?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2,
        explanation: "56 ÷ 7 = 8! They're in the same fact family!"
      }
    ]
  },
  // Fractions & Decimals Unit (201-205)
  201: {
    id: 201,
    title: 'Introduction to Fractions',
    icon: '🍕',
    description: 'Understanding parts of a whole',
    content: [
      "Welcome to the world of fractions! 🍕",
      "Imagine you and your best friend want to share a cookie!",
      "You break it into 2 equal pieces - each piece is ONE-HALF!",
      "That's what fractions are - parts of a whole thing!",
      "Every fraction has TWO special numbers!",
      "The TOP number is called the NUMERATOR!",
      "The BOTTOM number is called the DENOMINATOR!",
      "Let's look at 3/4. The 4 is on the bottom, so it's the denominator!",
      "The denominator tells us: How many EQUAL pieces is the whole thing divided into?",
      "So 3/4 means the whole is split into 4 equal pieces!",
      "Now the numerator! That's the 3 on top!",
      "The numerator tells us: How many pieces do we HAVE?",
      "So 3/4 means we have 3 pieces out of the 4 total pieces!",
      "Let's try with PIZZA! 🍕",
      "Imagine a pizza cut into 8 equal slices!",
      "The denominator is 8 - there are 8 slices total!",
      "If you eat 3 slices, you ate 3/8 of the pizza!",
      "The numerator is 3 - you ate 3 pieces!",
      "Your friend eats 2 slices - they ate 2/8!",
      "Together you ate 5/8 of the pizza! 3 + 2 = 5 slices!",
      "There are 3 slices left - that's 3/8 remaining!",
      "Let's talk about special fractions!",
      "1/2 is called ONE-HALF. It means 1 out of 2 equal parts!",
      "Half is when you split something into 2 equal pieces!",
      "1/4 is called ONE-QUARTER. It means 1 out of 4 equal parts!",
      "Quarters are like the 4 corners of a square!",
      "1/3 is called ONE-THIRD. It means 1 out of 3 equal parts!",
      "When the numerator is 1, we use words like 'half,' 'third,' 'quarter'!",
      "But 3/4 is 'three-quarters' - we have 3 of the quarters!",
      "2/3 is 'two-thirds' - we have 2 of the thirds!",
      "Here's a cool trick: If the numerator equals the denominator, you have the WHOLE thing!",
      "Like 4/4 = 1 whole! You have all 4 pieces out of 4!",
      "8/8 = 1 whole pizza! Every single slice!",
      "Fractions are everywhere in real life!",
      "When you drink half a glass of milk - that's 1/2!",
      "When you complete 3 out of 5 homework problems - that's 3/5!",
      "When you sleep 1/3 of the day - that's 8 hours out of 24!",
      "Fractions help us share things fairly!",
      "They help us measure ingredients for cooking!",
      "They help us tell time - a quarter past the hour means 15 minutes (1/4 of 60)!",
      "Remember: DENOMINATOR = how many pieces total (bottom)!",
      "NUMERATOR = how many pieces we have (top)!",
      "Now let's practice with some fraction questions!"
    ],
    questions: [
      {
        question: "If you eat 3 slices of a pizza cut into 8 slices, what fraction did you eat?",
        options: ["3/8", "8/3", "3/5", "5/8"],
        correctAnswer: 0,
        explanation: "You ate 3 out of 8 slices, so that's 3/8! The numerator is what you ate, the denominator is the total!"
      },
      {
        question: "What does the bottom number in a fraction tell us?",
        options: ["How many you have", "How many equal parts total", "How many you ate", "The biggest number"],
        correctAnswer: 1,
        explanation: "The bottom number (denominator) shows how many equal parts the whole is divided into!"
      },
      {
        question: "Which fraction means half?",
        options: ["1/4", "1/2", "2/4", "Both B and C"],
        correctAnswer: 3,
        explanation: "Both 1/2 and 2/4 equal half! They're equivalent fractions - two ways of saying the same thing!"
      },
      {
        question: "In the fraction 5/6, what is the numerator?",
        options: ["5", "6", "11", "1"],
        correctAnswer: 0,
        explanation: "The numerator is the top number, which is 5! It tells us we have 5 pieces!"
      },
      {
        question: "If a chocolate bar has 10 pieces and you eat 7, what fraction did you eat?",
        options: ["7/10", "10/7", "7/17", "3/10"],
        correctAnswer: 0,
        explanation: "You ate 7 out of 10 pieces, so you ate 7/10 of the chocolate bar!"
      },
      {
        question: "What fraction represents one whole?",
        options: ["1/1", "5/5", "100/100", "All of these"],
        correctAnswer: 3,
        explanation: "All of these equal one whole! When numerator = denominator, you have all the pieces!"
      },
      {
        question: "If you drink 4 out of 6 glasses of water, what fraction is LEFT?",
        options: ["4/6", "2/6", "6/4", "10/6"],
        correctAnswer: 1,
        explanation: "If you drank 4 out of 6, then 2 out of 6 remain! That's 2/6 left (or 1/3 simplified)!"
      },
      {
        question: "What is one-quarter as a fraction?",
        options: ["1/2", "1/3", "1/4", "1/5"],
        correctAnswer: 2,
        explanation: "One-quarter means 1 out of 4 equal parts, which is written as 1/4!"
      }
    ]
  },

};
