"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { unlockAchievement } from '@/utils/achievements';

export default function SpookyGhostPage() {
  const router = useRouter();
  const [showFake404, setShowFake404] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [dotPosition, setDotPosition] = useState({ x: 80, y: 20 });
  const [glitchLevel, setGlitchLevel] = useState(0);
  const [staticNoise, setStaticNoise] = useState(false);
  const [distortedText, setDistortedText] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dotFollowsMouse, setDotFollowsMouse] = useState(false);
  const [pageStartTime] = useState(Date.now());

  useEffect(() => {
    unlockAchievement('ghost');
    if (showFake404 || showWarning) return;

    // Track mouse position for "what was that?" effect
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
      
      // If dot is following mouse, update its position to cursor
      if (dotFollowsMouse) {
        setDotPosition({ x, y });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // "nope no way" - track quick page exits (under 3 seconds)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSpent = Date.now() - pageStartTime;
        if (timeSpent < 3000) {
          // They closed it within 3 seconds!
          if (typeof window !== 'undefined') {
            localStorage.setItem('ghost_quick_exit', 'true');
            localStorage.setItem('ghost_quick_exit_time', timeSpent.toString());
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Random "WHAT THE" event - intense glitch and kick out
    const whatTheInterval = setInterval(() => {
      if (Math.random() < 0.03) { // 3% chance every 5 seconds = rare event
        // WHAT THE moment!
        setIsGlitching(true);
        setStaticNoise(true);
        setGlitchLevel(1);
        
        // Ultra glitch sequence
        setTimeout(() => {
          setIsFrozen(true);
        }, 300);
        
        setTimeout(() => {
          setStaticNoise(false);
        }, 600);
        
        setTimeout(() => {
          // KICK THEM OUT
          if (typeof window !== 'undefined') {
            localStorage.setItem('ghost_what_the', 'true');
          }
          router.push('/kid');
        }, 1500);
      }
    }, 5000);

    // Random "what was that?" event - dot follows mouse
    const whatWasThatInterval = setInterval(() => {
      if (Math.random() < 0.05 && !dotFollowsMouse) { // 5% chance
        setDotFollowsMouse(true);
        // Stop following after 3-7 seconds
        setTimeout(() => {
          setDotFollowsMouse(false);
        }, 3000 + Math.random() * 4000);
      }
    }, 4000);

    // Random glitch effects
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setGlitchLevel(Math.random());
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000 + Math.random() * 5000);

    // Random 10-second freezes
    const freezeInterval = setInterval(() => {
      setIsFrozen(true);
      setTimeout(() => setIsFrozen(false), 10000);
    }, 20000 + Math.random() * 30000); // Random between 20-50 seconds

    // Move the lurking dot (only when not following mouse)
    const dotInterval = setInterval(() => {
      if (!dotFollowsMouse) {
        setDotPosition({
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5
        });
      }
    }, 3000 + Math.random() * 4000);

    // Static noise effect
    const staticInterval = setInterval(() => {
      setStaticNoise(true);
      setTimeout(() => setStaticNoise(false), 100);
    }, 8000 + Math.random() * 10000);

    // Distorted text
    const textGlitches = [
      'L̴̢̛͚̈́e̶̮͗a̸̧̒r̸͈̈́n̵̰̏v̴͖̇e̸̗͘r̷̰͝s̷̰̈́e̸̞̕',
      'Ļ̴̨̢̨̨̧̨̢̡̢̧̡̨̧̛̛̛̛̛̩͓̜͉̰͚͕̺̫̺͎̖̼̮̖̗̘̜̻̹͉̫͇̖͓͇̻̠̼̼̭̜̮̦̻̪̞͈̬̹̩̮̥̹̹͔̠̭̣̣̬̩̭͖̪̪̗̫̩̩̮̰̪̘̘̪͔̞̙̤̜̠̼̼̰̺̞̙̣̺̠̣̥̗̪͔̭̻̪̫̝̼̿͛̈́͐̈̍̽̋̀̌̊̊͂̍͋̅̈̎̏͊̍͛͒̆̒̓̐͆͊̈́̉̓̀̐͂̉̔̾̈́̌̏̌́̈́̃̋̑͆̿͋̎͌́̏͑̓̉̈́̄̍̏̈͆̾̓̽̇̃͐͛͆̏̌̈́́̎͗͛͊̈̊̾̇͑̅̂̓̒̀̇̅͑̓̐̅͋̾̇̆̑̾̏̈́͑̇̉͌͐̑̀̓͑͛̄̌͌́̇̏̎͊̀͋̊̆̄̍͑͊̔͑̈́̽̓͊̆̒̇͌̔̈́̊͆̚̚̕͘̚̚̕͘͘͘͘̕̚͘͜͜͜͜͜͜͝͝͝͝͠͝͝͝͝͝͠͝͠͝͠͝ͅͅͅͅͅe̶̡̧̛͙̘̣̮͍̳͖̼̙̯̮͔͍̣̘̜̝̙͉̣̪̓̆̓́̿̏̈́̀̈̈́̀̌̾̇͗̇̈̄̈́̽̽̿͊̒̈̉̉̎̅̎͑̀͌̂̊͒̂̽̋͒̀̒͌̈́͑͆̓́̉͑̈́̌͛͛̍́͒̌̿̀̐̓̍͛̇̈́͌̄̃͑̌̚̚͘͘͘̚̚͘̚͝͝͝͝͝͝͠͝a̶̢̧̨̨̢̢̧̡̢̨̨̡̡̨̧̡̛̛̛̛̛̳͇̺̻̮̟̼̖̘͚̯̱̳͚̼̦̮̭̣̦̹̫̱̼̝͇̳̠̱̪̖̯̩̬̦̝̣̺̤̩̮̫̝̭̺̠̰̙̻͖̳̠͉̪͕̰̘̖̗̘̝̻̱̹̦͕̮͕̦͎͖̳̪̭̞̱̘̻̠̹̟͖͉̰̬̯̘̖͕̦͔̝̬̺̹̮̭̬̜̥͈̲͚̯͎̪̼̼͙̞̼̻̮̼̫̞̯̱̫̠͉͌̉̎̾̽̂̽̓̍̀̾̿̈́̒̋͛̋͒͋̋̂͆̆̀̈́̀͒̈́̊̏͊̅̍͂̐̈̽̓̿̾̔͐̉̐̈́̄̎͌̈́̄͛̎̋͒̔́͋͊̓̓̈́͗͂̿̎̒̐̀̃̈́̎͊͆̏̓̄̍̋̉̾̂̌̆̄̀̃̎͆̄̈͊͌̓̍̽̄̊̾͌̿̇̀̾̇̈́̀̀̆͐̽̅̀̊̿̊̃͂͑͗͑̓̿͛̈́̐̏̏̓̈́̋̔̾̈͋̈̀̍̇̊̋̈̅̉͛̇̀̈́̍̎͛̃̉̈́̂̎̀̌̿͋͋͂̂̾̏̊̉̉͌̅̿͗̑̋̿̏̐̍͊͗̏̿̓̍̑̐̓͐̅̏̎̊̇̇̈̐̒͛̎̓̋̋͆̌̂̒̓͆̀̈̍̀̃̄̄̀̊͊̔̊̓̈́̈̌̌̊͗͑́͆̿́͒̓̈̓̚̚͘͘̕͘̕̚̚̕̚̕̕͜͜͜͜͜͜͜͜͝͠͝͝͝͠͠ͅͅͅͅͅr̵̢̢̧̢̢̧̧̨̧̧̨̨̧̧̧̢̧̢̡̡̛̛̛̛̛̛̛̛̛̛̺̮̫̦̘̻̦̺̖̘̫̜͚̗̠̯̼̦̜̥̣̠̯̟͚̯̘͔͚͚̲͔̘̪̗̗̪̬͚̪͇͇͔̖̗͉̠̯̠̳̻̲̣̜̲̖ǹ̷̨̢̢̡̢̖̯̖̝̙̪̝͖̳̥̭̹̜̺̙͚̯̭̪̺̟̗̭̖͇̠̫̭̘̝̗̖͇̙͖̟͎̟̳͈͔̗͇̭̩̰̗̤̟̘͓͔͔̹̦̜̺͇̲͙̤̯̰͔̦̦͎̲̩̼̯̘͇̱͕͎͔̱̦̠͚̠͕̙̖͕̯̪̤͎̼̳̬̱̤͈̳̥̇͋͛͗̇̎̒̑̔̈́̃̄͛̈́͆̎̽̔̒̈́̆̍͐̽̌̀̋́xͅv̶̡̧̢̨̡̨̧̡̧̧̡̢̡̧̨̡̢̧̡̨̢̨̡̨̢̨̧̡̛̛̛̛̛̛̛̥̦͍͍̳̱̣̺̟̺̞̠̩̫̪̭̜̬̤̠̪̞̳̞̫̜͚̝̫̰̠̘̠̯̫̜̹̳̖͕̙͖̲͔͕͍̥̬͇̜̝͔̞̤̦̠͍̮̺͓̝͎̙̱͎̰̝̠̫̱̯̫̙̥̮̞͚̮͕͈͙͖̠̭̱̤̮̱͇͍̗̭͉͕̱̳̥̝̪̼̹̖̹̼̦̜̻̰̖̰̤̣͚̱̙͙̳̟̰͓͙͓̬̙̰̺̞͓̝̭̱̻͈͓̖̖̺̳̘͚͈̻̦͍̯̟͍̩̭͓͙̮̻̰̘̝̫̥̯̖̗̰̘̘͚̣̳̦̥̥͖̱̱̟͔̥̰̮̰̳̭̮̠̰̻̖͖̮̪̘̘̖̞̳͖̫̘̬̗̜͚̠̥̞̫͉̻̥̺̺̠̫̦̭͇̪̝̼̝̮̗̗̰̝͖͖̙̹̩͍͚̬̫̠̝̳̥̥̺̪̣̟̲̬̲̩̗͓̻̱̘̞͖͚̪̲̟͍̼̪̼̰̩̦͖͇́̔̇͐͊̀̌͂̉̃̈́̊̋̾̏͐̌̒͗̾́̆͗̂͋̿͗̀̃̃̈́͒́͑̂́͛̋̀̑͋̈̀̐͌̋͂̈́̓̃͌̌̒̆̀̎̅̒͂̔̍̇́̇́͆̏̐̄̀̏̈́͒̐̋͐̃̾͊̒̑̊̌̌͑͛͆̎͐̏̍͌̃̋̽̋͋̽̍̊͂̑̈́̈́̾̔̃̌̂̂̎̓̓̃̾͌̆̍̉̾̈͋̿̊̀̽͐̀̎͑̃͆̀͗͋̓̏͂̈̇̽͂̉̾͑̔̔̀̆̀͒͒̀̋́͊̿̒́̆̽̀́̄̌́͐́̏̈́̉̂̏̓̀͊̑́̏̿̀̉͂̎̽̍͌͂̈́̀̌̐͊̌̒̀̂̽̒͐̅̏̀̎̎̈́̓̓̂̌̾͑̅̆̑̍̉͒́̈́̾̊̈̒̈́͑̐̿͛͂̂͊̾͐̿̐̔̈́̊̑̐̓̽̇̂̿̓͂̇͊̐͐̾̊̍́̚̚̚̕̕̕̕̕̚̚̚̚̚̚̚̕͘͜͜͜͜͜͜͜͝͝͝͝͝͝͝͝͝͝͝͝͝͝͠͝͝͠͝͠͝͝͝͝͝ͅͅͅͅͅͅͅͅe̵̢̡̧̨̧̨̡̢̡̧̢̡̢̧̢̨̨̡̡̧̡̢̡̧̛̛̛̛̛̛̛̛̛̛̛̛̛͙̜̹͙̤̫̥̗͉̞̰̩̮̼̟͎̠͓̪̜̺̻͈̞͓̬̰͔̪̝̻̹̪̼̬͔̻͍̣̮͍̬͙͇̣̬̼̭̰̤̤̹̣̞̘̝̜͖͇̗̹͓̹̭͚̮̱̳̯͚̳̺͍̺̼̱̯̱̥͔͉̘̤̟̫̥̖͇̰̬̠̥̘̰̥̮̱̞͍̺̮̬̮̼̳̹͍͔̟͎̗̙͕͔̟͈̬̭̣͙̥̰̺̲̝̬̞͖̪̗̙͚̻̙̠̦̹̬͎̺̳̺̣͈̱̟̖̯̜͇̫͓̠̮̘͈͚̰̞̭̙̼̩̲͕̖̫̳̠͉̘̻͇̳̞̯͍͕̰͕͉̤̫͎̳̰̥̹͖̘͙̘̹͕̗̜̜͙͎͉͈̻̤̻̝̙̙͖̫̦̠̪̪̞͙͉̼̳͉̪̣̭̗̘̮͙͎̭̘̘̞͙̬͓̲͓͗́́̓͌̎̇̀͊͛̏̐̄̑̾̓́̀́̉̆̉̽̾̔̏͊̉̑̋͛̈́̾͑̐̉̈́̌͐̅͋́̌̎̈̋̓͂̈́̈̈̋͗̄͂̔̆́͌̀̓̂̇̈́̌̅͆̿̄́̑̂͒͗̇̆̈̒̏̈̆̋͊̑̇̽̒̍̍́́͛͐̀̍̒̈̿̂͒̔͆̍̏̍̈́̎͗̓͒̃̿̈́̈̈́̃̈́̀̀̏͋̃͊̀̏͑̉́̈̀̀̓͋͌̑̾̏̇̊̊͌̆̓̉̈̃͊̌̾̓̒̐͛̇͐́̈́̌͊̾́͗̄̓͌͂̂͂̔̒̆̊́̉̈̈́̉͂̾͋̽̌̐̅͆͊́́̾̿̍̈́̆̎̅̈́̄́̿́͌̏̏̍͆̌̀̓̄̈̐̑͛̾̏̓̌̈̎͊̽̆͂̓͌̾̅̐̃̏̍̀̏͗́̐̉̊͆͋́̏͋̔̋̄̔̂̍̑̃̐̈́̍̿̌̀̀́̽̐̊́̽̌̏͛͘̚̕̚̚͘̚̚̕̕̕̕̚͘͘̕̕͘̕̚͘̚͘͘̕͘͘͜͜͜͜͜͜͝͝͝͝͝͝͝͝͝͝͠͝͝͠͝͠͝͠͠͝͝͝͝͝͝͝͝͝͝͝͝͝ͅͅͅͅs̶̨̧̢̧̢̢̡̧̧̧̢̢̧̨̢̨̡̢̨̢̢̡̡̨̢̧̡̡̧̧̛̛̛̛̛̛̛̥̲̥̭̥͎̮͔̙̱̩̬̯͔̙̥̯̼̦̘̼̠̤̭̼̟̲̫̠̦͙̤̪̱͉̫̻̞͔̹͖̤͍̤̺̙̜̱̪͕̹͓͓̰̣̙͈̲͔̹̳̠̰̗̝͉͎͉̫̟̥̯̲̙͉̪͖͙͉͕̪̗͙͎̘̮͕̪̞̱̗̣̞͕͕̳͈̟̜̱̹͈͇̗̰̗̲̺̱̠̳̪̪͓̩͉͚̯͇͉̳͕̻̩̻̠̜͚̻͇̩̟̻͉̰̟͙͍̯̖͙̦̳̲̭̜̗͓͙̟̬̖̗̤͚̹̫̩̮̗̻̘̼͍̺̘̫͈͎̠͙̼̝͉̣͓̗̜̙̗͚̻͈̬̪̦͓̖͈̱̫͔͎̣̦̭̺̹̣̪͉͖͙͕͇̹̩̩̦̳̱̝̳̙̹͓̻̙̳̹͖̼̳̙̮̳̩͇̮̝̤̲̠̜̦͕̫̫̤̳̣͙̯̤͉͖͖̲̥̽̀̒͆̌́̾̓̔̓̏̐̐̊̈̀͗̀̓̓̀͂̅̀̊̓̃͑̋̈́́̓̈̿̋̑̏̌̌̋̇͂̃̐́̇̊̀͑̀̈̊̓̈͒̋͒̒̾̈́͐̍̈̒̀̿̃̂͆͂̂̈̌͛̂̾͌͊̾̑͂̌̈́̑͋͆̏̆̈́͌̀̽̑̎̅̉̊̍̋̓̐̑͋̌̀̾̉̿͒̽̍̓̑͆͌͐̎̅̋̂̀̈́̎̽̓̑̏̔̐͊͗̓̇̅͑͂̈́̈́̈́̂̈́̏̓̈́͗̉̔̀̀̆̒͊͒̽͋̈́͗̐̓͌̈́̿͌͒̉̔̌̈́̀͊̇̄̔̎̿̇̃̀͑͐̾̐͊̀̄̇͐̑̇̍̾͋̒̒̔̓̆̍̀̆̅͌̾̂̐̈́͐̀͒̈͑͋́͗̈̓̽̈́̓̀̓̂͆̐̎̏̋̽̐̽̿͌̐͗́̄̑͘̚̚̚͘̚͘̕̚̕̕͘̚̕͘̚̕̚̕̚͘̕̚͘̕̕̕͜͜͜͜͜͜͜͜͜͜͜͜͝͝͝͝͝͝͝͝͝͠͠͝͠͝͠͝͝͝͠͠͝͝͠͠ͅͅͅͅͅͅͅͅͅę̶̛̛̛̛̩̠̫̯̦̗̮̤͖͎̦͔̩͍͕̬̥́̑͒͆̋̽̀́͌͊̀̊̐͐̀́͐̔̏̐̋͑̊́̀̔́̎̆͗̌̿̊́́̌̈̓̌̔̅̍̐̉̄̂͊̀̍̐͒̿͆̊̅̃̉͗͋̌̾̉̿̈́́͒̾̂́̓̆́̏̀̀̑̑̌̃̽̃́̾̂̀̍̔̔̈́̑̌́̍̏͒͐̌͗͑̎̇̑̃̓̍̓̾̋̍̆͂̃̎̍̓̀̂̄̀̌̓̀̓͐̃͋̈́̀͆͊̓̃́́̒̑͂̿̎̿͑̓̓̓̈́̀̌̉͌̏̑̊̾̾͋̿͗́̈̈̂̈́̀̓͛̂͊̃̀̿̇͋̀̉̅̈́͒͛̔̍̆̿̔̀̔̀̏̊̒͗̆̀̀͒͂͐̏̓̈́̌̈́̇͛͂̃̓̓͂̆̍́̐̂̈́̒̑̽̐̇̋̏͂̾̈́̍̔̿̈́͐̿̅͊̃̊́͒̍̓̑͋̓̄̀̐́́̈̍̂̉̽͋̕̚̕͘̚̚̕̕̚̕̕̕̚̕͘̚̕͘͘̚͘͘͝͠͠͝͝͠͝͝͝͝͠͠͠͠͝͠ͅ',
      'Ĺ̶̡͓e̵̱͋a̶̦͐r̵̮̾ņ̸̈v̶̠̓ẻ̶͜r̶̻̓s̶͈̈́ë̶̳́',
      '𝔏𝔢𝔞𝔯𝔫𝔳𝔢𝔯𝔰𝔢',
      'L҉e҉a҉r҉n҉v҉e҉r҉s҉e҉'
    ];
    const textInterval = setInterval(() => {
      const randomText = textGlitches[Math.floor(Math.random() * textGlitches.length)];
      setDistortedText(randomText);
      setTimeout(() => setDistortedText(''), 500);
    }, 10000 + Math.random() * 15000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(whatTheInterval);
      clearInterval(whatWasThatInterval);
      clearInterval(glitchInterval);
      clearInterval(freezeInterval);
      clearInterval(dotInterval);
      clearInterval(staticInterval);
      clearInterval(textInterval);
    };
  }, [showFake404, showWarning, dotFollowsMouse, pageStartTime, router]);

  const handleDotClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount === 0) {
      // First click - glitch and warning
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 500);
    } else if (clickCount === 1) {
      // Second click - bigger glitch
      setIsGlitching(true);
      setStaticNoise(true);
      setTimeout(() => {
        setIsGlitching(false);
        setStaticNoise(false);
      }, 1000);
    } else if (clickCount >= 2) {
      // Third click or more - kick them out... OR DO THEY?
      const randomChance = Math.random();
      
      if (randomChance < 0.15) {
        // 15% chance - FAKE APP CRASH AND RESET! 😱
        setIsFrozen(true);
        setIsGlitching(true);
        
        // Backup their data
        if (typeof window !== 'undefined') {
          const backup = {
            currentKid: localStorage.getItem('currentKid'),
            kidAccounts: localStorage.getItem('kidAccounts'),
            aiBuddies: localStorage.getItem('aiBuddies'),
            customPages: {} as Record<string, string>
          };
          
          // Backup custom pages
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('customPage_') || key?.startsWith('kid_') || key?.startsWith('aibuddy_')) {
              backup.customPages[key] = localStorage.getItem(key) || '';
            }
          }
          
          // Store backup in a special ghost key
          localStorage.setItem('__ghost_backup__', JSON.stringify(backup));
          
          // Wait a moment then clear everything
          setTimeout(() => {
            localStorage.clear();
            // Keep the ghost backup
            localStorage.setItem('__ghost_backup__', JSON.stringify(backup));
            // Redirect to fake crash page
            router.push('/secretlearnverseitsaghostbutreallydontenterthisokalsowhyareyoueventypingthisitsnotmeantforkidsimeannotforkidsthatgetveryscared/crash');
          }, 2000);
        }
      } else if (randomChance < 0.65) {
        // 50% chance - Normal kick out
        setIsFrozen(true);
        setTimeout(() => {
          router.push('/kid');
        }, 2000);
      } else {
        // 35% chance - They survived! Turn everything red for a moment
        setGlitchLevel(1);
        setIsGlitching(true);
        setTimeout(() => {
          setIsGlitching(false);
          setGlitchLevel(0);
          setClickCount(0); // Reset
        }, 2000);
      }
    }
  };

  // Fake 404 page - click the 0 to reveal!
  if (showFake404) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-9xl font-bold text-gray-800 mb-4 select-none">
            4
            <span 
              onClick={() => {
                setShowFake404(false);
                setShowWarning(true);
              }}
              className="inline-block cursor-pointer hover:text-purple-600 transition-colors hover:scale-110 transform"
              title="👻"
            >
              0
            </span>
            4
          </h1>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/kid"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Go Home
          </Link>
          <p className="text-sm text-gray-400 mt-12">
            (psst... try clicking something 👀)
          </p>
        </div>
      </div>
    );
  }

  if (showWarning) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-gray-900 border-4 border-red-600 rounded-lg p-8 text-center animate-pulse">
          <div className="text-8xl mb-6 animate-bounce">⚠️</div>
          <h1 className="text-4xl font-bold text-red-500 mb-4">
            FINAL WARNING
          </h1>
          <p className="text-2xl text-gray-300 mb-6">
            You really shouldn&apos;t be here... 👻
          </p>
          <p className="text-lg text-gray-400 mb-8">
            This page contains spooky ghosts and mysterious things.
            <br />
            Not recommended for kids who get scared easily!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/kid"
              className="px-8 py-4 bg-green-600 text-white rounded-lg text-xl font-bold hover:bg-green-700 transition-colors"
            >
              🏃 GET ME OUT OF HERE!
            </Link>
            <button
              onClick={() => {
                setShowWarning(false);
              }}
              className="px-8 py-4 bg-red-600 text-white rounded-lg text-xl font-bold hover:bg-red-700 transition-colors"
            >
              👻 I&apos;M BRAVE!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen relative overflow-hidden transition-all duration-300 ${
        isFrozen ? 'filter grayscale' : ''
      }`}
      style={{
        background: isGlitching 
          ? `linear-gradient(${Math.random() * 360}deg, #1a1a1a, #${Math.floor(Math.random()*16777215).toString(16)})` 
          : 'linear-gradient(135deg, #2d3561 0%, #1f1f1f 100%)',
        filter: isGlitching ? `hue-rotate(${glitchLevel * 180}deg) contrast(${1 + glitchLevel * 0.3})` : 'sepia(0.3) brightness(0.7)'
      }}
    >
      {/* Dust particles / vignette */}
      <div className="fixed inset-0 pointer-events-none opacity-40" style={{
        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
        mixBlendMode: 'multiply'
      }} />

      {/* Static noise overlay */}
      {staticNoise && (
        <div 
          className="fixed inset-0 z-50 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='5' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            animation: 'noise 0.2s infinite'
          }}
        />
      )}

      {/* Frozen overlay */}
      {isFrozen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="text-6xl text-red-500 animate-pulse">
            ⚠️ CONNECTION LOST ⚠️
          </div>
        </div>
      )}

      {/* The lurking dot */}
      <div
        onClick={handleDotClick}
        className={`fixed rounded-full cursor-pointer transition-all ease-in-out hover:w-3 hover:h-3 z-30 ${
          dotFollowsMouse ? 'w-3 h-3 animate-pulse' : 'w-2 h-2 duration-3000'
        }`}
        style={{
          left: `${dotPosition.x}%`,
          top: `${dotPosition.y}%`,
          boxShadow: dotFollowsMouse 
            ? '0 0 12px rgba(255,0,0,0.9), 0 0 24px rgba(255,0,0,0.6)' 
            : '0 0 8px rgba(0,0,0,0.9)',
          opacity: dotFollowsMouse ? 0.8 : 0.6,
          backgroundColor: dotFollowsMouse ? '#ff0000' : '#000000'
        }}
        title={dotFollowsMouse ? "what was that?" : "..."}
      />

      {/* Old Forgotten Learnverse UI */}
      <div className="relative z-10 min-h-screen p-4">
        {/* Old header that looks broken */}
        <div className={`max-w-6xl mx-auto mb-12 transition-all ${isGlitching ? 'glitch' : ''}`}>
          <div className="flex items-center justify-between p-6 bg-gray-900 bg-opacity-40 rounded-lg border border-gray-700 border-opacity-50">
            <h1 
              className={`text-4xl md:text-5xl font-bold transition-all ${
                isGlitching ? 'text-red-400' : 'text-gray-300'
              }`}
              style={{
                textShadow: isGlitching ? '3px 3px 8px rgba(255,0,0,0.6)' : '2px 2px 4px rgba(0,0,0,0.8)',
                opacity: isGlitching ? 0.7 : 0.85
              }}
            >
              {distortedText || 'Learnverse'}
            </h1>
            <div className="text-right">
              <p className="text-sm text-gray-500 line-through">Last active: {isGlitching ? '?????' : '2019'}</p>
              <p className="text-xs text-red-400 mt-1">
                {isFrozen ? 'Disconnected' : isGlitching ? 'Corrupted' : 'Abandoned'}
              </p>
            </div>
          </div>
        </div>

        {/* Old welcome message */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className={`p-4 bg-blue-900 bg-opacity-20 border-l-4 ${isGlitching ? 'border-red-600' : 'border-blue-600 border-opacity-30'} rounded`}>
            <p className={`text-lg ${isGlitching ? 'text-red-300' : 'text-gray-400'}`}>
              {isGlitching ? 'W̷̨͠A̷̧̛R̷̢̛N̸̨̛I̸͜͝Ņ̷̛G̶̨͘' : 'Welcome back! Choose a lesson to continue learning...'}
            </p>
            {!isGlitching && <p className="text-xs text-gray-600 mt-2">⚠️ This version is no longer supported</p>}
          </div>
        </div>

        {/* Old lesson cards - look abandoned */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-400 mb-6 opacity-70">Your Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Math Basics', icon: '🧮', progress: '67%', status: 'incomplete' },
              { title: 'Science Lab', icon: '🔬', progress: '34%', status: 'error' },
              { title: 'Reading Time', icon: '📖', progress: '89%', status: 'corrupted' },
              { title: 'History', icon: '🏛️', progress: '12%', status: 'missing' },
              { title: 'Art Class', icon: '🎨', progress: '45%', status: 'broken' },
              { title: 'Music', icon: '🎵', progress: '78%', status: 'unavailable' }
            ].map((lesson, i) => (
              <div
                key={i}
                className={`p-6 rounded-lg border transition-all ${
                  isGlitching 
                    ? 'bg-red-900 bg-opacity-30 border-red-600' 
                    : 'bg-gray-800 bg-opacity-30 border-gray-600 border-opacity-30'
                }`}
                style={{
                  transform: isGlitching ? `rotate(${(Math.random() - 0.5) * 5}deg) translateY(${Math.random() * 10}px)` : 'none',
                  opacity: isGlitching ? 0.6 : 0.75
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`text-5xl ${isGlitching ? 'animate-pulse' : ''}`}>
                    {isGlitching ? '⚠️' : lesson.icon}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    isGlitching ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {isGlitching ? 'ERROR' : lesson.status}
                  </span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isGlitching ? 'text-red-300' : 'text-gray-300'}`}>
                  {isGlitching ? lesson.title.split('').map((char, idx) => 
                    Math.random() > 0.7 ? '█' : char
                  ).join('') : lesson.title}
                </h3>
                <div className="w-full bg-gray-700 bg-opacity-50 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full ${isGlitching ? 'bg-red-500' : 'bg-blue-500'} opacity-50`}
                    style={{ width: isGlitching ? `${Math.random() * 100}%` : lesson.progress }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {isGlitching ? 'DATA_CORRUPT' : `Progress: ${lesson.progress}`}
                </p>
                <button 
                  className={`mt-4 w-full py-2 rounded transition-all ${
                    isGlitching 
                      ? 'bg-red-800 text-red-200 cursor-not-allowed' 
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                  disabled
                >
                  {isGlitching ? 'UNAVAILABLE' : 'Continue'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Warning footer */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="p-6 bg-gray-900 bg-opacity-40 rounded-lg border border-red-900 border-opacity-30">
            <p className="text-sm text-gray-500 mb-2">
              ⚠️ System Status: {isFrozen ? 'FROZEN' : isGlitching ? 'CORRUPTED' : 'UNSTABLE'}
            </p>
            <p className="text-xs text-gray-600 mb-2">
              Click Warning: {clickCount}/3 | 
              {clickCount === 0 && " Something is lurking..."}
              {clickCount === 1 && " You shouldn't have done that..."}
              {clickCount === 2 && " One more and it all breaks..."}
              {clickCount >= 3 && " Too late..."}
            </p>
            <p className="text-xs text-yellow-600">
              {dotFollowsMouse && "👁️ what was that? | "}
              Anomalies detected: {Math.floor((Date.now() - pageStartTime) / 1000)}s
            </p>
          </div>
          
          <div className="text-center mt-6">
            <Link
              href="/kid"
              className="inline-block px-6 py-3 bg-green-700 bg-opacity-70 text-white rounded-lg text-lg font-bold hover:bg-green-600 transition-all"
            >
              ← Return to Current Version
            </Link>
          </div>
        </div>
      </div>

      {/* Glitch effects */}
      <style jsx>{`
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        .glitch {
          animation: glitch 0.3s infinite;
        }
        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}</style>
    </div>
  );
}
