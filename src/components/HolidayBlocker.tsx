'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HolidayBlocker() {
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayName, setHolidayName] = useState('');
  const [holidayEmoji, setHolidayEmoji] = useState('🎉');
  const router = useRouter();

  useEffect(() => {
    checkForHoliday();
  }, []);

  const checkForHoliday = () => {
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate();

    // Check major holidays
    if (month === 12 && day === 25) {
      setIsHoliday(true);
      setHolidayName('Christmas');
      setHolidayEmoji('🎄');
      return;
    }

    if (month === 10 && day === 31) {
      setIsHoliday(true);
      setHolidayName('Halloween');
      setHolidayEmoji('🎃');
      return;
    }

    if (month === 1 && day === 1) {
      setIsHoliday(true);
      setHolidayName("New Year's Day");
      setHolidayEmoji('🎆');
      return;
    }

    // Thanksgiving (4th Thursday of November)
    if (month === 11) {
      const thanksgiving = getThanksgivingDate(today.getFullYear());
      if (day === thanksgiving) {
        setIsHoliday(true);
        setHolidayName('Thanksgiving');
        setHolidayEmoji('🦃');
        return;
      }
    }

    // Check kid's birthday
    const currentKidData = localStorage.getItem('currentKid');
    if (currentKidData) {
      try {
        const kid = JSON.parse(currentKidData);
        if (kid.birthday) {
          const [birthMonth, birthDay] = kid.birthday.split('-').map(Number);
          if (month === birthMonth && day === birthDay) {
            setIsHoliday(true);
            setHolidayName(`${kid.name}'s Birthday`);
            setHolidayEmoji('🎂');
            return;
          }
        }
      } catch (e) {
        console.log('No birthday set');
      }
    }
  };

  const getThanksgivingDate = (year: number) => {
    // Find 4th Thursday of November
    const november = new Date(year, 10, 1); // Month is 0-indexed
    let thursdayCount = 0;
    
    for (let day = 1; day <= 30; day++) {
      const date = new Date(year, 10, day);
      if (date.getDay() === 4) { // Thursday
        thursdayCount++;
        if (thursdayCount === 4) {
          return day;
        }
      }
    }
    return 0;
  };

  if (!isHoliday) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 z-[99999] flex flex-col items-center justify-center overflow-hidden">
      {/* Floating confetti */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl animate-[fall_5s_linear_infinite]"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            top: '-10%'
          }}
        >
          {['🎉', '🎊', '✨', '🎈', '🎁', '⭐'][Math.floor(Math.random() * 6)]}
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 animate-bounce-in max-w-4xl px-8">
        {/* Giant emoji */}
        <div className="text-9xl animate-bounce">{holidayEmoji}</div>

        {/* Holiday message */}
        <h1 className="text-7xl font-black text-white drop-shadow-2xl tracking-wider">
          HAPPY {holidayName.toUpperCase()}!
        </h1>

        {/* Friendly message */}
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border-4 border-white/50 shadow-2xl">
          <p className="text-3xl text-white font-bold mb-4">
            🎊 No Learning Today! 🎊
          </p>
          <p className="text-xl text-white/90 leading-relaxed">
            It's a special day! Go have fun, celebrate, and enjoy your holiday!<br />
            The Learnverse will be here waiting for you tomorrow! ✨
          </p>
        </div>

        {/* Holiday bonus */}
        <div className="bg-yellow-400/90 backdrop-blur-xl rounded-2xl p-6 border-4 border-yellow-300 shadow-2xl animate-pulse">
          <p className="text-2xl font-bold text-gray-800">
            🎁 Holiday Bonus: +500 Coins! 🪙
          </p>
        </div>

        {/* Fun activities suggestion */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30">
          <p className="text-xl text-white font-semibold mb-3">
            Things to do today:
          </p>
          <div className="grid grid-cols-2 gap-4 text-lg text-white/90">
            {holidayName === 'Christmas' && (
              <>
                <div>🎁 Open presents!</div>
                <div>🍪 Eat cookies!</div>
                <div>❄️ Play in the snow!</div>
                <div>👨‍👩‍👧‍👦 Spend time with family!</div>
              </>
            )}
            {holidayName === 'Halloween' && (
              <>
                <div>🍬 Go trick-or-treating!</div>
                <div>👻 Dress up in costumes!</div>
                <div>🎃 Carve pumpkins!</div>
                <div>🍭 Eat candy!</div>
              </>
            )}
            {holidayName === "New Year's Day" && (
              <>
                <div>🎆 Watch fireworks!</div>
                <div>🎊 Make resolutions!</div>
                <div>🥳 Celebrate!</div>
                <div>😴 Sleep in!</div>
              </>
            )}
            {holidayName === 'Thanksgiving' && (
              <>
                <div>🦃 Eat turkey!</div>
                <div>🥧 Have pie!</div>
                <div>🙏 Be thankful!</div>
                <div>👨‍👩‍👧‍👦 Family time!</div>
              </>
            )}
            {holidayName.includes('Birthday') && (
              <>
                <div>🎂 Eat birthday cake!</div>
                <div>🎁 Open presents!</div>
                <div>🎈 Have a party!</div>
                <div>🎉 Celebrate YOU!</div>
              </>
            )}
          </div>
        </div>

        {/* Emergency exit (for parents/admins) */}
        <button
          onClick={() => {
            const override = prompt('Enter override code (for parents only):');
            if (override === 'PARENT2024') {
              setIsHoliday(false);
            }
          }}
          className="text-white/50 text-sm hover:text-white/80 transition-colors"
        >
          Parent Override
        </button>
      </div>

      {/* Animated border */}
      <div className="absolute inset-0 border-8 border-white/30 pointer-events-none animate-pulse" />
    </div>
  );
}
