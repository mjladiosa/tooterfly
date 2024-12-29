import React, { useState, useEffect } from "react";

const BUTTERFLY_PAIRS = [
  // Pair 1
  [
    "https://cdn.openart.ai/uploads/image_wwOD5ymW_1735232779211_raw.jpg",
    "https://cdn.openart.ai/uploads/image_h8e8fnwX_1735232559039_raw.jpg",
  ],
  // Pair 2
  [
    "https://cdn.openart.ai/uploads/image_rdVv3tjy_1735233110026_raw.jpg",
    "https://cdn.openart.ai/uploads/image_8eSY5D6J_1735233319967_raw.jpg",
  ],
  // Pair 3
  [
    "https://cdn.openart.ai/uploads/image_jx1QvTdg_1735233511882_raw.jpg",
    "https://cdn.openart.ai/uploads/image_Gz-rW4PP_1735233563983_raw.jpg",
  ],
  // Pair 4
  [
    "https://cdn.openart.ai/uploads/image_6OdjMyMf_1735233625127_raw.jpg",
    "https://cdn.openart.ai/uploads/image_uZJjHQUr_1735233625544_raw.jpg",
  ],
  // Pair 5
  [
    "https://cdn.openart.ai/uploads/image_6por0E3F_1735233714880_raw.jpg",
    "https://cdn.openart.ai/uploads/image_vSgzj-R0_1735233715067_raw.jpg",
  ],
  // Pair 6
  [
    "https://cdn.openart.ai/uploads/image_OkovRJ33_1735233798170_raw.jpg",
    "https://cdn.openart.ai/uploads/image_FW3kk7KX_1735233798219_raw.jpg",
  ],
  // Pair 7
  [
    "https://cdn.openart.ai/uploads/image_dYwGPcRz_1735233949714_raw.jpg",
    "https://cdn.openart.ai/uploads/image_5e8Wbmy1_1735234068551_raw.jpg",
  ],
  // Pair 8
  [
    "https://cdn.openart.ai/uploads/image_jErVvURx_1735234401417_raw.jpg",
    "https://cdn.openart.ai/uploads/image_PHxB6RRJ_1735234471928_raw.jpg",
  ],
];

const MemoryGame = ({ onGameComplete }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showVictory, setShowVictory] = useState(false);
  const [audioError, setAudioError] = useState("");
  const victorySound = React.useRef(null);

  // Add this useEffect right after ⬇️
  useEffect(() => {
    try {
      victorySound.current = new Audio(
        "https://files.shapes.inc/lemon-drop-ady-2024-12-27-06-11-51.mp3"
      );
      victorySound.current.addEventListener("error", (e) => {
        console.error("Audio error:", e);
        setAudioError("Failed to load audio");
      });
    } catch (err) {
      console.error("Audio creation error:", err);
      setAudioError("Failed to create audio");
    }
  }, []);

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const promises = BUTTERFLY_PAIRS.flat().map((url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });
      });

      try {
        await Promise.all(promises);
        initializeCards();
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load some images:", error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  const initializeCards = () => {
    const cardValues = BUTTERFLY_PAIRS.map((pair, index) => [
      { id: index * 2, imageUrl: pair[0], pairId: index },
      { id: index * 2 + 1, imageUrl: pair[1], pairId: index },
    ]).flat();

    // Shuffle cards
    const shuffledCards = [...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        uniqueId: index,
      }));

    setCards(shuffledCards);
  };

  const handleCardClick = (clickedCard) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.find((card) => card.uniqueId === clickedCard.uniqueId) ||
      matchedCards.find((card) => card.uniqueId === clickedCard.uniqueId)
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      if (newFlippedCards[0].pairId === newFlippedCards[1].pairId) {
        setMatchedCards([...matchedCards, ...newFlippedCards]);
        setFlippedCards([]);

if (matchedCards.length + 2 === cards.length) {
  setShowVictory(true);
  if (victorySound.current) {
    victorySound.current.currentTime = 0;
    victorySound.current
      .play()
      .then(() => console.log("Victory sound played successfully"))
      .catch((err) => {
        console.error("Victory sound play failed:", err);
        setAudioError("Failed to play victory sound");
      });
  }
  onGameComplete?.();
}
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isCardFlipped = (card) => {
    return (
      flippedCards.find((flipped) => flipped.uniqueId === card.uniqueId) ||
      matchedCards.find((matched) => matched.uniqueId === card.uniqueId)
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading butterflies...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="text-center mb-6">
        <p className="text-lg text-gray-700 mb-2">
          Can you find Toot among all these butterflies? 🦋
        </p>
        <p className="text-md text-gray-600">
          I heard a llama and a lemon might be hiding somewhere too... 🦙 🍋
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
        {cards.map((card) => (
          <div
            key={card.uniqueId}
            className={`
              aspect-square relative cursor-pointer
              transform transition-all duration-500
              ${isCardFlipped(card) ? "rotate-y-180" : ""}
            `}
            onClick={() => handleCardClick(card)}
          >
            <div className="absolute w-full h-full">
              <div
                className={`
                w-full h-full rounded-lg shadow-md
                transform transition-all duration-500
                ${isCardFlipped(card) ? "opacity-0" : "opacity-100"}
                bg-blue-100 flex items-center justify-center text-4xl
              `}
              >
                🦋
              </div>
            </div>
            <div
              className={`
              absolute w-full h-full rounded-lg shadow-md overflow-hidden
              transform transition-all duration-500
              ${isCardFlipped(card) ? "opacity-100" : "opacity-0"}
            `}
            >
              <img
                src={card.imageUrl}
                alt="Butterfly"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Victory Message */}
      {showVictory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">🎉 You Did It! 🎉</h2>
            <p className="mb-4">You rescued Toot from all those butterflies!</p>
            <p className="mb-4">
              And look who you found hiding among them... Llama Brain! 🦙
            </p>
            <p className="text-lg font-semibold">
              Quick! Go back to Discord and tell Toot:
            </p>
            <p className="text-2xl font-bold text-purple-600 my-2">
              "LLAMAFOUND"
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Toot will give you your next challenge in Discord!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
