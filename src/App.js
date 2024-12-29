import React from "react";
import "./App.css";
import MemoryGame from "./MemoryGame"; // Import with curly braces

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <MemoryGame />
    </div>
  );
}

export default App;
