// Utility to play sound effects for Lab items
export function playLabSound(itemName: string) {
  let src = "";
  switch (itemName) {
    case "Explosive":
    case "Strong Explosive":
      src = "/sounds/explosion.mp3";
      break;
    case "Weak Explosive":
      src = "/sounds/pop.mp3";
      break;
    case "Medium Explosive":
      src = "/sounds/bang.mp3";
      break;
    case "Chemical Bottle":
      src = "/sounds/bubbles.mp3";
      break;
    case "Spinner":
      src = "/sounds/spin.mp3";
      break;
    case "Apple":
      src = "/sounds/apple.mp3";
      break;
    case "Rocket":
      src = "/sounds/rocket.mp3";
      break;
    case "Water":
      src = "/sounds/splash.mp3";
      break;
    case "Fire":
      src = "/sounds/fire.mp3";
      break;
    case "Robot":
      src = "/sounds/robot.mp3";
      break;
    case "Magnet":
      src = "/sounds/magnet.mp3";
      break;
    case "Ball":
      src = "/sounds/bounce.mp3";
      break;
    case "Book":
      src = "/sounds/pageflip.mp3";
      break;
    case "Star":
      src = "/sounds/twinkle.mp3";
      break;
    case "Crystal":
      src = "/sounds/crystal.mp3";
      break;
    case "Paint":
      src = "/sounds/paint.mp3";
      break;
    case "Building":
      src = "/sounds/building.mp3";
      break;
    case "Tree":
      src = "/sounds/tree.mp3";
      break;
    default:
      src = "";
  }
  if (src) {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play();
  }
}
