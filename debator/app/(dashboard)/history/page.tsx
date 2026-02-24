"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import DebateHistoryCard from "@/components/dashboard/DebateHistoryCard";
import toast from "react-hot-toast";
import { Search, Trophy, Brain, XCircle } from "lucide-react";

export default function HistoryPage() {
  const [debates, setDebates] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let data = [...debates];

    if (query) {
      const q = query.toLowerCase();
      data = data.filter((d) =>
        d.topic?.toLowerCase().includes(q)
      );
    }

    if (filter === "win") {
      data = data.filter((d) => d.result === "win");
    }

    if (filter === "loss") {
      data = data.filter((d) => d.result === "loss");
    }

    setFiltered(data);
  }, [query, filter, debates]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/debate/history");
      setDebates(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const wins = debates.filter((d) => d.result === "win").length;
  const losses = debates.filter((d) => d.result === "loss").length;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <div className="h-32 bg-gray-200 animate-pulse rounded-2xl" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-black to-gray-800 text-white p-6">
        <div className="absolute w-72 h-72 bg-purple-500 blur-3xl opacity-20 -top-20 -left-20" />

        <h1 className="text-3xl font-bold">
          Debate History
        </h1>

        <p className="text-gray-300 mt-1">
          Review your debates and track your progress over time.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-xl bg-white shadow flex items-center gap-4">
          <Brain className="text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold">{debates.length}</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white shadow flex items-center gap-4">
          <Trophy className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Wins</p>
            <p className="text-xl font-bold">{wins}</p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white shadow flex items-center gap-4">
          <XCircle className="text-red-500" />
          <div>
            <p className="text-sm text-gray-500">Losses</p>
            <p className="text-xl font-bold">{losses}</p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        
        <div className="relative w-full md:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            placeholder="Search debates..."
            className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {["all", "win", "loss"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize transition
                ${
                  filter === f
                    ? "bg-black text-white"
                    : "border hover:bg-gray-100"
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No debates found
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-4">
        {filtered.map((debate) => (
          <DebateHistoryCard
            key={debate._id}
            debate={debate}
          />
        ))}
      </div>
    </div>
  );
}