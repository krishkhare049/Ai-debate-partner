"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Loader2,
  Copy,
  Check,
  Flag,
} from "lucide-react";

export default function DebateChatPage() {
  const router = useRouter();
  const params = useParams();

  // ✅ SAFE PARAM EXTRACTION
  const debateId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : undefined;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showEndDialog, setShowEndDialog] = useState(false);
  const [makePublic, setMakePublic] = useState(true);

  const [isCompleted, setIsCompleted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ================= FETCH DEBATE =================

  useEffect(() => {
    if (!debateId) return;
    fetchDebate();
  }, [debateId]);

  // const fetchDebate = async () => {
  //   try {
  //     setLoading(true);

  //     const res = await api.get(`/debate/${debateId}`);
  //     setMessages(res.data.messages || []);
  //   } catch (err) {
  //     toast.error("Failed to load debate");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchDebate = async () => {
  try {
    setLoading(true);

    const res = await api.get(`/debate/${debateId}`);

    const debateData = res.data;

    console.log("Fetched debate data:", debateData.debate.status);

    // ✅ if completed → redirect to result
    if (debateData.debate.status === "completed") {
      // router.replace(`/result/${debateId}`);
      // return;
      setIsCompleted(true);
    }

    setMessages(debateData.messages || []);

  } catch (err) {
    toast.error("Failed to load debate");
  } finally {
    setLoading(false);
  }
};

  // ================= AUTO SCROLL =================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, aiTyping]);

  // ================= SEND MESSAGE =================

  const sendMessage = async () => {
    if (!input.trim() || sending || !debateId) return;

    try {
      setSending(true);
      setAiTyping(true);

      const userText = input;
      setInput("");

      // optimistic update
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now(),
          sender: "user",
          content: userText,
          createdAt: new Date(),
        },
      ]);

      const res = await api.post("/debate/message", {
        debateId,
        content: userText,
      });

      setMessages((prev) => [
        ...prev,
        res.data.aiMessage,
      ]);
    // } catch (err) {
    //   toast.error("Error sending message");
    // } 
    }
    catch (err: any) {
  const message =
    err?.response?.data?.message || "Error sending message";

  // ✅ debate already completed
  if (message.toLowerCase().includes("completed")) {
    toast.error("Debate already completed");

    router.replace(`/result/${debateId}`);
    return;
  }

  toast.error(message);
}
    finally {
      setSending(false);
      setAiTyping(false);
    }
  };

  // ================= END DEBATE =================

  const confirmEndDebate = async () => {
    if (!debateId) {
      toast.error("Invalid debate session");
      return;
    }

    try {
      await api.post("/debate/end", {
        debateId,
        isPublic: makePublic,
      });

      router.push(`/result/${debateId}`);
    } catch (err) {
      toast.error("Failed to end debate");
    }
  };

  // ================= LOADING SCREEN =================

  if (!debateId || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-[100dvh] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-300">

        {/* ================= HEADER ================= */}
        <div className="flex-shrink-0 border-b bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="font-semibold text-lg">
                AI Debate Session 🧠🔥
              </h1>
              <p className="text-sm text-gray-500">
                Challenge the AI with your arguments
              </p>
            </div>

            {
              !isCompleted ? (

            <button
            disabled={isCompleted}
              onClick={() => setShowEndDialog(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition bg-red-500 hover:scale-105"
            >
              <Flag size={16} />
              End Debate
            </button>
              ):(
                  <button
            disabled={!isCompleted}
              onClick={() => {router.push(`/result/${debateId}`)}}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-black transition bg-blue-300 hover:scale-105"
            >
              <Flag size={16} />
              View Result
            </button>
              )
            }
            
          </div>
        </div>

        {/* ================= MESSAGES ================= */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-4">

            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                sender={msg.sender}
                content={msg.content}
                timestamp={msg.createdAt}
              />
            ))}

            {aiTyping && <TypingIndicator />}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* ================= INPUT ================= */}
        <div className="flex-shrink-0 border-t bg-white p-4">
          <div className="max-w-3xl mx-auto flex gap-3 items-center">

            {/* <input
              className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={input}
              disabled={sending}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your argument..."
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            /> */}

            <input
  className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
  value={input}
  disabled={sending || isCompleted}
  onChange={(e) => setInput(e.target.value)}
  placeholder={
    isCompleted
      ? "Debate finished"
      : "Enter your argument..."
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") sendMessage();
  }}
/>

            <button
              onClick={sendMessage}
              // disabled={sending}
                disabled={sending || isCompleted}
              className={`flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:scale-105 transition ${
                isCompleted ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {sending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Send size={16} />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= END MODAL ================= */}
      {showEndDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 space-y-4">

            <h2 className="text-lg font-semibold">
              End Debate
            </h2>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={makePublic}
                onChange={(e) =>
                  setMakePublic(e.target.checked)
                }
              />
              Make this debate public
            </label>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowEndDialog(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmEndDebate}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                End Debate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= MESSAGE BUBBLE ================= */

function MessageBubble({
  sender,
  content,
  timestamp,
}: {
  sender: "user" | "ai";
  content: string;
  timestamp?: string;
}) {
  const [copied, setCopied] = useState(false);

  const isUser = sender === "user";

  const copyText = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`flex gap-3 group ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">
          AI
        </div>
      )}

      <div className="max-w-[75%]">

        <div
          className={`relative p-4 rounded-2xl shadow-sm
            ${
              isUser
                ? "bg-black text-white rounded-br-sm"
                : "bg-white border rounded-bl-sm"
            }`}
        >
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>

          <button
            onClick={copyText}
            className={`absolute -top-3 ${
              isUser ? "-left-3" : "-right-3"
            } opacity-0 group-hover:opacity-100 transition bg-white border rounded-full p-1 shadow`}
          >
            {copied ? (
              <Check size={14} />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>

        {timestamp && (
          <p className="text-xs text-gray-400 mt-1 px-1">
            {new Date(timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">
          You
        </div>
      )}
    </div>
  );
}

/* ================= TYPING ================= */

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">
        AI
      </div>

      <div className="bg-white border rounded-2xl px-4 py-3 flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
      </div>
    </div>
  );
}