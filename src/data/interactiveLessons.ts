// Interactive lesson templates for all subjects
export const interactiveLessons: { [key: string]: any } = {
  // MATH LESSONS
  "101": {
    title: "Addition Adventure",
    activities: [
      {
        type: 'intro',
        data: { title: "Addition Adventure! 🚀", description: "Let's master addition from simple sums to big numbers! We'll start easy and get CHALLENGING!", emoji: "➕" }
      },
      {
        type: 'animation',
        data: { numbers: [3, 2], operation: '+', answer: 5 }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '2 + 3', correctZone: 'five' },
            { id: '2', content: '4 + 4', correctZone: 'eight' },
            { id: '3', content: '1 + 5', correctZone: 'six' },
            { id: '4', content: '3 + 3', correctZone: 'six' }
          ],
          zones: [
            { id: 'five', label: 'Equals 5' },
            { id: 'six', label: 'Equals 6' },
            { id: 'eight', label: 'Equals 8' }
          ]
        }
      },
      {
        type: 'animation',
        data: { numbers: [7, 5], operation: '+', answer: 12 }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '12 + 8', correctZone: 'twenty' },
            { id: '2', content: '15 + 15', correctZone: 'thirty' },
            { id: '3', content: '25 + 5', correctZone: 'thirty' },
            { id: '4', content: '18 + 2', correctZone: 'twenty' },
            { id: '5', content: '20 + 10', correctZone: 'thirty' },
            { id: '6', content: '11 + 9', correctZone: 'twenty' }
          ],
          zones: [
            { id: 'twenty', label: 'Equals 20' },
            { id: 'thirty', label: 'Equals 30' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: '45 + 5', right: '50' },
            { id: '2', left: '38 + 12', right: '50' },
            { id: '3', left: '25 + 25', right: '50' },
            { id: '4', left: '60 + 40', right: '100' },
            { id: '5', left: '75 + 25', right: '100' }
          ]
        }
      },
      {
        type: 'minigame',
        data: { targetNumber: 7 }
      },
      {
        type: 'animation',
        data: { numbers: [123, 456], operation: '+', answer: 579 }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '234 + 100', correctZone: 'threehundred' },
            { id: '2', content: '150 + 150', correctZone: 'threehundred' },
            { id: '3', content: '400 + 100', correctZone: 'fivehundred' },
            { id: '4', content: '250 + 250', correctZone: 'fivehundred' },
            { id: '5', content: '300 + 200', correctZone: 'fivehundred' }
          ],
          zones: [
            { id: 'threehundred', label: 'Around 300' },
            { id: 'fivehundred', label: 'Around 500' }
          ]
        }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw 5 + 3 = 8 apples! 🍎' }
      },
      {
        type: 'minigame',
        data: { targetNumber: 15 }
      },
      {
        type: 'celebration',
        data: { message: "You're an Addition MASTER! From 1+1 to 100+100!", coinsEarned: 75, starsEarned: 3 }
      }
    ]
  },

  "102": {
    title: "Subtraction Fun",
    activities: [
      {
        type: 'intro',
        data: { title: "Subtraction Time! ➖", description: "Master the art of taking away! From simple to SUPER challenging!", emoji: "➖" }
      },
      {
        type: 'animation',
        data: { numbers: [5, 2], operation: '-', answer: 3 }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '5 - 2', correctZone: 'three' },
            { id: '2', content: '7 - 4', correctZone: 'three' },
            { id: '3', content: '10 - 5', correctZone: 'five' },
            { id: '4', content: '8 - 3', correctZone: 'five' }
          ],
          zones: [
            { id: 'three', label: 'Equals 3' },
            { id: 'five', label: 'Equals 5' }
          ]
        }
      },
      {
        type: 'animation',
        data: { numbers: [20, 8], operation: '-', answer: 12 }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: '10 - 3', right: '7' },
            { id: '2', left: '9 - 2', right: '7' },
            { id: '3', left: '8 - 1', right: '7' },
            { id: '4', left: '15 - 5', right: '10' },
            { id: '5', left: '20 - 10', right: '10' }
          ]
        }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '50 - 20', correctZone: 'thirty' },
            { id: '2', content: '100 - 70', correctZone: 'thirty' },
            { id: '3', content: '80 - 30', correctZone: 'fifty' },
            { id: '4', content: '100 - 50', correctZone: 'fifty' },
            { id: '5', content: '90 - 40', correctZone: 'fifty' },
            { id: '6', content: '60 - 30', correctZone: 'thirty' }
          ],
          zones: [
            { id: 'thirty', label: 'Equals 30' },
            { id: 'fifty', label: 'Equals 50' }
          ]
        }
      },
      {
        type: 'minigame',
        data: { targetNumber: 4 }
      },
      {
        type: 'animation',
        data: { numbers: [456, 123], operation: '-', answer: 333 }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: '500 - 100', right: '400' },
            { id: '2', left: '1000 - 500', right: '500' },
            { id: '3', left: '750 - 250', right: '500' },
            { id: '4', left: '600 - 200', right: '400' }
          ]
        }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw 10 stars, then cross out 3. How many left? ⭐' }
      },
      {
        type: 'minigame',
        data: { targetNumber: 12 }
      },
      {
        type: 'celebration',
        data: { message: "Subtraction SUPERSTAR! You can subtract ANYTHING now!", coinsEarned: 75, starsEarned: 3 }
      }
    ]
  },

  "103": {
    title: "Multiplication Magic",
    activities: [
      {
        type: 'intro',
        data: { title: "Multiplication Power! ✖️", description: "Multiply like a wizard! From 2×2 to BIG numbers! Learn skip counting and times tables!", emoji: "✨" }
      },
      {
        type: 'animation',
        data: { numbers: [3, 4], operation: '×', answer: 12 }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: '2 × 5', right: '10' },
            { id: '2', left: '3 × 3', right: '9' },
            { id: '3', left: '4 × 2', right: '8' },
            { id: '4', left: '5 × 2', right: '10' }
          ]
        }
      },
      {
        type: 'animation',
        data: { numbers: [7, 8], operation: '×', answer: 56 }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '6 × 6', correctZone: 'thirtysix' },
            { id: '2', content: '9 × 4', correctZone: 'thirtysix' },
            { id: '3', content: '7 × 7', correctZone: 'fortynine' },
            { id: '4', content: '8 × 5', correctZone: 'forty' },
            { id: '5', content: '5 × 8', correctZone: 'forty' },
            { id: '6', content: '10 × 4', correctZone: 'forty' }
          ],
          zones: [
            { id: 'thirtysix', label: 'Equals 36' },
            { id: 'forty', label: 'Equals 40' },
            { id: 'fortynine', label: 'Equals 49' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: '9 × 9', right: '81' },
            { id: '2', left: '8 × 8', right: '64' },
            { id: '3', left: '7 × 9', right: '63' },
            { id: '4', left: '12 × 5', right: '60' },
            { id: '5', left: '10 × 10', right: '100' }
          ]
        }
      },
      {
        type: 'tapsequence',
        data: { sequence: ['2️⃣', '4️⃣', '6️⃣', '8️⃣', '🔟'] }
      },
      {
        type: 'animation',
        data: { numbers: [25, 4], operation: '×', answer: 100 }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '20 × 5', correctZone: 'hundred' },
            { id: '2', content: '25 × 4', correctZone: 'hundred' },
            { id: '3', content: '50 × 2', correctZone: 'hundred' },
            { id: '4', content: '30 × 10', correctZone: 'threehundred' },
            { id: '5', content: '50 × 6', correctZone: 'threehundred' },
            { id: '6', content: '100 × 3', correctZone: 'threehundred' }
          ],
          zones: [
            { id: 'hundred', label: 'Equals 100' },
            { id: 'threehundred', label: 'Equals 300' }
          ]
        }
      },
      {
        type: 'minigame',
        data: { targetNumber: 6 }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw 3 groups of 4 stars! Count them: 3 × 4 = 12 ⭐' }
      },
      {
        type: 'minigame',
        data: { targetNumber: 18 }
      },
      {
        type: 'celebration',
        data: { message: "Multiplication WIZARD! You've mastered the times tables!", coinsEarned: 100, starsEarned: 3 }
      }
    ]
  },

  // SCIENCE LESSONS
  "401": {
    title: "Water Cycle Adventure",
    activities: [
      {
        type: 'intro',
        data: { title: "The Water Cycle 💧", description: "Discover how water travels around Earth! Learn evaporation, condensation, precipitation, and collection!", emoji: "🌊" }
      },
      {
        type: 'animation',
        data: { numbers: [], operation: 'cycle', answer: 'water' }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '☀️ Water heats up', correctZone: 'evaporation' },
            { id: '2', content: '☁️ Clouds form', correctZone: 'condensation' },
            { id: '3', content: '🌧️ Rain falls', correctZone: 'precipitation' },
            { id: '4', content: '💧 Vapor rises', correctZone: 'evaporation' }
          ],
          zones: [
            { id: 'evaporation', label: 'Evaporation ☀️' },
            { id: 'condensation', label: 'Condensation ☁️' },
            { id: 'precipitation', label: 'Precipitation 🌧️' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Evaporation', right: '☀️ Sun heats water' },
            { id: '2', left: 'Condensation', right: '☁️ Clouds form' },
            { id: '3', left: 'Precipitation', right: '🌧️ Rain falls' }
          ]
        }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '🌊 Ocean water', correctZone: 'source' },
            { id: '2', content: '🏞️ Lake water', correctZone: 'source' },
            { id: '3', content: '🏔️ Snow on mountains', correctZone: 'precipitation' },
            { id: '4', content: '🌧️ Rain from clouds', correctZone: 'precipitation' },
            { id: '5', content: '☀️ Sun heating water', correctZone: 'evaporation' },
            { id: '6', content: '💨 Water vapor rising', correctZone: 'evaporation' }
          ],
          zones: [
            { id: 'source', label: '💧 Water Sources' },
            { id: 'evaporation', label: '☀️ Evaporation' },
            { id: 'precipitation', label: '🌧️ Precipitation' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: '🌊 Ocean', right: 'Largest water source' },
            { id: '2', left: '☁️ Cloud', right: 'Made of tiny water droplets' },
            { id: '3', left: '❄️ Snow', right: 'Frozen precipitation' },
            { id: '4', left: '🏞️ River', right: 'Water flows to ocean' },
            { id: '5', left: '💧 Groundwater', right: 'Water underground' }
          ]
        }
      },
      {
        type: 'tapsequence',
        data: { sequence: ['☀️', '💨', '☁️', '🌧️', '🌊'] }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw the complete water cycle: sun, ocean, vapor, clouds, rain, and back!' }
      },
      {
        type: 'minigame',
        data: { targetNumber: 8 }
      },
      {
        type: 'celebration',
        data: { message: "Water Cycle EXPERT! You understand how Earth's water moves!", coinsEarned: 85, starsEarned: 3 }
      }
    ]
  },

  "402": {
    title: "Solar System Explorer",
    activities: [
      {
        type: 'intro',
        data: { title: "Solar System Adventure! 🌍", description: "Master the planets, their order, sizes, and special features! Become a space expert!", emoji: "🚀" }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Mercury', right: '☿️ Closest to Sun' },
            { id: '2', left: 'Earth', right: '🌍 Our Home' },
            { id: '3', left: 'Mars', right: '🔴 Red Planet' },
            { id: '4', left: 'Jupiter', right: '🪐 Biggest Planet' }
          ]
        }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: 'Mercury ☿️', correctZone: 'inner' },
            { id: '2', content: 'Venus ♀️', correctZone: 'inner' },
            { id: '3', content: 'Earth 🌍', correctZone: 'inner' },
            { id: '4', content: 'Mars ♂️', correctZone: 'inner' },
            { id: '5', content: 'Jupiter 🪐', correctZone: 'outer' },
            { id: '6', content: 'Saturn 💫', correctZone: 'outer' },
            { id: '7', content: 'Uranus 🌀', correctZone: 'outer' },
            { id: '8', content: 'Neptune 🔵', correctZone: 'outer' }
          ],
          zones: [
            { id: 'inner', label: 'Inner Planets (Rocky)' },
            { id: 'outer', label: 'Outer Planets (Gas Giants)' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Mercury', right: 'Smallest, hottest, fastest orbit' },
            { id: '2', left: 'Venus', right: 'Hottest surface, thick clouds' },
            { id: '3', left: 'Mars', right: 'Red rust, has 2 moons' },
            { id: '4', left: 'Jupiter', right: 'Great Red Spot storm' },
            { id: '5', left: 'Saturn', right: 'Beautiful rings of ice' }
          ]
        }
      },
      {
        type: 'tapsequence',
        data: { sequence: ['☀️', '☿️', '♀️', '🌍', '♂️', '🪐', '💫', '🌀', '🔵'] }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '🌙 Moon', correctZone: 'satellite' },
            { id: '2', content: '☄️ Comet', correctZone: 'space' },
            { id: '3', content: '☀️ Sun', correctZone: 'star' },
            { id: '4', content: '🌍 Earth', correctZone: 'planet' },
            { id: '5', content: '⭐ Stars', correctZone: 'star' },
            { id: '6', content: '🪐 Jupiter', correctZone: 'planet' }
          ],
          zones: [
            { id: 'star', label: '⭐ Stars' },
            { id: 'planet', label: '🌍 Planets' },
            { id: 'satellite', label: '🌙 Moons' },
            { id: 'space', label: '☄️ Space Objects' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Sun', right: 'Star at center, provides light' },
            { id: '2', left: 'Moon', right: 'Orbits Earth, reflects sunlight' },
            { id: '3', left: 'Asteroid', right: 'Rocky space objects' },
            { id: '4', left: 'Galaxy', right: 'Billions of stars together' }
          ]
        }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw the solar system with all 8 planets in order!' }
      },
      {
        type: 'minigame',
        data: { targetNumber: 9 }
      },
      {
        type: 'celebration',
        data: { message: "Space MASTER! You know the solar system inside out!", coinsEarned: 90, starsEarned: 3 }
      }
    ]
  },

  // ENGLISH LESSONS
  "1001": {
    title: "Reading Fun",
    activities: [
      {
        type: 'intro',
        data: { title: "Reading Master! 📖", description: "Level up your reading! Learn words, sentences, parts of speech, and comprehension!", emoji: "📚" }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Dog', right: '🐕 Pet animal' },
            { id: '2', left: 'Cat', right: '🐈 Furry friend' },
            { id: '3', left: 'Bird', right: '🐦 Can fly' }
          ]
        }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: 'Happy', correctZone: 'feelings' },
            { id: '2', content: 'Red', correctZone: 'colors' },
            { id: '3', content: 'Sad', correctZone: 'feelings' },
            { id: '4', content: 'Blue', correctZone: 'colors' }
          ],
          zones: [
            { id: 'feelings', label: '😊 Feelings' },
            { id: 'colors', label: '🎨 Colors' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Noun', right: 'Person, place, or thing' },
            { id: '2', left: 'Verb', right: 'Action word' },
            { id: '3', left: 'Adjective', right: 'Describes a noun' },
            { id: '4', left: 'Adverb', right: 'Describes a verb' }
          ]
        }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: 'Run 🏃', correctZone: 'verb' },
            { id: '2', content: 'Happy 😊', correctZone: 'adjective' },
            { id: '3', content: 'Book 📖', correctZone: 'noun' },
            { id: '4', content: 'Jump 🦘', correctZone: 'verb' },
            { id: '5', content: 'Beautiful 🌸', correctZone: 'adjective' },
            { id: '6', content: 'House 🏠', correctZone: 'noun' }
          ],
          zones: [
            { id: 'noun', label: '📦 Noun' },
            { id: 'verb', label: '⚡ Verb' },
            { id: 'adjective', label: '✨ Adjective' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Capital Letter', right: 'Start of sentence' },
            { id: '2', left: 'Period .', right: 'End of sentence' },
            { id: '3', left: 'Question Mark ?', right: 'Asking something' },
            { id: '4', left: 'Comma ,', right: 'Short pause in sentence' }
          ]
        }
      },
      {
        type: 'tapsequence',
        data: { sequence: ['📖', '👀', '🧠', '💡'] }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw your favorite story scene with characters!' }
      },
      {
        type: 'minigame',
        data: { targetNumber: 10 }
      },
      {
        type: 'celebration',
        data: { message: "Reading CHAMPION! You understand words, grammar, and stories!", coinsEarned: 80, starsEarned: 3 }
      }
    ]
  },

  // ART LESSONS
  "1401": {
    title: "Shapes & Colors",
    activities: [
      {
        type: 'intro',
        data: { title: "Art Master! 🎨", description: "Learn shapes, colors, color theory, and create beautiful art! From basics to advanced!", emoji: "🖍️" }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: '🔴 Circle', right: 'Round shape' },
            { id: '2', left: '🟦 Square', right: '4 equal sides' },
            { id: '3', left: '🔺 Triangle', right: '3 sides' }
          ]
        }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '🔴 Red', correctZone: 'warm' },
            { id: '2', content: '🟠 Orange', correctZone: 'warm' },
            { id: '3', content: '🟡 Yellow', correctZone: 'warm' },
            { id: '4', content: '🔵 Blue', correctZone: 'cool' },
            { id: '5', content: '💜 Purple', correctZone: 'cool' },
            { id: '6', content: '💚 Green', correctZone: 'cool' }
          ],
          zones: [
            { id: 'warm', label: '🔥 Warm Colors' },
            { id: 'cool', label: '❄️ Cool Colors' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Primary Colors', right: '🔴🟡🔵 Red, Yellow, Blue' },
            { id: '2', left: 'Secondary Colors', right: '🟠💜💚 Orange, Purple, Green' },
            { id: '3', left: 'Red + Yellow', right: '🟠 Orange' },
            { id: '4', left: 'Blue + Yellow', right: '💚 Green' },
            { id: '5', left: 'Red + Blue', right: '💜 Purple' }
          ]
        }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '⭕ Circle', correctZone: 'round' },
            { id: '2', content: '🥚 Oval', correctZone: 'round' },
            { id: '3', content: '⬛ Square', correctZone: 'angular' },
            { id: '4', content: '▭ Rectangle', correctZone: 'angular' },
            { id: '5', content: '🔺 Triangle', correctZone: 'angular' },
            { id: '6', content: '💎 Diamond', correctZone: 'angular' }
          ],
          zones: [
            { id: 'round', label: '⭕ Round Shapes' },
            { id: 'angular', label: '⬛ Angular Shapes' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Line', right: 'Path from point to point' },
            { id: '2', left: 'Shape', right: 'Enclosed space' },
            { id: '3', left: 'Texture', right: 'How surface feels/looks' },
            { id: '4', left: 'Pattern', right: 'Repeating design' }
          ]
        }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw a rainbow with all 7 colors in order!' }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw shapes: circles, squares, triangles, and rectangles!' }
      },
      {
        type: 'minigame',
        data: { targetNumber: 11 }
      },
      {
        type: 'celebration',
        data: { message: "Creative GENIUS! You know art fundamentals like a pro!", coinsEarned: 85, starsEarned: 3 }
      }
    ]
  },

  // HISTORY LESSONS
  "1701": {
    title: "World Geography",
    activities: [
      {
        type: 'intro',
        data: { title: "Explore the World! 🗺️", description: "Master continents, countries, oceans, landmarks, and cultures! Become a geography expert!", emoji: "🌍" }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Asia', right: 'Largest continent' },
            { id: '2', left: 'Africa', right: 'Second largest, hot climate' },
            { id: '3', left: 'Europe', right: 'Many small countries' },
            { id: '4', left: 'North America', right: 'USA, Canada, Mexico' },
            { id: '5', left: 'South America', right: 'Amazon rainforest' }
          ]
        }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: 'USA 🇺🇸', correctZone: 'namerica' },
            { id: '2', content: 'Canada 🇨🇦', correctZone: 'namerica' },
            { id: '3', content: 'Brazil 🇧🇷', correctZone: 'samerica' },
            { id: '4', content: 'Argentina 🇦🇷', correctZone: 'samerica' },
            { id: '5', content: 'France 🇫🇷', correctZone: 'europe' },
            { id: '6', content: 'Germany 🇩🇪', correctZone: 'europe' },
            { id: '7', content: 'Japan 🇯🇵', correctZone: 'asia' },
            { id: '8', content: 'China 🇨🇳', correctZone: 'asia' }
          ],
          zones: [
            { id: 'namerica', label: 'North America' },
            { id: 'samerica', label: 'South America' },
            { id: 'europe', label: 'Europe' },
            { id: 'asia', label: 'Asia' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: '🗽 USA', right: 'Statue of Liberty' },
            { id: '2', left: '🗼 France', right: 'Eiffel Tower' },
            { id: '3', left: '🗾 Japan', right: 'Mount Fuji' },
            { id: '4', left: '🕌 India', right: 'Taj Mahal' },
            { id: '5', left: '🏛️ Greece', right: 'Parthenon' }
          ]
        }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: '🌊 Pacific Ocean', correctZone: 'ocean' },
            { id: '2', content: '🌊 Atlantic Ocean', correctZone: 'ocean' },
            { id: '3', content: '🏔️ Mount Everest', correctZone: 'mountain' },
            { id: '4', content: '🏔️ Rocky Mountains', correctZone: 'mountain' },
            { id: '5', content: '🏜️ Sahara Desert', correctZone: 'desert' },
            { id: '6', content: '🌳 Amazon Rainforest', correctZone: 'forest' }
          ],
          zones: [
            { id: 'ocean', label: '🌊 Oceans' },
            { id: 'mountain', label: '🏔️ Mountains' },
            { id: 'desert', label: '🏜️ Deserts' },
            { id: 'forest', label: '🌳 Forests' }
          ]
        }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Equator', right: 'Imaginary line around middle' },
            { id: '2', left: 'North Pole', right: 'Top of Earth, very cold' },
            { id: '3', left: 'South Pole', right: 'Bottom of Earth, Antarctica' },
            { id: '4', left: 'Hemisphere', right: 'Half of Earth' }
          ]
        }
      },
      {
        type: 'tapsequence',
        data: { sequence: ['🌍', '🗺️', '✈️', '🧳', '🌏'] }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw your favorite country with its flag and a landmark!' }
      },
      {
        type: 'minigame',
        data: { targetNumber: 13 }
      },
      {
        type: 'celebration',
        data: { message: "World EXPERT! You know geography like a globe-trotting adventurer!", coinsEarned: 95, starsEarned: 3 }
      }
    ]
  },

  // Default lesson template
  "default": {
    title: "Interactive Lesson",
    activities: [
      {
        type: 'intro',
        data: { title: "Let's Learn! 📚", description: "An exciting interactive lesson!", emoji: "✨" }
      },
      {
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: 'Question 1', right: 'Answer 1' },
            { id: '2', left: 'Question 2', right: 'Answer 2' }
          ]
        }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw what you learned!' }
      },
      {
        type: 'celebration',
        data: { message: "Great Work!", coinsEarned: 40, starsEarned: 2 }
      }
    ]
  }
};

// Function to get lesson by ID
export function getLessonData(lessonId: string) {
  return interactiveLessons[lessonId] || interactiveLessons["default"];
}
