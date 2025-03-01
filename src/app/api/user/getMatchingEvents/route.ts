/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import LlamaStackClient from "llama-stack-client";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { SYSTEM_PROMPT } from "./constant";
import stringSimilarity from "string-similarity"; // Install: npm i string-similarity
import { safeParse } from "fast-json-parse"; // Install: npm i fast-json-parse

const client = new LlamaStackClient({
  baseURL: "https://llama-stack.together.ai",
  apiKey: process.env.TOGETHER_API,
});

// Utility function to retry AI requests
async function retryRequest(
  fn: () => Promise<any>,
  retries = 3,
  delay = 1000
): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

export async function GET() {
  try {
    // console.log("🔍 Fetching user...");
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
    // console.log(`📝 User Profile: ${userProfile}`);

    // Extract relevant keywords from user preferences
    const userKeywords = extractKeywords(userProfile);
    // console.log(`🔑 Extracted User Keywords:`, userKeywords);

    if (!userKeywords.length) {
      return NextResponse.json(
        { error: "No meaningful keywords found in user preferences" },
        { status: 400 }
      );
    }

    // Fetch upcoming events
    // console.log("📅 Fetching upcoming events...");
    const MAX_EVENTS_TO_FETCH = 1000;

    const allEvents = await prisma.event.findMany({
      orderBy: { rsvpCount: "desc" },
      take: MAX_EVENTS_TO_FETCH, // Fetch all events
    });

    // console.log(`✅ Total Events Fetched: ${allEvents.length}`);

    // **Improved Event Filtering**
    const relevantEvents = allEvents.filter((event) => {
      if (!event.keywords) return false;

      const eventKeywords = normalizeEventKeywords(event.keywords);
      const hasMatch = hasKeywordMatch(userKeywords, eventKeywords);

      // console.log(`🆚 Matching "${event.title}":`, {
      //   eventKeywords,
      //   userKeywords,
      //   hasMatch,
      // });

      return hasMatch;
    });

    // console.log(`🎯 Total Matched Events: ${relevantEvents.length}`);

    if (!relevantEvents.length) {
      return NextResponse.json(
        { error: "No matching events found" },
        { status: 404 }
      );
    }

    // console.log(
    //   `🚀 Sending ${relevantEvents.length} filtered events to Llama-Stack`
    // );

    // Prepare messages for Llama-Stack (send full event details)
    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `User Profile: ${userProfile}\n\nHere are some filtered events:\n${JSON.stringify(
          relevantEvents
        )}\n\nReturn only the most relevant event IDs as a JSON array.`,
      },
    ];

    // Send data to Llama-Stack with retry mechanism
    const completion = await retryRequest(async () => {
      return await client.inference.chatCompletion({
        model_id: "meta-llama/Llama-3.2-3B-Instruct",
        messages,
      });
    });

    // console.log("🧠 Raw AI Response:", completion?.completion_message?.content);

    let filteredEventIds: number[];
    try {
      // Validate and clean AI response
      const rawResponse = completion.completion_message.content.trim();

      if (!rawResponse.startsWith("[") || !rawResponse.endsWith("]")) {
        console.error("⚠️ AI returned non-JSON data. Wrapping in array.");
        filteredEventIds = safeParse(`[${rawResponse}]`).value || [];
      } else {
        filteredEventIds = JSON.parse(rawResponse);
      }
    } catch (error) {
      console.error("❌ Error parsing Llama response:", error);
      return NextResponse.json(
        { error: "Invalid response format from AI. Ensure JSON formatting." },
        { status: 500 }
      );
    }

    // console.log(`🎯 Final Event IDs from AI:`, filteredEventIds);

    // Fetch full event details using filtered event IDs
    const finalEvents = await prisma.event.findMany({
      where: { id: { in: filteredEventIds } },
    });

    return NextResponse.json({ recommended_events: finalEvents });
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
