/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import LlamaStackClient from "llama-stack-client";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { SYSTEM_PROMPT } from "./constant";
import stringSimilarity from "string-similarity"; // Install: npm i string-similarity

const client = new LlamaStackClient({
  baseURL: "https://llama-stack.together.ai",
  apiKey: process.env.TOGETHER_API,
});

// Utility function to retry AI requests and ensure valid JSON response
async function retryRequest(
  fn: () => Promise<any>,
  retries = 5,
  delay = 1000
): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fn();

      // Validate JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response.completion_message.content.trim());
        if (!Array.isArray(parsedResponse)) {
          throw new Error("Invalid JSON format (not an array).");
        }
      } catch (parseError) {
        console.warn(
          `⚠️ AI response invalid (Attempt ${i + 1}/${retries}):`,
          parseError
        );
        await new Promise((res) => setTimeout(res, delay));
        continue; // Retry on failure
      }

      return parsedResponse; // Valid JSON found, return it
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("AI response failed after maximum retries.");
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    // Fetch user preferences
    const userProfileData = await prisma.user.findUnique({
      where: { email },
      select: { userPreferences: true },
    });

    if (!userProfileData?.userPreferences) {
      return NextResponse.json(
        { error: "User preference not found" },
        { status: 404 }
      );
    }

    const userProfile = userProfileData.userPreferences;
    const userKeywords = extractKeywords(userProfile);

    if (!userKeywords.length) {
      return NextResponse.json(
        { error: "No meaningful keywords found in user preferences" },
        { status: 400 }
      );
    }

    const allEvents = await prisma.event.findMany({
      orderBy: { rsvpCount: "desc" },
      take: 1000,
    });

    const relevantEvents = allEvents.filter((event) => {
      if (!event.keywords) return false;
      const eventKeywords = normalizeEventKeywords(event.keywords);
      return hasKeywordMatch(userKeywords, eventKeywords);
    });

    // If no relevant events found, return random events
    if (!relevantEvents.length) {
      console.log("No matching events found, returning random events");
      const randomEvents = await prisma.event.findMany({
        take: 10,
        orderBy: {
          // Random ordering in Prisma
          id: "asc",
        },
        skip: Math.floor(Math.random() * Math.max(allEvents.length - 10, 0)),
      });

      return NextResponse.json({
        recommended_events: randomEvents,
        is_random: true,
      });
    }

    // Prepare messages for AI model
    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `User Profile: ${userProfile}\n\nHere are some filtered events:\n${JSON.stringify(
          relevantEvents
        )}\n\nReturn only the most relevant event IDs as an array.`,
      },
    ];

    // Send request to Llama-Stack with retry for valid JSON
    const filteredEventIds = await retryRequest(async () => {
      const completion = await client.inference.chatCompletion({
        model_id: "meta-llama/Llama-3.2-3B-Instruct",
        messages,
      });
      return completion;
    });

    // Fetch events based on filtered IDs, fallback to random if none found
    const finalEvents = await prisma.event.findMany({
      where: { id: { in: filteredEventIds } },
    });

    if (!finalEvents.length) {
      const randomEvents = await prisma.event.findMany({
        take: 10,
        orderBy: { id: "asc" },
        skip: Math.floor(Math.random() * Math.max(allEvents.length - 10, 0)),
      });

      return NextResponse.json({
        recommended_events: randomEvents,
        is_random: true,
      });
    }

    return NextResponse.json({
      recommended_events: finalEvents,
      is_random: false,
    });
  } catch (error: any) {
    console.error("❌ Error fetching event recommendations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}

// **Optimized Keyword Extraction**
function extractKeywords(userProfile: string): string[] {
  const words = userProfile.match(/\b[a-zA-Z]{4,}\b/g) || [];

  const stopWords = new Set([
    "the",
    "this",
    "that",
    "is",
    "are",
    "was",
    "were",
    "in",
    "on",
    "for",
    "to",
    "a",
    "of",
    "it",
    "and",
    "or",
    "an",
    "with",
    "as",
    "by",
    "be",
    "we",
    "you",
    "your",
    "he",
    "she",
    "they",
    "i",
    "me",
    "my",
    "mine",
    "our",
    "ours",
    "like",
    "sounds",
    "great",
    "evening",
    "think",
    "have",
    "good",
    "sense",
    "hello",
    "covered",
    "love",
    "preference",
    "profile",
    "paragraph",
    "summarize",
    "events",
    "now",
    "know",
    "sure",
    "make",
  ]);

  const filteredWords = words.filter(
    (word: string) => !stopWords.has(word.toLowerCase())
  );

  return [...new Set(filteredWords)].slice(0, 5);
}

// **Normalize Event Keywords for Matching**
function normalizeEventKeywords(eventKeywords: any): string[] {
  if (Array.isArray(eventKeywords)) {
    return eventKeywords.map((k) =>
      typeof k === "string" ? k.toLowerCase().trim() : ""
    );
  } else if (typeof eventKeywords === "string") {
    return eventKeywords
      .toLowerCase()
      .split(",")
      .map((k) => k.trim());
  }
  return [];
}

// **Improved Keyword Matching Logic with Fuzzy Matching**
function hasKeywordMatch(
  userKeywords: string[],
  eventKeywords: string[]
): boolean {
  return userKeywords.some((userKeyword) =>
    eventKeywords.some(
      (eventKeyword) =>
        stringSimilarity.compareTwoStrings(userKeyword, eventKeyword) > 0.5
    )
  );
}
