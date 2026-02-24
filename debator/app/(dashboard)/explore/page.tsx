"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Search, MessageSquare } from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();

  const [debates, setDebates] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchDebates();
  }, []);

  useEffect(() => {
    if (!query) return setFiltered(debates);

    const q = query.toLowerCase();
    setFiltered(
      debates.filter((d) =>
        d.topic?.toLowerCase().includes(q)
      )
    );
  }, [query, debates]);

  const fetchDebates = async () => {
    try {
      const res = await api.get("/public/debates");
      setDebates(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load debates");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Explore Public Debates
        </h1>

        <p className="text-gray-600">
          Discover debates from the community and learn from different perspectives.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-3 text-gray-400"
        />

        <input
          placeholder="Search topics..."
          className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No debates found
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((debate) => (
          <div
            key={debate._id}
            onClick={() =>
              router.push(`/public/debate/${debate._id}`)
            }
            className="p-5 rounded-xl bg-white shadow hover:shadow-xl transition cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm">
              <MessageSquare size={16} />
              Public Debate
            </div>

            <h3 className="font-semibold text-lg group-hover:text-black">
              {debate.topic}
            </h3>

            <p className="text-xs text-gray-500 mt-3">
              {new Date(debate.createdAt).toLocaleDateString()}
            </p>

            {/* Optional stats */}
            <div className="flex justify-between text-xs text-gray-400 mt-4">
              <span>{debate.messages?.length || 0} messages</span>
              <span>View →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}