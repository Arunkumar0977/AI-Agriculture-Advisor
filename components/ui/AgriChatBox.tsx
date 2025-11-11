"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send, Leaf } from "lucide-react";
import axios from "axios";

// 👩‍🌾 Message type
type Message = {
  role: "user" | "assistant";
  content: string;
};

const AgriChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👩‍🌾 Hello! I'm your **Agri Advisor**. I can help you with crop selection, soil health, pest control, and weather guidance. What would you like to know today?",
    },
  ]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const onSend = async () => {
    if (!userInput.trim()) return;
    setLoading(true);

    const newMsg: Message = { role: "user", content: userInput };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setUserInput("");

    try {
      // 🔗 Replace with your Agri Advisor API endpoint
      const { data } = await axios.post("/api/aimodel", {
        messages: updatedMessages,
        domain: "agriculture",
      });

      const aiResponse: string = data?.resp || "Sorry, I couldn’t fetch advice right now.";
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[85vh] flex flex-col bg-gradient-to-b from-green-50 to-green-100 rounded-3xl shadow-inner">
      {/* Header */}
      <header className="p-4 flex items-center justify-center border-b bg-green-600 text-white rounded-t-3xl">
        <Leaf className="mr-2 h-5 w-5" />
        <h1 className="font-semibold text-lg">Agri Advisor Chat</h1>
      </header>

      {/* Chat Section */}
      <section className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) =>
          msg.role === "user" ? (
            <div key={index} className="flex justify-end">
              <div className="max-w-lg bg-green-600 text-white px-4 py-2 rounded-2xl shadow">
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={index} className="flex justify-start">
              <div className="max-w-lg bg-white border border-green-300 text-gray-900 px-4 py-2 rounded-2xl shadow-sm">
                {msg.content}
              </div>
            </div>
          )
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-white border border-green-200 px-4 py-2 rounded-2xl shadow-sm">
              <Loader className="h-4 w-4 animate-spin text-green-600" />
              <span className="text-gray-600 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </section>

      {/* Input Section */}
      <section className="p-4 border-t border-green-200 bg-green-50 rounded-b-3xl">
        <div className="relative border border-green-400 rounded-2xl bg-white p-4">
          <Textarea
            placeholder="Ask me about your crops, soil, or farming issues..."
            className="w-full h-20 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none text-gray-800"
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
          />
          <Button
            size="icon"
            className="absolute bottom-5 right-5 bg-green-600 hover:bg-green-700 text-white"
            onClick={onSend}
            disabled={loading}
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AgriChatBox;
