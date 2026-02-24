"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/leaderboard");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  const topThree = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="text-yellow-500" />
        <h1 className="text-3xl font-bold">
          Leaderboard
        </h1>
      </div>

      <p className="text-gray-600">
        Top debaters ranked by completed debates and performance.
      </p>

      {/* Top 3 */}
      <div className="grid md:grid-cols-3 gap-4">
        {topThree.map((user, index) => (
          <div
            key={user.userId}
            className={`p-6 rounded-2xl shadow-lg text-center relative
              ${
                index === 0
                  ? "bg-yellow-100"
                  : index === 1
                  ? "bg-gray-100"
                  : "bg-orange-100"
              }`}
          >
            <div className="text-4xl mb-2">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </div>

            <div className="w-14 h-14 mx-auto rounded-full bg-gray-400 mb-3" />

            <h3 className="font-semibold">
              {user.name}
            </h3>

            <p className="text-sm text-gray-600">
              {user.completed} debates
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {user.plan}
            </p>
          </div>
        ))}
      </div>

      {/* Rest List */}
      <div className="space-y-3">
        {rest.map((user, index) => (
          <div
            key={user.userId}
            className="flex justify-between items-center p-4 rounded-xl bg-white shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              
              <div className="font-bold text-lg w-8 text-center">
                #{index + 4}
              </div>

              <div className="w-10 h-10 rounded-full bg-gray-300" />

              <div>
                <p className="font-semibold">
                  {user.name}
                </p>

                <p className="text-xs text-gray-500">
                  {user.plan}
                </p>
              </div>
            </div>

            <div className="font-bold">
              {user.completed}
              <span className="text-sm text-gray-500 ml-1">
                debates
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}