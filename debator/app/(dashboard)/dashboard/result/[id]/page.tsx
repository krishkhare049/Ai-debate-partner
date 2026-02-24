"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ResultCard from "@/components/result/ResultCard";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ResultPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const debateId = params.id;

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const res = await api.get(`/result/${debateId}`);
      setResult(res.data);
    } catch (err) {
      toast.error("Failed to load result");
    } finally {
      setLoading(false);
    }
  };

 const shareResult = () => {

  const url = `${window.location.origin}/public/debate/${debateId}`;

  navigator.clipboard.writeText(url);

  toast.success("Link copied!");
};
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">
        Debate Result
      </h1>

      <ResultCard result={result} />

      <button
        onClick={() => router.push("/debate")}
        className="w-full bg-black text-white p-3 rounded-lg"
      >
        Start New Debate
      </button>
<button
  onClick={shareResult}
  className="w-full border p-3 rounded-lg"
>
  Share Result
</button>
    </div>
  );
}