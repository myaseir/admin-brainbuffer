"use client";
import { useState, useEffect } from "react";
import { setBotDifficulty, getBotDifficulty } from "./actions";
import { Zap, User, Loader2 } from "lucide-react";

export default function BotToggle() {
  const [difficulty, setDifficulty] = useState<"god" | "human">("god");
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync with Redis on load
  useEffect(() => {
    getBotDifficulty().then(setDifficulty);
  }, []);

  const toggle = async (mode: "god" | "human") => {
    setIsUpdating(true);
    await setBotDifficulty(mode);
    setDifficulty(mode);
    setIsUpdating(false);
  };

  return (
    <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 w-full max-w-xs">
      <div className="flex justify-between items-center mb-4">
        <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
          AI Difficulty
        </span>
        {isUpdating && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
      </div>

      <div className="flex bg-slate-900 p-1 rounded-xl gap-1">
        <button
          onClick={() => toggle("human")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
            difficulty === "human" 
              ? "bg-slate-700 text-blue-400 shadow-inner" 
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <User size={16} /> <span className="text-sm font-bold">Human</span>
        </button>

        <button
          onClick={() => toggle("god")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
            difficulty === "god" 
              ? "bg-red-500/10 text-red-500 shadow-inner border border-red-500/20" 
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Zap size={16} /> <span className="text-sm font-bold">God</span>
        </button>
      </div>
    </div>
  );
}