"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import MessageBubble from "@/components/debate/MessageBubble";
import ResultCard from "@/components/result/ResultCard";

export default function PublicDebatePage({
  params
}: {
  params: { id: string };
}) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDebate();
  }, []);

  const fetchDebate = async () => {
    const res = await api.get(
      `/public/debate/${params.id}`
    );

    setData(res.data);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Public Debate
      </h1>

      <p className="text-gray-600">
        Topic: {data.debate.topic}
      </p>

      <div className="space-y-3">
        {data.messages.map((msg: any, i: number) => (
          <MessageBubble
            key={i}
            sender={msg.sender}
            content={msg.content}
          />
        ))}
      </div>

      <ResultCard result={data.result} />

    </div>
  );
}