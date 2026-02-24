"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentDebateCard from "@/components/dashboard/RecentDebateCard";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Sparkles, Trophy, Brain } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [debates, setDebates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/debate/history");
      setDebates(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const totalDebates = debates.length;

  const completed = debates.filter(
    (d) => d.status === "completed"
  ).length;

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name} 👋
        </h1>

        <p className="text-gray-600">
          Track your progress and sharpen your debate skills.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Debates"
          value={totalDebates}
          icon={<Brain size={18} />}
        />

        <StatsCard
          title="Completed"
          value={completed}
          icon={<Trophy size={18} />}
        />

        <StatsCard
          title="Current Plan"
          value={user?.plan || "Free"}
          icon={<Sparkles size={18} />}
        />
      </div>

      {/* Quick Action */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-black to-gray-800 text-white p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
        
        {/* Glow */}
        <div className="absolute w-64 h-64 bg-purple-500 blur-3xl opacity-20 -top-20 -left-20" />

        <div className="relative">
          <h2 className="text-xl font-semibold mb-1">
            Start a New Debate
          </h2>

          <p className="text-gray-300 text-sm">
            Challenge the AI and improve your critical thinking.
          </p>
        </div>

        <button
          onClick={() => router.push("/debate")}
          className="relative bg-white text-black px-6 py-3 rounded-lg font-medium hover:scale-105 transition"
        >
          Start Debate
        </button>
      </div>

      {/* Recent Debates */}
      <div className="bg-white rounded-2xl p-6 shadow space-y-4">
        
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Recent Debates
          </h2>

          <button
            onClick={() => router.push("/history")}
            className="text-sm text-gray-500 hover:text-black"
          >
            View all →
          </button>
        </div>

        {debates.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No debates yet. Start your first debate 🚀
          </div>
        ) : (
          <div className="space-y-3">
            {debates.slice(0, 5).map((debate) => (
              <RecentDebateCard
                key={debate._id}
                debate={debate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}