import { NextResponse, NextRequest } from "next/server";
import LlamaStackClient from "llama-stack-client";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { SYSTEM_PROMPT } from "./constant";

const client = new LlamaStackClient({
  baseURL: "https://llama-stack.together.ai",
  apiKey: process.env.TOGETHER_API,
});

// Utility function to retry AI requests
async function retryRequest(
  fn: () => Promise<any>,
  retries: number = 3,
  delay: number = 1000
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

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser(); // Ensure it runs on the server

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    // Fetch user profile
    const userProfileData = await prisma.user.findUnique({
      where: { email },
      select: { userPreferences: true },
    });

    if (!userProfileData || !userProfileData.userPreferences) {
      return NextResponse.json(
        { error: "User preference not found" },
        { status: 404 }
      );
    }

    const userProfile = userProfileData.userPreferences; // String stored in DB

    console.log(`User Profile Found: ${userProfile}`);

    // Fetch all events from the database
    const allEvents = await prisma.event.findMany();
    if (!allEvents.length) {
      return NextResponse.json({ error: "No events found" }, { status: 404 });
    }

    // Format `keywords` field and convert `dateTime` into ISO format
    const formattedEvents = allEvents.map((event) => ({
      event_id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      dateTime: event.dateTime.toISOString(),
      image: event.image,
      keywords: Array.isArray(event.keywords)
        ? event.keywords
        : [event.keywords], // Ensure keywords is an array
      eventType: event.eventType,
      eventLocationType: event.eventLocationType,
      organizer: event.organizer ?? "Unknown Organizer", // Handle null values
      organizerId: event.organizerId ?? null, // Keep as null if missing
      externalLink: event.externalLink,
      rsvp: event.rsvp ? JSON.stringify(event.rsvp) : "[]", // Convert JSON RSVP data to a string (default empty array)
      rsvpCount: event.rsvpCount ?? 0, // Ensure rsvpCount has a default value
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));

    console.log(`Fetched ${formattedEvents.length} events from SQLite`);

    // Prepare data for Llama-Stack with JSON formatting instruction
    const messages: any[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `User Profile: ${userProfile}\n\nHere are all available events:\n${JSON.stringify(
          formattedEvents
        )}\n\nReturn only the most relevant ones in JSON format.`,
      },
    ];

    console.log("Sending request to Llama Stack for event matching...");

    // Send data to Llama-Stack with retry mechanism
    const completion = await retryRequest(async () => {
      return await client.inference.chatCompletion({
        model_id: "meta-llama/Llama-3.2-3B-Instruct",
        messages,
      });
    });

    console.log(
      "Llama Stack Raw Response:",
      completion?.completion_message?.content
    );

    if (!completion?.completion_message?.content) {
      throw new Error("No response from Llama Stack");
    }

    // Parse the AI response (assuming it returns JSON formatted events)
    let recommendedEvents;
    try {
      if (typeof completion.completion_message.content === "string") {
        recommendedEvents = JSON.parse(completion.completion_message.content);
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("Error parsing Llama response:", error);
      return NextResponse.json(
        { error: "Invalid response format from AI. Ensure JSON formatting." },
        { status: 500 }
      );
    }

    return NextResponse.json({ recommended_events: recommendedEvents });
  } catch (error: any) {
    console.error("Error fetching event recommendations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
