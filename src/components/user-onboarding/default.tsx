/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

export default function ChatbotOnboarding() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm here to help you set up your preferences. What kind of content interests you the most?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEndOfTurn, setIsEndOfTurn] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || loading || isEndOfTurn) return;

    try {
      // Add user message
      const newMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: "user",
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setLoading(true);

      const response = await fetch("/api/user/preference/llama-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation: [...messages, newMessage],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: data.reply,
          sender: "bot",
        },
      ]);

      // Check stop_reason
      if (data.stop_reason === "end_of_turn") {
        setIsEndOfTurn(true);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: `Error: ${error.message}. Please try again.`,
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>Chatbot Onboarding</DialogTitle>
      <div className="p-4 space-y-4">
        <ScrollArea className="h-80 overflow-y-auto border-b pb-4">
          {messages &&
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 my-2 rounded-lg max-w-xs break-words ${
                  msg.sender === "bot"
                    ? "bg-gray-200 dark:bg-gray-800 dark:text-white text-left"
                    : "bg-blue-500 text-white ml-auto text-right"
                }`}
              >
                {msg.text}
                {msg.sender === "bot" && loading && (
                  <span className="ml-2">...</span>
                )}
              </div>
            ))}
          {loading && (
            <div className="text-center text-gray-500">AI is thinking...</div>
          )}
        </ScrollArea>
        <div className="flex items-center gap-2">
          {messages.length < 10 ? (
            <>
              <form className="flex items-center gap-4 w-full">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1"
                  disabled={loading || isEndOfTurn}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || isEndOfTurn}
                >
                  Send
                </Button>
              </form>
            </>
          ) : (
            <DialogTrigger>
              <Button asChild>Close</Button>
            </DialogTrigger>
          )}
        </div>
      </div>
    </>
  );
}
