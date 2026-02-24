"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Sparkles, Loader2 } from "lucide-react";

export default function StartDebatePage() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [stance, setStance] = useState("support");
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState("logical");

  const startDebate = async () => {
    if (!topic) {
      toast.error("Enter a topic");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/debate/start", {
        topic,
        userStance: stance,
        personality,
      });

      router.push(`/debate/${res.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const personalities = [
    {
      id: "logical",
      title: "Logical",
      desc: "Facts, reasoning, and structured arguments",
    },
    {
      id: "aggressive",
      title: "Aggressive",
      desc: "Challenging and confrontational debate style",
    },
    {
      id: "friendly",
      title: "Friendly",
      desc: "Polite, supportive, and conversational",
    },
    {
      id: "political",
      title: "Political",
      desc: "Strategic and persuasive arguments",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-6">
      
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            Start a New Debate 🧠🔥
          </h1>

          <p className="text-gray-600">
            Choose a topic and challenge the AI with your arguments.
          </p>
        </div>

        {/* Topic */}
        <div className="space-y-2">
          <label className="font-medium">
            Debate Topic
          </label>

          <div className="relative">
            <Sparkles
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              placeholder="Should AI replace human jobs?"
              className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
        </div>

        {/* Stance */}
        <div className="space-y-2">
          <label className="font-medium">
            Your Stance
          </label>

          <div className="flex gap-3">
            {["support", "oppose"].map((s) => (
              <button
                key={s}
                onClick={() => setStance(s)}
                className={`flex-1 py-2 rounded-lg font-medium capitalize transition
                  ${
                    stance === s
                      ? "bg-black text-white"
                      : "border hover:bg-gray-100"
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Personality */}
        <div className="space-y-3">
          <label className="font-medium">
            AI Personality
          </label>

          <div className="grid grid-cols-2 gap-3">
            {personalities.map((p) => (
              <button
                key={p.id}
                onClick={() => setPersonality(p.id)}
                className={`p-3 rounded-xl border text-left transition hover:shadow
                  ${
                    personality === p.id
                      ? "bg-black text-white border-black"
                      : "bg-white"
                  }
                `}
              >
                <p className="font-semibold">
                  {p.title}
                </p>

                <p
                  className={`text-xs mt-1 ${
                    personality === p.id
                      ? "text-gray-300"
                      : "text-gray-500"
                  }`}
                >
                  {p.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={startDebate}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Starting Debate...
            </>
          ) : (
            "Start Debate"
          )}
        </button>
      </div>
    </div>
  );
}