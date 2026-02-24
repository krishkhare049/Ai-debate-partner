"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";

import ResultCard from "@/components/result/ResultCard";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();

  const debateId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : undefined;

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH RESULT =================

  useEffect(() => {
    if (!debateId) return;

    fetchResult();
  }, [debateId]);

  const fetchResult = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/result/${debateId}`);

      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load result");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  // ================= NOT FOUND =================

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <p className="text-gray-500">Result not found</p>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ================= PAGE =================

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-50 to-gray-200 p-6">

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Result Card */}
        <ResultCard result={result} />

      </div>
    </div>
  );
}