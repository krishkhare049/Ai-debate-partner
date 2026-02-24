"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";
import { User, Trophy, Brain } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/debate/history");

      const debates = res.data;

      setStats({
        total: debates.length,
        completed: debates.filter(
          (d: any) => d.status === "completed"
        ).length,
      });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <div className="h-40 bg-gray-200 animate-pulse rounded-xl" />
        <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      
      {/* Profile Header */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-black to-gray-800" />

        {/* Avatar + Info */}
        <div className="bg-white p-6 pt-0">
          <div className="-mt-12 flex items-center gap-4">
            
            <div className="w-20 h-20 rounded-full bg-gray-300 border-4 border-white flex items-center justify-center">
              <User size={32} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {user?.name}
              </h2>

              <p className="text-gray-500 text-sm">
                {user?.email}
              </p>

              <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-black text-white">
                {user?.plan || "Free"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        
        <div className="p-5 rounded-xl bg-white shadow flex items-center gap-4">
          <Brain className="text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">
              Total Debates
            </p>
            <p className="text-xl font-bold">
              {stats.total}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white shadow flex items-center gap-4">
          <Trophy className="text-gray-600" />
          <div>
            <p className="text-sm text-gray-500">
              Completed Debates
            </p>
            <p className="text-xl font-bold">
              {stats.completed}
            </p>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        <h3 className="text-lg font-semibold">
          Account Information
        </h3>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-gray-500">
              Name:
            </span>{" "}
            {user?.name}
          </p>

          <p>
            <span className="text-gray-500">
              Email:
            </span>{" "}
            {user?.email}
          </p>

          <p>
            <span className="text-gray-500">
              Plan:
            </span>{" "}
            {user?.plan || "Free"}
          </p>
          <p>
  Plan Expires:
  {user?.planExpiresAt
    ? new Date(user.planExpiresAt).toLocaleDateString()
    : "N/A"}
</p>
        </div>
      </div>
    </div>
  );
}