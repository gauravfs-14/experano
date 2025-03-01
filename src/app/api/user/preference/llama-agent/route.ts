import { NextResponse } from "next/server";
import LlamaStackClient from "llama-stack-client";

// Initialize Llama Stack Client
const client = new LlamaStackClient({
  baseURL: "https://llama-stack.together.ai",
  apiKey: process.env.TOGETHER_API,
});

export async function POST(req: Request) {
  try {
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
        content:
          "You are an onboarding assistant. Ask only one question at a time. Use previous responses to generate relevant follow-up questions. Stop after 5 questions.",
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
