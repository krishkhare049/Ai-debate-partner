// const OpenAI = require("openai");
// const { getPersonalityPrompt } = require("../prompts/personality.prompt");

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // ================= FALLBACK RESPONSES =================

// const fallbackReplies = [
//   "That's an interesting point, but I strongly disagree. Evidence suggests the opposite perspective holds more weight.",
//   "Your argument lacks sufficient supporting data. A broader analysis leads to a different conclusion.",
//   "While your position has merit, the opposing view provides stronger logical consistency.",
//   "Consider the long-term implications — they favor my stance significantly.",
// ];

// // ================= GENERATE AI REPLY =================

// const generateDebateReply = async (
//   topic,
//   aiStance,
//   messages,
//   personality
// ) => {
//   try {
//     // If no API key → dev mode fallback
//     if (!process.env.OPENAI_API_KEY) {
//       console.warn("⚠️ No OpenAI API key. Using fallback reply.");
//       return randomFallback();
//     }

//     const personalityText =
//       getPersonalityPrompt(personality);

//     const systemPrompt = `
// You are a professional debater.

// ${personalityText}

// Topic: ${topic}
// Your stance: ${aiStance}

// Rules:
// - Argue strongly
// - Be persuasive
// - Under 120 words
// `;

//     const chatMessages = [
//       { role: "system", content: systemPrompt },
//       ...messages.map((m) => ({
//         role: m.sender === "user" ? "user" : "assistant",
//         content: m.content,
//       })),
//     ];

//     const response =
//       await client.chat.completions.create({
//         model: "gpt-4.1-mini",
//         messages: chatMessages,
//         temperature: 0.7,
//       });

//     return (
//       response.choices?.[0]?.message?.content ||
//       randomFallback()
//     );

//   } catch (error) {
//     console.error("AI REPLY ERROR:", error);

//     // Quota exceeded or API error → fallback
//     return randomFallback();
//   }
// };

// // ================= SCORE DEBATE =================

// const scoreDebate = async (messages) => {
//   try {
//     if (!process.env.OPENAI_API_KEY) {
//       console.warn("⚠️ No API key. Using mock scoring.");
//       return mockScore();
//     }

//     const prompt = `
// Analyze this debate and decide winner.

// Return JSON ONLY:

// {
//  "winner": "user | ai | draw",
//  "logic": number,
//  "persuasion": number,
//  "clarity": number,
//  "analysis": "text"
// }

// Debate:
// ${JSON.stringify(messages)}
// `;

//     const response =
//       await client.chat.completions.create({
//         model: "gpt-4.1-mini",
//         messages: [
//           {
//             role: "system",
//             content: "You are a debate judge.",
//           },
//           { role: "user", content: prompt },
//         ],
//         temperature: 0,
//       });

//     const text =
//       response.choices?.[0]?.message?.content;

//     return safeJSONParse(text) || mockScore();

//   } catch (error) {
//     console.error("SCORE ERROR:", error);
//     return mockScore();
//   }
// };

// // ================= HELPERS =================

// function randomFallback() {
//   return fallbackReplies[
//     Math.floor(Math.random() * fallbackReplies.length)
//   ];
// }

// function safeJSONParse(text) {
//   try {
//     return JSON.parse(text);
//   } catch {
//     return null;
//   }
// }

// function mockScore() {
//   return {
//     winner: "draw",
//     logic: 7,
//     persuasion: 7,
//     clarity: 7,
//     analysis:
//       "This is a temporary analysis because AI scoring is unavailable.",
//   };
// }

// module.exports = {
//   generateDebateReply,
//   scoreDebate,
// };

const { GoogleGenAI } = require("@google/genai");
const { getPersonalityPrompt } = require("../prompts/personality.prompt");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ================= FALLBACK RESPONSES =================

const fallbackReplies = [
  "That's an interesting point, but I strongly disagree. Evidence suggests the opposite perspective holds more weight.",
  "Your argument lacks sufficient supporting data. A broader analysis leads to a different conclusion.",
  "While your position has merit, the opposing view provides stronger logical consistency.",
  "Consider the long-term implications — they favor my stance significantly.",
];

// ================= GENERATE AI REPLY =================

const generateDebateReply = async (
  topic,
  aiStance,
  messages,
  personality
) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ No Gemini key. Using fallback.");
      return randomFallback();
    }

    const personalityText = getPersonalityPrompt(personality);

    const systemPrompt = `
You are a professional debater.

${personalityText}

Topic: ${topic}
Your stance: ${aiStance}

Rules:
- Argue strongly
- Be persuasive
- Under 120 words
`;

    const historyText = messages
      .map(
        (m) =>
          `${m.sender === "user" ? "User" : "AI"}: ${m.content}`
      )
      .join("\n");

    const finalPrompt = `
${systemPrompt}

Conversation:
${historyText}

AI Reply:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

    const text = response.text?.trim();

    return text || randomFallback();

  } catch (error) {
    console.error("GEMINI REPLY ERROR:", error);

    // quota / rate limit fallback
    if (error?.status === 429) {
      return "I'm experiencing heavy load right now. Please try again in a moment.";
    }

    return randomFallback();
  }
};

// ================= SCORE DEBATE =================

const scoreDebate = async (messages) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ No Gemini key. Mock score.");
      return mockScore();
    }

    const prompt = `
Analyze this debate and decide winner.

Return JSON ONLY:

{
 "winner": "user | ai | draw",
 "logic": number,
 "persuasion": number,
 "clarity": number,
 "analysis": "text"
}

Debate:
${JSON.stringify(messages)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();

    return safeJSONParse(text) || mockScore();

  } catch (error) {
    console.error("GEMINI SCORE ERROR:", error);
    return mockScore();
  }
};

// ================= HELPERS =================

function randomFallback() {
  return fallbackReplies[
    Math.floor(Math.random() * fallbackReplies.length)
  ];
}

function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function mockScore() {
  return {
    winner: "draw",
    logic: 7,
    persuasion: 7,
    clarity: 7,
    analysis:
      "Temporary analysis because AI scoring unavailable.",
  };
}

module.exports = {
  generateDebateReply,
  scoreDebate,
};