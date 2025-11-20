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
  201: {
    id: 201,
    title: 'Introduction to Fractions',
    icon: '🍕',
    description: 'Understanding parts of a whole',
    content: [
      "Welcome to the amazing world of fractions! 🍕 Get ready to learn something SUPER useful!",
      "Fractions are everywhere - in cooking, sharing pizza, measuring, and even video games!",
      "But what IS a fraction? Let's find out!",
      "A fraction is a way to show PART of something!",
      "Imagine you have a whole pizza. That's ONE whole pizza!",
      "Now cut it in half. Each piece is a FRACTION of the pizza!",
      "Each half is written as 1/2 - we say 'one half'!",
      "The top number (1) is called the NUMERATOR - it's HOW MANY pieces you have!",
      "The bottom number (2) is called the DENOMINATOR - it's HOW MANY pieces the whole is divided into!",
      "So 1/2 means: 1 piece out of 2 total pieces!",
      "Let's try more examples! Cut a pizza into 4 equal pieces!",
      "Each piece is 1/4 - one quarter! You have 1 piece out of 4!",
      "If you eat 2 pieces, you ate 2/4 - two quarters!",
      "The numerator (top) tells you what you HAVE!",
      "The denominator (bottom) tells you what the whole was divided INTO!",
      "Imagine a chocolate bar with 8 squares!",
      "If you eat 3 squares, you ate 3/8 of the bar!",
      "You had 3 pieces (numerator) out of 8 total squares (denominator)!",
      "Here's a cool pattern: The BIGGER the denominator, the SMALLER each piece!",
      "1/2 of a pizza is BIGGER than 1/8 of a pizza!",
      "Why? Because cutting into 2 pieces = big pieces! Cutting into 8 pieces = tiny pieces!",
      "Think of it like this: Would you rather have 1/2 or 1/10 of a candy bar?",
      "1/2 is HALF - that's a lot! 1/10 is just a tiny piece!",
      "Let's practice reading fractions! 3/4 = 'three fourths' or 'three quarters'!",
      "5/6 = 'five sixths'! 7/8 = 'seven eighths'!",
      "The denominator tells you the SIZE of the pieces! (fourths, sixths, eighths)",
      "The numerator tells you HOW MANY pieces you're talking about!",
      "Special fractions: When the numerator equals the denominator, you have ONE WHOLE!",
      "Like 4/4 = 1 whole! 8/8 = 1 whole! 100/100 = 1 whole!",
      "When the numerator is BIGGER than denominator, you have MORE than one whole!",
      "Like 5/4 means you have 5 pieces, but only 4 pieces make a whole!",
      "So 5/4 = 1 whole pizza plus 1/4 more! (We'll learn more about this later!)",
      "Real-world fractions are EVERYWHERE!",
      "Cooking: 1/2 cup of sugar, 3/4 teaspoon of salt!",
      "Time: 1/4 of an hour = 15 minutes! 1/2 hour = 30 minutes!",
      "Money: 1/4 of a dollar = 25 cents (a quarter)!",
      "School: You finished 3/5 of your homework!",
      "Sports: Your team won 7/10 of their games!",
      "Let's visualize fractions with shapes!",
      "Draw a circle, divide it into 3 equal parts - each part is 1/3!",
      "Shade 2 parts - you've shaded 2/3!",
      "Draw a rectangle, divide into 5 parts - each is 1/5!",
      "Fractions help us be PRECISE about amounts!",
      "Instead of saying 'some pizza', we can say EXACTLY '3/8 of the pizza'!",
      "Remember: Numerator = HOW MANY pieces! Denominator = SIZE of pieces!",
      "Pro tip: The denominator is down below (think D for Down!)!",
      "The numerator is up (think N for... uNder the line? Okay that doesn't work, but it's on top!)!",
      "You're now ready to use fractions! Let's practice!"
    ],
    questions: [
      {
        question: "In the fraction 3/4, what is the numerator?",
        options: ["3", "4", "7", "12"],
        correctAnswer: 0,
        explanation: "The numerator is the TOP number! In 3/4, the 3 is on top, so 3 is the numerator!"
      },
      {
        question: "In the fraction 5/8, what is the denominator?",
        options: ["5", "13", "8", "40"],
        correctAnswer: 2,
        explanation: "The denominator is the BOTTOM number! In 5/8, the 8 is on bottom, so 8 is the denominator!"
      },
      {
        question: "If you cut a pizza into 6 equal slices and eat 2, what fraction did you eat?",
        options: ["6/2", "2/6", "8/6", "2/8"],
        correctAnswer: 1,
        explanation: "You ate 2 slices (numerator) out of 6 total slices (denominator), so you ate 2/6!"
      },
      {
        question: "Which fraction means 'one half'?",
        options: ["2/1", "1/2", "2/2", "1/1"],
        correctAnswer: 1,
        explanation: "1/2 means one out of two pieces - that's one half!"
      },
      {
        question: "If a chocolate bar has 10 squares and you eat 7, what fraction did you eat?",
        options: ["10/7", "7/10", "3/10", "17/10"],
        correctAnswer: 1,
        explanation: "You ate 7 squares out of 10 total, so that's 7/10!"
      },
      {
        question: "Which fraction represents ONE WHOLE?",
        options: ["1/2", "5/5", "3/4", "0/8"],
        correctAnswer: 1,
        explanation: "When the numerator equals the denominator (5/5), you have ALL the pieces - that's one whole!"
      },
      {
        question: "Which is bigger: 1/2 or 1/8?",
        options: ["1/2", "1/8", "They're equal", "Can't tell"],
        correctAnswer: 0,
        explanation: "1/2 is bigger! Cutting into 2 pieces makes BIGGER pieces than cutting into 8 pieces!"
      },
      {
        question: "The denominator tells you:",
        options: ["How many pieces you have", "How many pieces the whole is divided into", "The total sum", "What you ate"],
        correctAnswer: 1,
        explanation: "The denominator (bottom number) tells you how many equal pieces the whole thing was divided into!"
      }
    ]
  },
  202: {
    id: 202,
    title: 'Equivalent Fractions',
    icon: '⚖️',
    description: 'Fractions that are equal',
    content: [
      "Ready for some fraction magic? ⚖️ Some fractions LOOK different but are EQUAL!",
      "This is one of the coolest secrets in math!",
      "Look at 1/2. It's half of something, right?",
      "But 2/4 is ALSO half! And 3/6! And 4/8! And 5/10!",
      "They all look different, but they're the SAME AMOUNT!",
      "These are called EQUIVALENT FRACTIONS - fractions that are equal!",
      "Let's understand WHY they're equal!",
      "Imagine a sandwich cut in half - that's 1/2!",
      "Now imagine that same sandwich, but you cut each half in half again!",
      "Now you have 4 pieces total, and you still have 2 pieces - that's 2/4!",
      "It's the SAME amount of sandwich, just cut differently!",
      "The secret rule: MULTIPLY OR DIVIDE TOP AND BOTTOM BY THE SAME NUMBER!",
      "Let's try: Start with 1/2!",
      "Multiply both numbers by 2: (1×2)/(2×2) = 2/4! Equivalent!",
      "Multiply both by 3: (1×3)/(2×3) = 3/6! Still equivalent!",
      "Multiply both by 4: (1×4)/(2×4) = 4/8! Also equivalent!",
      "All these fractions equal HALF!",
      "Let's try another: 2/3!",
      "Multiply top and bottom by 2: (2×2)/(3×2) = 4/6!",
      "So 2/3 = 4/6! They're equivalent!",
      "Multiply by 3: (2×3)/(3×3) = 6/9! Also equivalent to 2/3!",
      "Now let's go BACKWARDS - this is called SIMPLIFYING!",
      "Start with 6/8. Can we make it simpler?",
      "Both 6 and 8 can be divided by 2!",
      "(6÷2)/(8÷2) = 3/4! We simplified 6/8 to 3/4!",
      "They're equivalent, but 3/4 is simpler - smaller numbers!",
      "Try 4/12. Both divide by 4!",
      "(4÷4)/(12÷4) = 1/3! We simplified 4/12 down to 1/3!",
      "The SIMPLEST form is when you can't divide anymore!",
      "Like 3/5 - you can't divide both by the same number, so it's already simple!",
      "Here's a pattern: 1/2 = 2/4 = 3/6 = 4/8 = 5/10 = 6/12!",
      "All these equal HALF! Cool, right?",
      "Another pattern: 1/3 = 2/6 = 3/9 = 4/12 = 5/15!",
      "All these equal ONE-THIRD!",
      "Why is this useful? It helps us compare fractions!",
      "Is 2/4 bigger than 3/6? Well, 2/4 = 1/2 and 3/6 = 1/2, so they're EQUAL!",
      "It also helps us add fractions (we'll learn that soon)!",
      "Real life example: You eat 2/8 of a pizza, your friend eats 1/4!",
      "Actually, 2/8 = 1/4! You ate the same amount!",
      "Another example: You finish 3/6 of your homework, your sibling finishes 1/2!",
      "3/6 = 1/2! You both finished the same fraction!",
      "How to check if fractions are equivalent:",
      "Cross-multiply! For 2/3 and 4/6: 2×6 = 12 and 3×4 = 12!",
      "If you get the same number, they're equivalent!",
      "Try 3/4 and 6/8: 3×8 = 24 and 4×6 = 24! They're equivalent!",
      "Remember: Same thing to top and bottom keeps the fraction equal!",
      "Multiply or divide - just do it to BOTH numbers!",
      "Now you're a fraction magician! Let's practice!",
    ],
    questions: [
      {
        question: "Which fraction is equivalent to 2/3?",
        options: ["4/6", "3/4", "2/6", "6/8"],
        correctAnswer: 0,
        explanation: "2/3 = 4/6 because we multiplied both 2 and 3 by 2! (2×2)/(3×2) = 4/6!"
      },
      {
        question: "Simplify 6/8 to its simplest form:",
        options: ["2/4", "3/4", "1/2", "6/4"],
        correctAnswer: 1,
        explanation: "6/8 = 3/4 when we divide both by 2! (6÷2)/(8÷2) = 3/4!"
      },
      {
        question: "True or False: 3/6 = 1/2",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "True! 3/6 simplifies to 1/2 when we divide both by 3! (3÷3)/(6÷3) = 1/2!"
      },
      {
        question: "Which fraction is equivalent to 1/4?",
        options: ["2/6", "2/8", "3/6", "3/12"],
        correctAnswer: 1,
        explanation: "1/4 = 2/8! Multiply both by 2: (1×2)/(4×2) = 2/8!"
      },
      {
        question: "Simplify 8/12:",
        options: ["2/3", "4/6", "1/2", "4/12"],
        correctAnswer: 0,
        explanation: "8/12 = 2/3! Divide both by 4: (8÷4)/(12÷4) = 2/3!"
      },
      {
        question: "Is 4/6 equivalent to 2/3?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes! 4/6 simplifies to 2/3 when you divide both by 2!"
      },
      {
        question: "Which is NOT equivalent to 1/2?",
        options: ["2/4", "3/6", "4/8", "3/5"],
        correctAnswer: 3,
        explanation: "3/5 is NOT equivalent to 1/2! All the others equal half, but 3/5 is different!"
      },
      {
        question: "To find an equivalent fraction, you must:",
        options: ["Add the same to top and bottom", "Multiply or divide top and bottom by same number", "Only change the top", "Make them both even"],
        correctAnswer: 1,
        explanation: "You must multiply or divide BOTH top and bottom by the SAME number to keep them equivalent!"
      }
    ]
  },
  203: {
    id: 203,
    title: 'Adding & Subtracting Fractions',
    icon: '🔄',
    description: 'Combining and taking away fractions',
    content: [
      "Time to add and subtract fractions! 🔄 It's easier than you think!",
      "Let's start with the EASY way - same denominator!",
      "When the bottom numbers match, you're in luck!",
      "Rule: ADD OR SUBTRACT THE TOPS, KEEP THE BOTTOM THE SAME!",
      "Example: 1/5 + 2/5 = ?",
      "The denominators match (both are 5), so add the numerators: 1 + 2 = 3!",
      "Keep the denominator: 3/5!",
      "Think of it like pizza slices! 🍕",
      "If you have 1 slice out of 5, and you get 2 more slices...",
      "You now have 3 slices out of 5! That's 3/5!",
      "The slices are the same size (same denominator), so just count them!",
      "Another example: 3/8 + 2/8 = ?",
      "Denominators match (both 8), so add numerators: 3 + 2 = 5!",
      "Answer: 5/8!",
      "One more: 2/7 + 4/7 = 6/7! Easy when denominators match!",
      "Now SUBTRACTION - same rule!",
      "Example: 5/6 - 2/6 = ?",
      "Denominators match, so subtract numerators: 5 - 2 = 3!",
      "Keep the denominator: 3/6!",
      "(And 3/6 simplifies to 1/2 if you want the simplest form!)",
      "Another: 7/10 - 3/10 = 4/10 (which simplifies to 2/5)!",
      "Remember: Only add or subtract the TOPS! Bottom stays the same!",
      "Now the TRICKY part - different denominators!",
      "What if we want to add 1/2 + 1/4?",
      "The denominators don't match! We need to fix that!",
      "We need a COMMON DENOMINATOR - a number both denominators divide into!",
      "For 1/2 and 1/4, we can use 4! (Because 2 and 4 both divide into 4!)",
      "Change 1/2 to fourths: 1/2 = 2/4 (multiply top and bottom by 2!)",
      "Now add: 2/4 + 1/4 = 3/4!",
      "Another example: 1/3 + 1/6",
      "Common denominator is 6! (3 and 6 both divide into 6!)",
      "Change 1/3 to sixths: 1/3 = 2/6 (multiply top and bottom by 2!)",
      "Now add: 2/6 + 1/6 = 3/6 = 1/2 simplified!",
      "Subtraction with different denominators works the same way!",
      "Example: 3/4 - 1/2",
      "Common denominator is 4!",
      "Change 1/2 to 2/4!",
      "Now subtract: 3/4 - 2/4 = 1/4!",
      "Finding common denominators: Tips and tricks!",
      "If one denominator divides into the other, use the bigger one!",
      "Like for 1/2 and 1/8, use 8! (Because 2 divides into 8!)",
      "If they don't divide, multiply them! For 1/3 and 1/5, use 15 (3×5)!",
      "Real-world example: You eat 1/4 of a cake, your friend eats 1/2!",
      "How much was eaten total? 1/4 + 1/2 = 1/4 + 2/4 = 3/4 of the cake!",
      "Another: You have 3/4 cup of sugar, you use 1/2 cup!",
      "How much is left? 3/4 - 1/2 = 3/4 - 2/4 = 1/4 cup remaining!",
      "Don't forget to SIMPLIFY your final answer if you can!",
      "Like 6/8 should be simplified to 3/4!",
      "Pro tip: If your answer's numerator is bigger than denominator, you have more than 1 whole!",
      "Like 7/4 = 1 and 3/4! (We'll learn more about this later!)",
      "Remember the steps: 1. Make denominators the same, 2. Add or subtract tops, 3. Simplify!",
      "Let's practice adding and subtracting fractions!"
    ],
    questions: [
      {
        question: "What is 2/8 + 3/8?",
        options: ["5/8", "5/16", "2/3", "6/8"],
        correctAnswer: 0,
        explanation: "Same denominator, so just add tops: 2 + 3 = 5, answer is 5/8!"
      },
      {
        question: "What is 5/6 - 2/6?",
        options: ["3/6", "3/0", "7/6", "3/12"],
        correctAnswer: 0,
        explanation: "5 - 2 = 3, keep the denominator: 3/6 (which simplifies to 1/2)!"
      },
      {
        question: "What is 1/2 + 1/4?",
        options: ["2/6", "2/4", "3/4", "1/6"],
        correctAnswer: 2,
        explanation: "Change 1/2 to 2/4, then 2/4 + 1/4 = 3/4! Different denominators, so we found a common one!"
      },
      {
        question: "What is 4/9 + 2/9?",
        options: ["6/9", "6/18", "2/9", "4/18"],
        correctAnswer: 0,
        explanation: "Same denominator (9), so add numerators: 4 + 2 = 6! Answer is 6/9 (simplifies to 2/3)!"
      },
      {
        question: "What is 7/8 - 3/8?",
        options: ["4/8", "10/8", "4/0", "7/5"],
        correctAnswer: 0,
        explanation: "Same denominator, subtract tops: 7 - 3 = 4! Answer is 4/8 (simplifies to 1/2)!"
      },
      {
        question: "What is 1/3 + 1/6? (Hint: use 6 as common denominator)",
        options: ["2/9", "2/6", "3/6", "1/9"],
        correctAnswer: 2,
        explanation: "Change 1/3 to 2/6, then add: 2/6 + 1/6 = 3/6 (which equals 1/2)!"
      },
      {
        question: "When adding fractions with the same denominator, what do you do?",
        options: ["Add tops, add bottoms", "Add tops, keep bottom", "Multiply everything", "Keep tops, add bottoms"],
        correctAnswer: 1,
        explanation: "Add the numerators (tops), keep the denominator (bottom) the same!"
      },
      {
        question: "What is 3/4 - 1/2? (Hint: change 1/2 to 2/4)",
        options: ["1/4", "2/4", "3/2", "1/2"],
        correctAnswer: 0,
        explanation: "Change 1/2 to 2/4, then subtract: 3/4 - 2/4 = 1/4!"
      }
    ]
  },
  204: {
    id: 204,
    title: 'Understanding Decimals',
    icon: '📊',
    description: 'Numbers with decimal points',
    content: [
      "Welcome to the world of decimals! 📊 They're another way to write fractions!",
      "Decimals are super useful - we use them for money, measurements, and scores!",
      "Every decimal has a special dot - the DECIMAL POINT!",
      "The decimal point separates WHOLE numbers from PARTS of numbers!",
      "Let's look at 3.5. The 3 is a whole number!",
      "The .5 after the decimal point means 5 tenths (5/10), which is half!",
      "So 3.5 means 3 and a half! Or 3 1/2!",
      "The magic of decimals: Each place after the decimal point has a name!",
      "First place after the decimal: TENTHS! (Like 0.1, 0.2, 0.3...)",
      "0.1 means ONE TENTH, which is 1/10!",
      "0.2 means TWO TENTHS, which is 2/10 or 1/5!",
      "0.5 means FIVE TENTHS, which is 5/10 or 1/2 (half!)!",
      "Second place after the decimal: HUNDREDTHS! (Like 0.01, 0.25, 0.99...)",
      "0.01 means ONE HUNDREDTH, which is 1/100!",
      "0.25 means TWENTY-FIVE HUNDREDTHS, which is 25/100 or 1/4!",
      "0.50 is the same as 0.5 - both mean half! The zero doesn't change it!",
      "Third place: THOUSANDTHS! (Like 0.001, 0.125, 0.375...)",
      "0.001 means one thousandth - super tiny! That's 1/1000!",
      "Let's connect decimals to fractions we know! 🔗",
      "0.5 = 5/10 = 1/2 (HALF!)",
      "0.25 = 25/100 = 1/4 (ONE QUARTER!)",
      "0.75 = 75/100 = 3/4 (THREE QUARTERS!)",
      "0.1 = 1/10 (ONE TENTH!)",
      "0.2 = 2/10 = 1/5!",
      "Real-world example: MONEY! 💰",
      "$4.50 means 4 dollars and 50 cents!",
      "The .50 is 50 cents, which is 50/100 of a dollar, or half a dollar!",
      "$2.25 means 2 dollars and 25 cents (a quarter!)!",
      "$0.75 means 75 cents (three quarters of a dollar!)!",
      "COMPARING DECIMALS: Which is bigger? 📏",
      "Start from the LEFT and compare digit by digit!",
      "Compare 0.7 and 0.4. Look at tenths place: 7 > 4, so 0.7 is bigger!",
      "Compare 0.35 and 0.8. Tenths: 3 < 8, so 0.8 is bigger!",
      "Compare 0.45 and 0.47. Tenths same (4), so check hundredths: 5 < 7!",
      "So 0.47 is bigger than 0.45!",
      "IMPORTANT TRICK: You can add zeros without changing the value!",
      "0.5 = 0.50 = 0.500! All the same!",
      "This helps when comparing: 0.5 vs 0.45 → 0.50 vs 0.45 → 50 > 45!",
      "COUNTING WITH DECIMALS: It's like counting, but with tenths!",
      "0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0!",
      "Notice: 1.0 is the same as 1! When we reach 10 tenths, we have 1 whole!",
      "With hundredths: 0.01, 0.02, 0.03... 0.99, 1.00!",
      "READING DECIMALS ALOUD: 📢",
      "0.3 is 'three tenths' or 'zero point three'!",
      "0.25 is 'twenty-five hundredths' or 'zero point two five'!",
      "3.7 is 'three point seven' or 'three and seven tenths'!",
      "WHY DECIMALS ARE AWESOME: 🌟",
      "They make calculators work!",
      "They're easier to add and subtract than fractions sometimes!",
      "They show exact measurements (like 5.3 inches, 98.6°F temperature)!",
      "Sports use them (like 9.8 seconds for a race)!",
      "Remember: Decimal point splits whole numbers from parts!",
      "Each place after the decimal gets 10 times smaller!",
      "Tenths → Hundredths → Thousandths!",
      "Let's practice with decimal questions!"
    ],
    questions: [
      {
        question: "What fraction is 0.5?",
        options: ["1/5", "1/2", "5/1", "1/50"],
        correctAnswer: 1,
        explanation: "0.5 is 5/10, which simplifies to 1/2! It's one half!"
      },
      {
        question: "What is 0.25 as a fraction?",
        options: ["1/4", "1/25", "2/5", "25/10"],
        correctAnswer: 0,
        explanation: "0.25 is 25/100, which simplifies to 1/4! It's one quarter!"
      },
      {
        question: "Which is bigger: 0.7 or 0.4?",
        options: ["0.4", "0.7", "They're equal", "Can't tell"],
        correctAnswer: 1,
        explanation: "0.7 (seven tenths) is bigger than 0.4 (four tenths)! 7 > 4!"
      },
      {
        question: "How do you say 0.3?",
        options: ["Three hundredths", "Three tenths", "Thirty", "One third"],
        correctAnswer: 1,
        explanation: "0.3 is 'three tenths'! It's in the tenths place (first place after decimal)!"
      },
      {
        question: "What does $3.75 mean?",
        options: ["3 dollars and 75 cents", "375 dollars", "3 and 3/4 cents", "3.75 pennies"],
        correctAnswer: 0,
        explanation: "$3.75 means 3 dollars and 75 cents! The .75 is 75 hundredths of a dollar!"
      },
      {
        question: "Which is bigger: 0.45 or 0.5?",
        options: ["0.45", "0.5", "They're equal", "Can't tell"],
        correctAnswer: 1,
        explanation: "0.5 is bigger! Think of it as 0.50 vs 0.45. 50 is more than 45!"
      },
      {
        question: "What is 0.75 as a fraction?",
        options: ["1/2", "3/4", "1/4", "7/5"],
        correctAnswer: 1,
        explanation: "0.75 is 75/100, which simplifies to 3/4! Three quarters!"
      },
      {
        question: "Is 0.6 the same as 0.60?",
        options: ["Yes", "No"],
        correctAnswer: 0,
        explanation: "Yes! Adding zeros after the last digit doesn't change the value! 0.6 = 0.60 = 0.600!"
      }
    ]
  },
  205: {
    id: 205,
    title: 'Converting Between Forms',
    icon: '🔀',
    description: 'Change fractions to decimals and back',
    content: [
      "Time to be a math shape-shifter! 🔀 Let's transform between fractions and decimals!",
      "Fractions and decimals are just DIFFERENT WAYS to write the same thing!",
      "It's like saying 'half' or '50%' or '0.5' - all mean the same amount!",
      "Let's learn how to switch between them!",
      "FRACTION TO DECIMAL: The Division Method! ➗",
      "To change a fraction to a decimal, DIVIDE the top by the bottom!",
      "Example: 1/4 as a decimal? Divide 1 ÷ 4 = 0.25!",
      "Another: 3/4 as a decimal? 3 ÷ 4 = 0.75!",
      "Try 1/2: 1 ÷ 2 = 0.5! Half is 0.5!",
      "One more: 1/5 = 1 ÷ 5 = 0.2! One fifth is two tenths!",
      "Easy formula: TOP ÷ BOTTOM = DECIMAL!",
      "Let's try 3/5: 3 ÷ 5 = 0.6!",
      "How about 7/10? 7 ÷ 10 = 0.7! Super easy when bottom is 10!",
      "DECIMAL TO FRACTION: The Place Value Method! 📍",
      "Look at what place the last digit is in!",
      "If it's in the TENTHS place, put it over 10!",
      "Example: 0.3 has 3 in the tenths place → 3/10!",
      "0.7 has 7 in the tenths place → 7/10!",
      "If it's in the HUNDREDTHS place, put it over 100!",
      "Example: 0.25 has 25 in hundredths place → 25/100!",
      "Then SIMPLIFY! 25/100 = 1/4 (divide both by 25)!",
      "Another: 0.50 → 50/100 → 1/2 (divide both by 50)!",
      "0.75 → 75/100 → 3/4 (divide both by 25)!",
      "For THOUSANDTHS, put over 1000!",
      "Example: 0.125 → 125/1000 → 1/8 (divide by 125)!",
      "IMPORTANT CONVERSIONS TO MEMORIZE! 🧠",
      "These come up ALL the time!",
      "1/2 = 0.5 = 50% (HALF!)",
      "1/4 = 0.25 = 25% (QUARTER!)",
      "3/4 = 0.75 = 75% (THREE QUARTERS!)",
      "1/5 = 0.2 = 20%",
      "2/5 = 0.4 = 40%",
      "3/5 = 0.6 = 60%",
      "4/5 = 0.8 = 80%",
      "1/10 = 0.1 = 10%",
      "1/100 = 0.01 = 1%",
      "Know these and math gets SO much easier!",
      "PERCENTAGES: The Third Form! 🎯",
      "Percent means 'out of 100' (per cent = per 100!)",
      "50% = 50/100 = 0.50!",
      "25% = 25/100 = 0.25!",
      "To turn a decimal to a percent: move decimal point RIGHT 2 places!",
      "0.5 → 50% (move right 2: 0.5 → 5.0 → 50)",
      "0.75 → 75%",
      "0.3 → 30%",
      "To turn a percent to a decimal: move decimal point LEFT 2 places!",
      "80% → 0.80 = 0.8",
      "35% → 0.35",
      "5% → 0.05",
      "REAL-WORLD CONNECTIONS! 🌎",
      "Test scores: 18/20 = 18 ÷ 20 = 0.9 = 90%!",
      "Shopping: 1/4 off = 0.25 off = 25% discount!",
      "Weather: 3/10 chance of rain = 0.3 = 30% chance!",
      "Sports: Player makes 3/5 shots = 0.6 = 60% success rate!",
      "Remember the THREE FORMS:",
      "FRACTION (3/4) ↔ DECIMAL (0.75) ↔ PERCENT (75%)",
      "They're all the same amount, just different ways to write it!",
      "Being able to switch between them makes you a math superstar! ⭐",
      "Let's practice converting!"
    ],
    questions: [
      {
        question: "Convert 3/4 to a decimal:",
        options: ["0.34", "0.75", "0.43", "0.25"],
        correctAnswer: 1,
        explanation: "3 ÷ 4 = 0.75! Three quarters is seventy-five hundredths!"
      },
      {
        question: "Convert 0.6 to a fraction:",
        options: ["6/10", "1/6", "6/100", "10/6"],
        correctAnswer: 0,
        explanation: "0.6 is 6 tenths, or 6/10 (which simplifies to 3/5)!"
      },
      {
        question: "What is 1/2 as a decimal?",
        options: ["0.2", "0.12", "0.5", "2.0"],
        correctAnswer: 2,
        explanation: "1 ÷ 2 = 0.5! Half is five tenths!"
      },
      {
        question: "Convert 0.25 to a fraction in simplest form:",
        options: ["25/100", "1/4", "2/5", "1/25"],
        correctAnswer: 1,
        explanation: "0.25 = 25/100, which simplifies to 1/4!"
      },
      {
        question: "What is 1/5 as a decimal?",
        options: ["0.5", "0.15", "0.2", "0.25"],
        correctAnswer: 2,
        explanation: "1 ÷ 5 = 0.2! One fifth equals two tenths!"
      },
      {
        question: "Convert 0.8 to a fraction in simplest form:",
        options: ["8/10", "4/5", "8/100", "1/8"],
        correctAnswer: 1,
        explanation: "0.8 = 8/10, which simplifies to 4/5 (divide by 2)!"
      },
      {
        question: "What is 50% as a decimal?",
        options: ["5.0", "0.05", "0.5", "50.0"],
        correctAnswer: 2,
        explanation: "50% = 0.50 = 0.5! Move decimal left 2 places: 50 → 0.50!"
      },
      {
        question: "If you score 4/5 on a quiz, what's your decimal score?",
        options: ["0.45", "0.54", "0.8", "0.4"],
        correctAnswer: 2,
        explanation: "4 ÷ 5 = 0.8! That's an 80% - great job!"
      }
    ]
  },
  // Living Things & Habitats (301-305)
  301: {
    id: 301,
    title: 'Animal Classifications',
    icon: '🦁',
    description: 'How we group different animals',
    content: [
      "Welcome to the amazing animal kingdom! 🦁 There are MILLIONS of different animals!",
      "How do scientists keep track of them all? They sort them into GROUPS!",
      "Animals in the same group share special features - like having fur, or wings, or scales!",
      "This sorting system is called CLASSIFICATION! It's like organizing your toys!",
      "Let's meet the main animal groups! 🌍",
      "GROUP 1: MAMMALS! 🐻",
      "Mammals are warm-blooded - their body stays the same temperature!",
      "They have FUR or HAIR covering their bodies!",
      "Female mammals make MILK to feed their babies!",
      "Most mammals give birth to live babies (not eggs)!",
      "Mammals breathe AIR with lungs!",
      "Examples: humans, dogs, cats, elephants, dolphins, whales, bats, tigers!",
      "Even YOU are a mammal! You have hair and your mom fed you milk when you were a baby!",
      "Fun fact: Dolphins and whales are mammals, not fish! They breathe air and nurse their babies!",
      "Bats are the ONLY mammals that can truly fly!",
      "GROUP 2: BIRDS! 🦅",
      "Birds have FEATHERS - no other animal has these!",
      "They have WINGS (though not all birds can fly - like penguins and ostriches!)",
      "Birds lay EGGS with hard shells!",
      "They have BEAKS instead of teeth!",
      "Birds are warm-blooded and breathe air with lungs!",
      "Examples: eagles, parrots, chickens, ducks, penguins, hummingbirds, owls!",
      "Birds' bones are hollow - this makes them light enough to fly!",
      "The smallest bird is the bee hummingbird - smaller than your thumb!",
      "The biggest bird is the ostrich - taller than a grown-up person!",
      "GROUP 3: REPTILES! 🦎",
      "Reptiles have dry, SCALY SKIN!",
      "They're COLD-BLOODED - their body temperature changes with their surroundings!",
      "That's why you see lizards sunbathing - they're warming up!",
      "Most reptiles lay eggs with leathery shells!",
      "They breathe AIR with lungs!",
      "Examples: snakes, lizards, turtles, crocodiles, alligators, tortoises!",
      "Snakes smell with their tongues - that's why they stick them out!",
      "Some reptiles, like certain snakes, give birth to live babies instead of laying eggs!",
      "Turtles can live over 100 years!",
      "GROUP 4: AMPHIBIANS! 🐸",
      "Amphibians live PART of their life in water, PART on land!",
      "They have smooth, WET SKIN - no scales or fur!",
      "They're cold-blooded!",
      "Most amphibians lay eggs in WATER!",
      "Babies breathe underwater with gills, adults breathe air with lungs!",
      "Examples: frogs, toads, salamanders, newts!",
      "Frogs start as tadpoles (like little fish) and transform into frogs - amazing!",
      "This transformation is called METAMORPHOSIS!",
      "Amphibians can breathe through their skin too!",
      "GROUP 5: FISH! 🐠",
      "Fish live their WHOLE LIFE underwater!",
      "They have SCALES and FINS!",
      "Fish breathe underwater using GILLS - they don't have lungs!",
      "They're cold-blooded!",
      "Most fish lay eggs in water!",
      "Examples: goldfish, sharks, tuna, salmon, clownfish, eels!",
      "Sharks are fish, not mammals! They have gills and can't breathe air!",
      "The biggest fish is the whale shark - but it's gentle and eats tiny plankton!",
      "Fish use their fins to steer and their tails to swim!",
      "GROUP 6: INSECTS! 🐝",
      "Insects have 6 LEGS - always exactly 6!",
      "Their body has 3 PARTS: head, thorax (middle), and abdomen!",
      "Most insects have ANTENNAE on their heads!",
      "Many insects have wings and can fly!",
      "Insects lay lots of eggs!",
      "Examples: ants, bees, butterflies, beetles, grasshoppers, dragonflies!",
      "Butterflies taste with their feet!",
      "There are more insects than all other animals COMBINED!",
      "Ladybugs are actually beetles, not bugs!",
      "OTHER GROUPS:",
      "Spiders are ARACHNIDS - they have 8 legs, not 6, so they're not insects!",
      "Worms, jellyfish, sponges, and octopuses are in other special groups too!",
      "WHY CLASSIFICATION MATTERS: 🔬",
      "It helps scientists study animals and understand how they're related!",
      "It helps us protect endangered species!",
      "It shows us how life on Earth evolved over millions of years!",
      "Remember the key features:",
      "Mammals: fur, milk, warm-blooded!",
      "Birds: feathers, wings, beaks!",
      "Reptiles: scales, cold-blooded, lay eggs!",
      "Amphibians: smooth wet skin, water and land!",
      "Fish: gills, fins, always in water!",
      "Insects: 6 legs, 3 body parts!",
      "Let's test your animal classification skills!"
    ],
    questions: [
      {
        question: "Which animal is a mammal?",
        options: ["Snake", "Dolphin", "Eagle", "Frog"],
        correctAnswer: 1,
        explanation: "Dolphins are mammals! They're warm-blooded, have very fine hair, and feed milk to their babies! They breathe air with lungs!"
      },
      {
        question: "What do all birds have?",
        options: ["Fur", "Scales", "Feathers", "Gills"],
        correctAnswer: 2,
        explanation: "All birds have feathers! No other animal has feathers - it's what makes them birds!"
      },
      {
        question: "How many legs do insects have?",
        options: ["4", "6", "8", "10"],
        correctAnswer: 1,
        explanation: "Insects always have exactly 6 legs! If it has 8 legs (like a spider), it's not an insect!"
      },
      {
        question: "What makes reptiles different from amphibians?",
        options: ["Reptiles have scales", "Reptiles live in trees", "Reptiles eat meat", "Reptiles are bigger"],
        correctAnswer: 0,
        explanation: "Reptiles have dry, scaly skin! Amphibians have smooth, wet skin!"
      },
      {
        question: "Which animal group is cold-blooded?",
        options: ["Mammals only", "Birds only", "Reptiles and amphibians", "All animals"],
        correctAnswer: 2,
        explanation: "Reptiles and amphibians (and fish) are cold-blooded! Mammals and birds are warm-blooded!"
      },
      {
        question: "What do fish use to breathe underwater?",
        options: ["Lungs", "Gills", "Skin", "Nose"],
        correctAnswer: 1,
        explanation: "Fish use gills to breathe underwater! Gills take oxygen from the water!"
      },
      {
        question: "Baby frogs are called:",
        options: ["Froglets", "Tadpoles", "Pups", "Chicks"],
        correctAnswer: 1,
        explanation: "Baby frogs are called tadpoles! They look like little fish and transform into frogs!"
      },
      {
        question: "Are bats birds or mammals?",
        options: ["Birds", "Mammals", "Reptiles", "Neither"],
        correctAnswer: 1,
        explanation: "Bats are mammals! They have fur, feed milk to babies, and are warm-blooded. They're the only mammals that can truly fly!"
      }
    ]
  },

};
