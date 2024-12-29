import React, { useState, useEffect } from "react";
import "./App.css";

const TootCloud = ({ expression }) => (
  <svg viewBox="0 0 100 80" className="w-full h-full">
    <path
      d="M 25,60 
         a 20,20 0 0,1 0,-40 
         a 25,25 0 0,1 50,0 
         a 20,20 0 0,1 0,40 
         z"
      fill="#f5f5f5"
      className="drop-shadow-md"
    />
    <text
      x="50"
      y="45"
      fontSize="24"
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#666"
    >
      {expression}
    </text>
  </svg>
);

function TootGame() {
  const moveInterval = React.useRef(null);
  const [showVictory, setShowVictory] = useState(false);
  const [popcornPosition, setPopcornPosition] = useState({ x: 0, y: 0 });
  const [isPopcornFlying, setIsPopcornFlying] = useState(false);
  const [score, setScore] = useState(0);
  const [tootExpression, setTootExpression] = useState("o.0");
  const [tootPosition, setTootPosition] = useState({ x: 50, y: 50 });
const [audioError, setAudioError] = useState("");
const tootSound = React.useRef(null);
const victorySound = React.useRef(null);

useEffect(() => {
  // Load audio file when component mounts
  try {
    tootSound.current = new Audio(require("./assets/tootfart.wav"));
    victorySound.current = new Audio(require("./assets/tootlevel.mp3"));
    tootSound.current.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      setAudioError("Failed to load audio");
    });
    victorySound.current.addEventListener("error", (e) => {
      console.error("Victory audio error:", e);
      setAudioError("Failed to load victory audio");
    });
    console.log("Audio created:", tootSound.current);
  } catch (err) {
    console.error("Audio creation error:", err);
    setAudioError("Failed to create audio");
  }
}, []);

  useEffect(() => {
    const moveToot = () => {
      const time = Date.now() / 1000;
      const centerX = 50;
      const centerY = 50;
      const radiusX = 30;
      const radiusY = 20;

      const x = centerX + radiusX * Math.sin(time);
      const y = centerY + radiusY * Math.sin(time * 2);

      setTootPosition({ x, y });
    };

    moveInterval.current = setInterval(moveToot, 16);
    return () => {
      if (moveInterval.current) {
        clearInterval(moveInterval.current);
      }
    };
  }, []);

  const throwPopcorn = (e) => {
    if (isPopcornFlying) return;

    const gameArea = e.currentTarget.getBoundingClientRect();
    const endX = e.clientX - gameArea.left;
    const endY = e.clientY - gameArea.top;

    setPopcornPosition({ x: 50, y: 400 });
    setIsPopcornFlying(true);

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const duration = 800;

      if (elapsed < duration) {
        const progress = elapsed / duration;
        const currentX = 50 + (endX - 50) * progress;
        const currentY =
          400 + (endY - 400 - 300 * Math.sin(Math.PI * progress)) * progress;

        setPopcornPosition({ x: currentX, y: currentY });
        requestAnimationFrame(animate);
      } else {
        setIsPopcornFlying(false);

        const hitDistance = 65;
        const hitX = endX;
        const hitY = endY;
        const tootX = (tootPosition.x * gameArea.width) / 150;
        const tootY = (tootPosition.y * gameArea.height) / 150;

        if (
          Math.abs(hitX - tootX) < hitDistance &&
          Math.abs(hitY - tootY) < hitDistance
        ) {
          const newScore = score + 1;
          setScore(newScore);
          setTootExpression("^-^");

          if (tootSound.current) {
            tootSound.current.currentTime = 0; // Reset the audio
            tootSound.current
              .play()
              .then(() => console.log("Sound played successfully"))
              .catch((err) => {
                console.error("Sound play failed:", err);
                setAudioError("Failed to play sound");
              });
          }

         if (newScore === 5) {
           setShowVictory(true);
           if (moveInterval.current) {
             clearInterval(moveInterval.current);
           }
           if (victorySound.current) {
             victorySound.current.play().catch((err) => {
               console.error("Victory sound play failed:", err);
               setAudioError("Failed to play victory sound");
             });
           }
         } else {
           setTimeout(() => setTootExpression("o.0"), 800);
         }
        }
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 p-4">
      <div
        className="game-area relative w-full max-w-2xl h-96 bg-blue-100 cursor-pointer rounded-lg shadow-lg"
        onClick={throwPopcorn}
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Score */}
          <div className="absolute top-4 left-4 text-xl font-bold">
            Score: {score}
            {audioError && (
              <div className="text-red-500 text-sm">{audioError}</div>
            )}
          </div>

          {/* Toot */}
          <div
            className="toot-character absolute w-20 h-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${tootPosition.x}%`,
              top: `${tootPosition.y}%`,
            }}
          >
            <TootCloud expression={tootExpression} />
          </div>

          {/* Popcorn */}
          {isPopcornFlying && (
            <div
              className="absolute w-4 h-4"
              style={{
                left: `${popcornPosition.x}px`,
                top: `${popcornPosition.y}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              🍿
            </div>
          )}
        </div>

        {/* Victory Message */}
        {showVictory && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center">
              <h2 className="text-2xl font-bold mb-4">🎉 Victory! 🎉</h2>
              <p className="mb-4">
                You've successfully fed Toot enough popcorn!
              </p>
              <p className="text-lg font-semibold">The secret keyword is:</p>
              <p className="text-2xl font-bold text-purple-600 my-2">
                CLOUDSNACK
              </p>
              <p className="text-sm text-gray-600">
                Tell this to Toot in Discord!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TootGame;
