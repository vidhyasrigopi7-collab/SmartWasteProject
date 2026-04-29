import { useState } from "react";

function PublicMode({ goBack }) {
  const [page, setPage] = useState("welcome");
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showAnswerOptions, setShowAnswerOptions] = useState(false);

  const [level1Score, setLevel1Score] = useState(0);
  const [level2Score, setLevel2Score] = useState(0);

  const level1Questions = [
    { question: "Where should plastic bottles go?", options: ["Dry Waste","Wet Waste","Hazardous"], answer: "Dry Waste", explanation: "Plastic bottles are recyclable dry waste." },
    { question: "Where should banana peels go?", options: ["Wet Waste","Dry Waste","E-Waste"], answer: "Wet Waste", explanation: "Banana peels are biodegradable wet waste." },
    { question: "Where should batteries go?", options: ["Hazardous","Wet Waste","Dry Waste"], answer: "Hazardous", explanation: "Batteries contain harmful chemicals." },
    { question: "Where should paper go?", options: ["Dry Waste","Wet Waste","Medical"], answer: "Dry Waste", explanation: "Paper is recyclable dry waste." },
    { question: "Where should leftover food go?", options: ["Wet Waste","Dry Waste","Hazardous"], answer: "Wet Waste", explanation: "Food waste is biodegradable." },
    { question: "Where should glass bottles go?", options: ["Dry Waste","Wet Waste","E-Waste"], answer: "Dry Waste", explanation: "Glass is recyclable." },
    { question: "Where should old medicines go?", options: ["Hazardous","Dry Waste","Wet Waste"], answer: "Hazardous", explanation: "Medicines can be dangerous." },
    { question: "Where should leaves go?", options: ["Wet Waste","Dry Waste","Plastic"], answer: "Wet Waste", explanation: "Leaves decompose naturally." },
    { question: "Where should cardboard go?", options: ["Dry Waste","Wet Waste","Hazardous"], answer: "Dry Waste", explanation: "Cardboard is recyclable." },
    { question: "Where should broken electronics go?", options: ["E-Waste","Wet Waste","Dry Waste"], answer: "E-Waste", explanation: "Electronics are e-waste." },
  ];

  const level2Questions = [
    { question: "How many years does plastic take to decompose?", options: ["50 Years","450 Years","5 Years"], answer: "450 Years", explanation: "Plastic can take around 450 years." },
    { question: "What color bin is used for dry waste?", options: ["Blue","Green","Red"], answer: "Blue", explanation: "Blue bins are used for dry waste." },
    { question: "What color bin is for wet waste?", options: ["Green","Blue","Red"], answer: "Green", explanation: "Green bins are for wet waste." },
    { question: "What gas is released from landfills?", options: ["Methane","Oxygen","Nitrogen"], answer: "Methane", explanation: "Landfills release methane gas." },
    { question: "Which waste can be recycled?", options: ["Plastic","Food","Leaves"], answer: "Plastic", explanation: "Plastic can often be recycled." },
    { question: "How can we reduce waste?", options: ["Reuse","Burn","Throw"], answer: "Reuse", explanation: "Reusing reduces waste." },
    { question: "Which is hazardous?", options: ["Battery","Paper","Food"], answer: "Battery", explanation: "Batteries are hazardous." },
    { question: "What is composting?", options: ["Turning food waste into manure","Burning waste","Throwing plastic"], answer: "Turning food waste into manure", explanation: "Composting creates manure." },
    { question: "What should be avoided?", options: ["Single-use plastic","Cloth bags","Steel bottles"], answer: "Single-use plastic", explanation: "Single-use plastic increases pollution." },
    { question: "Why recycle?", options: ["Save resources","Increase waste","Cause pollution"], answer: "Save resources", explanation: "Recycling saves resources." },
  ];

  const currentQuestions = level === 1 ? level1Questions : level2Questions;
  const currentQuestion = currentQuestions[questionIndex];

  const handleAnswer = (option) => {
    if (option === currentQuestion.answer) {
      if (level === 1) setLevel1Score(level1Score + 1);
      else setLevel2Score(level2Score + 1);

      setFeedback(`✅ Correct! ${currentQuestion.explanation}`);
    } else {
      setFeedback(
        `❌ Wrong! Correct Answer: ${currentQuestion.answer}. ${currentQuestion.explanation}`
      );
    }
  };

  const nextQuestion = () => {
    setFeedback("");
    setShowAnswerOptions(false);

    if (questionIndex + 1 < currentQuestions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      if (level === 1) {
        setPage("level1Complete");
      } else {
        setPage("final");
      }
    }
  };

  const progress =
    level === 1
      ? ((questionIndex + 1) / 10) * 50
      : 50 + ((questionIndex + 1) / 10) * 50;

  if (page === "welcome") {
    return (
      <div className="public-page">
        <button onClick={goBack}>⬅ Home</button>
        <h1>♻ Eco Warrior Challenge</h1>
        <p>Play a fun interactive game and gain knowledge about waste management!</p>
        <button onClick={() => setPage("game")}>Start Game</button>
      </div>
    );
  }

  if (page === "level1Complete") {
    return (
      <div className="public-page">
        <h1>🎉 Level 1 Completed!</h1>
        <h2>Your Score: {level1Score}/10</h2>
        <button
          onClick={() => {
            setLevel(2);
            setQuestionIndex(0);
            setPage("game");
          }}
        >
          Start Level 2
        </button>
      </div>
    );
  }

  if (page === "final") {
    return (
      <div className="public-page">
        <h1>🏆 Challenge Completed!</h1>
        <h2>Level 1 Score: {level1Score}/10</h2>
        <h2>Level 2 Score: {level2Score}/10</h2>
        <h1>Total Score: {level1Score + level2Score}/20</h1>
        <button onClick={goBack}>⬅ Home</button>
      </div>
    );
  }

  return (
    <div className="public-page">
      <button onClick={goBack}>⬅ Home</button>

      <h1>{level === 1 ? "🎯 Level 1 - Quiz Round" : "🧠 Level 2 - Smart Guess"}</h1>

      <div
        style={{
          width: "80%",
          background: "#333",
          borderRadius: "10px",
          margin: "20px auto",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            background: "#00ff99",
            padding: "10px",
            borderRadius: "10px",
            textAlign: "center",
            color: "black",
            fontWeight: "bold",
          }}
        >
          {Math.floor(progress)}%
        </div>
      </div>

      <h2>{currentQuestion.question}</h2>

      {level === 2 && !showAnswerOptions && !feedback && (
        <>
          <button onClick={() => setShowAnswerOptions(true)}>I have an idea 💡</button>
          <button
            onClick={() =>
              setFeedback(
                `ℹ ${currentQuestion.answer}. ${currentQuestion.explanation}`
              )
            }
          >
            I don’t know 🤔
          </button>
        </>
      )}

      {(level === 1 || showAnswerOptions) &&
        currentQuestion.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt)}>
            {opt}
          </button>
        ))}

      {feedback && (
        <>
          <p>{feedback}</p>
          <button onClick={nextQuestion}>Next ➡</button>
        </>
      )}
    </div>
  );
}

export default PublicMode;