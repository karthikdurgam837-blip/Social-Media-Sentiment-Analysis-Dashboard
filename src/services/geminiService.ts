import { GoogleGenAI, Type } from "@google/genai";
import { AnalyzedPost, SocialPost, Sentiment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.STRING,
      description: "Must be 'positive', 'negative', or 'neutral'",
    },
    confidence: {
      type: Type.NUMBER,
      description: "A value between 0 and 1 representing certainty",
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 important words from the text",
    },
    explanation: {
      type: Type.STRING,
      description: "A one-sentence explanation of why this sentiment was chosen",
    },
  },
  required: ["sentiment", "confidence", "keywords", "explanation"],
};

export const analyzeSentiment = async (post: SocialPost): Promise<AnalyzedPost> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the sentiment of this social media post: "${post.content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA as any,
        systemInstruction: "You are a social media sentiment analyst for major brands. Be accurate and objective."
      },
    });

    const result = JSON.parse(response.text);
    
    return {
      ...post,
      sentiment: result.sentiment.toLowerCase() as Sentiment,
      confidence: result.confidence,
      keywords: result.keywords,
      explanation: result.explanation,
    };
  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    return {
      ...post,
      sentiment: 'neutral',
      confidence: 0,
      keywords: [],
      explanation: "Analysis failed, defaulting to neutral.",
    };
  }
};

export const summarizeTrends = async (posts: AnalyzedPost[]): Promise<string> => {
  if (posts.length === 0) return "No signal data available for summary.";
  
  try {
    const postContents = posts.map(p => `[${p.sentiment.toUpperCase()}] ${p.content}`).join("\n");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on these social media signals, provide a professional 2-sentence intelligence briefing on the current brand mood and any immediate action needed:\n\n${postContents}`,
      config: {
        systemInstruction: "You are a senior brand strategy consultant. Be concise, insightful, and strategic."
      },
    });

    return response.text;
  } catch (error) {
    console.error("Summary failed:", error);
    return "Intelligence summary unavailable at this time.";
  }
};
