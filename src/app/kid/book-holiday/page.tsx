'use client';

import { useState, useEffect } from 'react';

export default function BookHolidayPage() {
  const [kidName, setKidName] = useState('');
  const [parentName, setParentName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveType, setLeaveType] = useState<'paid' | 'unpaid'>('paid');
  const [showLetter, setShowLetter] = useState(false);
  const [aiApproved, setAiApproved] = useState(true);
  const [parentDecision, setParentDecision] = useState<'pending' | 'approved' | 'denied'>('pending');
  const [totalDays, setTotalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [paidDaysUsed, setPaidDaysUsed] = useState(0);

  useEffect(() => {
    // Load kid and parent data
    const currentKid = localStorage.getItem('currentKid');
    if (currentKid) {
      const kid = JSON.parse(currentKid);
      setKidName(kid.name || 'Kid');
      setParentName(kid.parentName || 'Parent');
    }

    // Load used paid days
    const usedPaidDays = localStorage.getItem('paidDaysUsed');
    setPaidDaysUsed(usedPaidDays ? parseInt(usedPaidDays) : 0);
  }, []);

  // Calculate days and cost
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
      setTotalDays(diffDays);

      if (leaveType === 'paid') {
        const remainingPaidDays = 10 - paidDaysUsed;
        const paidDaysForThisRequest = Math.min(diffDays, remainingPaidDays);
        setTotalCost(paidDaysForThisRequest * 10);
      } else {
        setTotalCost(diffDays * 0.01);
      }
    }
  }, [startDate, endDate, leaveType, paidDaysUsed]);

  const checkReasonWithAI = (reason: string): boolean => {
    // AI Reason Checker™ logic
    const lowerReason = reason.toLowerCase();
    
    // Get work history (lessons completed, streak, etc.)
    const lessonsCompleted = localStorage.getItem('lessonsCompleted') || '0';
    const currentStreak = localStorage.getItem('currentStreak') || '0';
    const isSlacking = parseInt(lessonsCompleted) < 5 || parseInt(currentStreak) < 3;

    // Good reasons (always approved)
    const goodReasons = ['family', 'trip', 'vacation', 'sick', 'emergency', 'visit', 'travel', 'wedding', 'holiday', 'celebration'];
    const hasGoodReason = goodReasons.some(word => lowerReason.includes(word));

    // Bad reasons (denied if slacking)
    const badReasons = ['dont want', 'do not want', 'lazy', 'tired', 'bored', 'dude like', 'just because'];
    const hasBadReason = badReasons.some(phrase => lowerReason.includes(phrase));

    if (hasGoodReason) {
      return true; // Always approve good reasons
    }

    if (hasBadReason && isSlacking) {
      return false; // Deny bad reasons if slacking
    }

    // Default: approve if working hard, deny if slacking
    return !isSlacking;
  };

  const handleSubmitRequest = () => {
    if (!startDate || !endDate || !reason.trim()) {
      alert('Please fill out all fields!');
      return;
    }

    if (leaveType === 'paid' && totalDays > (10 - paidDaysUsed)) {
      alert(`You only have ${10 - paidDaysUsed} paid days left! Switch to unpaid or reduce days.`);
      return;
    }

    // Run AI checker
    const approved = checkReasonWithAI(reason);
    setAiApproved(approved);
    setShowLetter(true);
    setParentDecision('pending');
  };

  const handleParentDecision = (approved: boolean) => {
    if (approved) {
      // Deduct coins
      const currentKid = localStorage.getItem('currentKid');
      if (currentKid) {
        const kid = JSON.parse(currentKid);
        const currentCoins = kid.coins || 0;
        
        if (currentCoins >= totalCost) {
          kid.coins = currentCoins - totalCost;
          localStorage.setItem('currentKid', JSON.stringify(kid));

          // Update paid days if paid leave
          if (leaveType === 'paid') {
            const newPaidDaysUsed = paidDaysUsed + totalDays;
            localStorage.setItem('paidDaysUsed', newPaidDaysUsed.toString());
            setPaidDaysUsed(newPaidDaysUsed);
          }

          // Store holiday booking
          const bookings = JSON.parse(localStorage.getItem('holidayBookings') || '[]');
          bookings.push({
            kidName,
            startDate,
            endDate,
            reason,
            leaveType,
            days: totalDays,
            cost: totalCost,
            approved: true,
            date: new Date().toISOString()
          });
          localStorage.setItem('holidayBookings', JSON.stringify(bookings));

          setParentDecision('approved');
          alert(`🎉 Holiday approved! ${totalCost} coins deducted. Enjoy your ${totalDays} days off!`);
        } else {
          alert(`Not enough coins! You need ${totalCost} coins but only have ${currentCoins}.`);
        }
      }
    } else {
      setParentDecision('denied');
      alert('❌ Holiday request denied by parent.');
    }
  };

  const handleBackToForm = () => {
    setShowLetter(false);
    setParentDecision('pending');
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (showLetter && parentDecision === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
          {/* Letter Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-3xl font-bold text-gray-800">Parent Notification</h1>
          </div>

          {/* Letter Content */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border-4 border-yellow-400 mb-6">
            <div className="text-lg text-gray-800 space-y-4">
              <p className="font-semibold">Dear {parentName},</p>
              
              <p>
                It looks like <span className="font-bold text-blue-600">{kidName}</span> is booking a holiday for:
              </p>
              
              <div className="bg-white rounded-lg p-4 my-4 border-2 border-blue-300">
                <p className="italic text-gray-700">"{reason}"</p>
              </div>

              <div className="space-y-2 text-sm">
                <p><strong>Dates:</strong> {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}</p>
                <p><strong>Total Days:</strong> {totalDays} days</p>
                <p><strong>Leave Type:</strong> {leaveType === 'paid' ? '💰 Paid Leave' : '🆓 Unpaid Leave'}</p>
                <p><strong>Cost:</strong> {totalCost} coins</p>
              </div>

              <p className="font-semibold text-xl mt-6">
                Do you want to allow this or deny?
              </p>
            </div>

            {/* AI Checker Notice (if denied) */}
            {!aiApproved && (
              <div className="mt-6 bg-red-100 border-2 border-red-400 rounded-lg p-4">
                <p className="text-red-800 text-sm font-semibold">
                  ⚠️ This was denied by the Reason Checker™
                </p>
                <p className="text-red-700 text-xs mt-2">
                  The AI detected this reason may not be valid based on work history. Do you still want to approve?
                </p>
              </div>
            )}
          </div>

          {/* Decision Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleParentDecision(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg transform hover:scale-105 transition"
            >
              ✅ YES - Approve
            </button>
            <button
              onClick={() => handleParentDecision(false)}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg transform hover:scale-105 transition"
            >
              ❌ NO - Deny
            </button>
          </div>

          <button
            onClick={handleBackToForm}
            className="mt-6 w-full bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            ← Back to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">🏖️</div>
          <h1 className="text-5xl font-bold text-white mb-2">Book a Holiday!</h1>
          <p className="text-white text-xl">Take a break from learning! 🎉</p>
        </div>

        {/* Stats Box */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-8 text-white">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{10 - paidDaysUsed}</div>
              <div className="text-sm">Paid Days Left</div>
              <div className="text-xs opacity-75">(10 coins/day)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">∞</div>
              <div className="text-sm">Unpaid Days</div>
              <div className="text-xs opacity-75">(0.01 coins/day)</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="space-y-6">
            {/* Leave Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Leave Type:</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setLeaveType('paid')}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition ${
                    leaveType === 'paid'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  💰 Paid Leave
                  <div className="text-sm font-normal">(10 coins/day, max {10 - paidDaysUsed} days)</div>
                </button>
                <button
                  onClick={() => setLeaveType('unpaid')}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition ${
                    leaveType === 'unpaid'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  🆓 Unpaid Leave
                  <div className="text-sm font-normal">(0.01 coins/day, unlimited)</div>
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={getTodayDate()}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || getTodayDate()}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Reason for Holiday:</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Family trip to the beach, visiting grandparents, etc."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none h-32 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Tip: The AI Reason Checker™ will review your reason!
              </p>
            </div>

            {/* Summary */}
            {totalDays > 0 && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border-2 border-purple-300">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Request Summary:</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Total Days:</strong> {totalDays} days</p>
                  <p><strong>Total Cost:</strong> {totalCost} coins</p>
                  <p><strong>Leave Type:</strong> {leaveType === 'paid' ? '💰 Paid' : '🆓 Unpaid'}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitRequest}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-4 rounded-xl font-bold text-xl shadow-lg transform hover:scale-105 transition"
            >
              📨 Send Request to Parent
            </button>

            {/* Back Button */}
            <a
              href="/kid"
              className="block text-center text-gray-600 hover:text-gray-800 font-semibold"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
