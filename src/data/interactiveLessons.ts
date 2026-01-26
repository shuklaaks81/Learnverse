// Interactive lesson templates for all subjects
export const interactiveLessons: { [key: string]: any } = {
  // MATH LESSONS
  "101": {
    title: "Addition Adventure",
    activities: [
      {
        type: 'intro',
        data: { title: "Addition Adventure! 🚀", description: "Let's learn to add numbers in fun ways!", emoji: "➕" }
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
        type: 'minigame',
        data: { targetNumber: 7 }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw 5 + 3 = 8 apples! 🍎' }
      },
      {
        type: 'celebration',
        data: { message: "You're an Addition Master!", coinsEarned: 50, starsEarned: 3 }
      }
    ]
  },

  "102": {
    title: "Subtraction Fun",
    activities: [
      {
        type: 'intro',
        data: { title: "Subtraction Time! ➖", description: "Let's learn to take away numbers!", emoji: "➖" }
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
        type: 'matching',
        data: {
          pairs: [
            { id: '1', left: '10 - 3', right: '7' },
            { id: '2', left: '9 - 2', right: '7' },
            { id: '3', left: '8 - 1', right: '7' }
          ]
        }
      },
      {
        type: 'minigame',
        data: { targetNumber: 4 }
      },
      {
        type: 'celebration',
        data: { message: "Subtraction Superstar!", coinsEarned: 50, starsEarned: 3 }
      }
    ]
  },

  "103": {
    title: "Multiplication Magic",
    activities: [
      {
        type: 'intro',
        data: { title: "Multiplication Power! ✖️", description: "Multiply numbers like a wizard!", emoji: "✨" }
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
        type: 'tapsequence',
        data: { sequence: ['2️⃣', '4️⃣', '6️⃣'] }
      },
      {
        type: 'minigame',
        data: { targetNumber: 6 }
      },
      {
        type: 'celebration',
        data: { message: "Multiplication Master!", coinsEarned: 60, starsEarned: 3 }
      }
    ]
  },

  // SCIENCE LESSONS
  "401": {
    title: "Water Cycle Adventure",
    activities: [
      {
        type: 'intro',
        data: { title: "The Water Cycle 💧", description: "Discover how water travels around Earth!", emoji: "🌊" }
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
        type: 'tapsequence',
        data: { sequence: ['☀️', '💨', '☁️', '🌧️'] }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw the water cycle with sun, clouds, and rain!' }
      },
      {
        type: 'celebration',
        data: { message: "Water Cycle Expert!", coinsEarned: 60, starsEarned: 3 }
      }
    ]
  },

  "402": {
    title: "Solar System Explorer",
    activities: [
      {
        type: 'intro',
        data: { title: "Solar System 🌍", description: "Explore planets and stars!", emoji: "🚀" }
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
            { id: '2', content: 'Earth 🌍', correctZone: 'inner' },
            { id: '3', content: 'Jupiter 🪐', correctZone: 'outer' },
            { id: '4', content: 'Saturn 💫', correctZone: 'outer' }
          ],
          zones: [
            { id: 'inner', label: 'Inner Planets' },
            { id: 'outer', label: 'Outer Planets' }
          ]
        }
      },
      {
        type: 'tapsequence',
        data: { sequence: ['☀️', '☿️', '♀️', '🌍', '♂️'] }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw the solar system!' }
      },
      {
        type: 'celebration',
        data: { message: "Space Explorer!", coinsEarned: 70, starsEarned: 3 }
      }
    ]
  },

  // ENGLISH LESSONS
  "1001": {
    title: "Reading Fun",
    activities: [
      {
        type: 'intro',
        data: { title: "Reading Time! 📖", description: "Let's read and understand!", emoji: "📚" }
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
        type: 'drawing',
        data: { prompt: 'Draw your favorite story!' }
      },
      {
        type: 'celebration',
        data: { message: "Reading Star!", coinsEarned: 50, starsEarned: 3 }
      }
    ]
  },

  // ART LESSONS
  "1401": {
    title: "Shapes & Colors",
    activities: [
      {
        type: 'intro',
        data: { title: "Art Time! 🎨", description: "Let's create with shapes and colors!", emoji: "🖍️" }
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
            { id: '3', content: '🔵 Blue', correctZone: 'cool' },
            { id: '4', content: '💜 Purple', correctZone: 'cool' }
          ],
          zones: [
            { id: 'warm', label: '🔥 Warm Colors' },
            { id: 'cool', label: '❄️ Cool Colors' }
          ]
        }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw a rainbow with all colors!' }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw shapes: circles, squares, and triangles!' }
      },
      {
        type: 'celebration',
        data: { message: "Creative Artist!", coinsEarned: 60, starsEarned: 3 }
      }
    ]
  },

  // HISTORY LESSONS
  "1701": {
    title: "World Geography",
    activities: [
      {
        type: 'intro',
        data: { title: "Explore the World! 🗺️", description: "Learn about continents and countries!", emoji: "🌍" }
      },
      {
        type: 'dragdrop',
        data: {
          items: [
            { id: '1', content: 'USA 🇺🇸', correctZone: 'namerica' },
            { id: '2', content: 'Brazil 🇧🇷', correctZone: 'samerica' },
            { id: '3', content: 'France 🇫🇷', correctZone: 'europe' },
            { id: '4', content: 'Japan 🇯🇵', correctZone: 'asia' }
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
            { id: '3', left: '🗾 Japan', right: 'Mount Fuji' }
          ]
        }
      },
      {
        type: 'drawing',
        data: { prompt: 'Draw your favorite country flag!' }
      },
      {
        type: 'celebration',
        data: { message: "World Explorer!", coinsEarned: 65, starsEarned: 3 }
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
