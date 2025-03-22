"use client";

import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(""); // Clear previous response
    await fetchStream(input, setResponse);
  };

  async function fetchStream(
    message: string,
    onMessage: (chunk: string) => void
  ) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("Failed to get reader");
    }

    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      console.log(chunk);
      result += chunk;
      onMessage(chunk);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mx-2">
          Send
        </button>
      </form>
      <div>
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
}
