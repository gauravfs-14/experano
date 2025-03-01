/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import LlamaStackClient from "llama-stack-client";
import { SYSTEM_PROMPT } from "./constant";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// Initialize Llama Stack Client
const client = new LlamaStackClient({
  baseURL: "https://llama-stack.together.ai",
  apiKey: process.env.TOGETHER_API,
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const name = user.fullName;

    // const userPreference = await prisma.user.findUnique({
    //   where: { email },
    // });
    // if ((userPreference?.userPreferences?.length ?? 0) > 0) {
    //   return NextResponse.json(
    //     { error: "User preference already exists" },
    //     { status: 400 }
    //   );
    // }

    const { conversation } = await req.json();
    console.log("Received conversation:", conversation);

    // Format messages for Llama Stack
    const formattedMessages = conversation.map((msg: any) => ({
      role: msg.sender === "bot" ? "assistant" : "user",
      content: msg.text,
      ...(msg.sender === "bot" ? { stop_reason: "end_of_turn" } : {}), // Ensure stop_reason is set
    }));

    // Add system instruction
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT + `The user's name is ${name ?? email}`,
      },
      ...formattedMessages,
    ];

    console.log("Sending to Llama Stack:", messages);

    const completion = await client.inference.chatCompletion({
      model_id: "meta-llama/Llama-3.2-3B-Instruct",
      messages,
    });

    console.log("Llama Stack Response:", completion);

    if (!completion?.completion_message?.content) {
      throw new Error("No response from Llama Stack");
    }

    // Extract final user profile
    const responseText =
      typeof completion.completion_message.content === "string"
        ? completion.completion_message.content.trim()
        : "";

    // Check if it's the final response (user profile summary)
    let userProfile = "";
    if (conversation.length >= 10) {
      userProfile = responseText;
      // Save user preference to database
      try {
        await prisma.user.upsert({
          where: { email },
          update: {
            userPreferences: userProfile,
          },
          create: {
            email,
            userPreferences: userProfile,
          },
        });
      } catch (error) {
        console.error("Failed to save user preference:", error);
      }
    }

    return NextResponse.json({
      reply:
        typeof completion.completion_message.content === "string"
          ? completion.completion_message.content.trim()
          : "",
    });
  } catch (error: any) {
    console.error("Llama Stack Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get AI response" },
      { status: 500 }
    );
  }
}
