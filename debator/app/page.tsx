"use client";

import Link from "next/link";
import { MessageSquare, Brain, Zap } from "lucide-react";
import useRedirectIfAuth from "./hooks/useRedirectIfAuth";

export default function Home() {
   useRedirectIfAuth();
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-900">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6">
        <h1 className="text-2xl font-bold">Debator K.I. 🧠🔥</h1>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="bg-black text-white px-5 py-2 rounded-lg hover:scale-105 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-12 pb-20">
        
        {/* Glow Effects */}
        <div className="absolute w-72 h-72 bg-purple-400 blur-3xl opacity-30 rounded-full top-10 left-10" />
        <div className="absolute w-72 h-72 bg-blue-400 blur-3xl opacity-30 rounded-full bottom-10 right-10" />

        <div className="relative max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Train Your Mind With Your
            <span className="block text-black">
              AI Debate Partner
            </span>
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            Debator helps you improve critical thinking, communication,
            and persuasion skills through real-time debates with AI.
            Practice arguments anytime — like having a personal coach.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/signup"
              className="bg-black text-white px-8 py-3 rounded-xl font-medium shadow hover:scale-105 transition"
            >
              Start Debating Free
            </Link>

            <Link
              href="/login"
              className="border border-black px-8 py-3 rounded-xl font-medium hover:bg-black hover:text-white transition"
            >
              Login
            </Link>
          </div>

          <p className="text-sm text-gray-500 pt-2">
            No credit card required • Free plan available
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">

          <div className="p-6 rounded-2xl bg-white shadow hover:shadow-xl transition">
            <MessageSquare className="mb-4" />
            <h3 className="font-semibold text-xl mb-2">
              Real-Time AI Debates
            </h3>
            <p className="text-gray-600">
              Engage in dynamic debates with AI that adapts to your reasoning
              and challenges your perspective.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow hover:shadow-xl transition">
            <Brain className="mb-4" />
            <h3 className="font-semibold text-xl mb-2">
              Critical Thinking Growth
            </h3>
            <p className="text-gray-600">
              Strengthen logic, reasoning, and persuasion skills through
              structured arguments and feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white shadow hover:shadow-xl transition">
            <Zap className="mb-4" />
            <h3 className="font-semibold text-xl mb-2">
              Confidence & Communication
            </h3>
            <p className="text-gray-600">
              Practice speaking for interviews, discussions, and public
              conversations with AI guidance.
            </p>
          </div>

        </div>
      </section>

      {/* Social Proof */}
      <section className="text-center pb-20 px-6">
        <h3 className="text-2xl font-semibold mb-6">
          Trusted by learners and professionals
        </h3>

        <p className="text-gray-600 max-w-2xl mx-auto">
          Whether you're preparing for interviews, improving communication,
          or sharpening critical thinking — Debator helps you grow faster.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-16 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Start Training Your Mind Today
        </h2>

        <p className="text-gray-300 mb-6">
          Join thousands improving their thinking and speaking skills.
        </p>

        <Link
          href="/signup"
          className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:scale-105 transition"
        >
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-8">
        © {new Date().getFullYear()} Debator by Khare Industries. All rights reserved.
      </footer>

    </main>
  );
}