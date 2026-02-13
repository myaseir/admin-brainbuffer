"use client";
import { useState, useEffect } from "react";
import { setBotDifficulty, getBotDifficulty } from "./actions";
import { Zap, User, Loader2, Brain } from "lucide-react";

// Update the type to match your new server actions
type DifficultyMode = "god" | "human" | "intelligent";

export default function BotToggle() {
  const [difficulty, setDifficulty] = useState<DifficultyMode>("god");
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync with Redis on load
  useEffect(() => {
    getBotDifficulty().then((mode) => setDifficulty(mode as DifficultyMode));
  }, []);

  const toggle = async (mode: DifficultyMode) => {
    setIsUpdating(true);
    try {
      await setBotDifficulty(mode);
      setDifficulty(mode);
    } catch (error) {
      console.error("Failed to update difficulty:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Match Bot System
          </span>
          <h3 className="text-white font-black text-sm uppercase">Global Difficulty</h3>
        </div>
        {isUpdating && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
      </div>

      <div className="flex bg-slate-900 p-1.5 rounded-xl gap-1.5 border border-slate-800/50">
        {/* HUMAN MODE */}
        <button
          disabled={isUpdating}
          onClick={() => toggle("human")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg transition-all ${
            difficulty === "human" 
              ? "bg-slate-700 text-blue-400 shadow-lg scale-[1.02]" 
              : "text-slate-500 hover:text-slate-300 grayscale opacity-60"
          }`}
        >
          <User size={18} /> 
          <span className="text-[10px] font-black uppercase">Human</span>
        </button>

        {/* INTELLIGENT MODE (New) */}
        <button
          disabled={isUpdating}
          onClick={() => toggle("intelligent")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg transition-all ${
            difficulty === "intelligent" 
              ? "bg-purple-500/10 text-purple-400 shadow-lg border border-purple-500/20 scale-[1.02]" 
              : "text-slate-500 hover:text-slate-300 grayscale opacity-60"
          }`}
        >
          <Brain size={18} /> 
          <span className="text-[10px] font-black uppercase">Intel</span>
        </button>

        {/* GOD MODE */}
        <button
          disabled={isUpdating}
          onClick={() => toggle("god")}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg transition-all ${
            difficulty === "god" 
              ? "bg-red-500/10 text-red-500 shadow-lg border border-red-500/20 scale-[1.02]" 
              : "text-slate-500 hover:text-slate-300 grayscale opacity-60"
          }`}
        >
          <Zap size={18} /> 
          <span className="text-[10px] font-black uppercase">God</span>
        </button>
      </div>
      
      <p className="mt-3 text-[10px] text-slate-500 text-center italic">
  {difficulty === "intelligent" && "Targeting fixed score: 240, 280, or 300"}  {/* 👈 Update this */}
  {difficulty === "god" && "Bot stays +20 ahead of human"}
  {difficulty === "human" && "Bot mimics player skill levels"}
</p>
    </div>
  );
}