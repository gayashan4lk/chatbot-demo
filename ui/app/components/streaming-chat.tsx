"use client";

import { useState } from "react";

export default function StreamingChat() {
  const [message, setMessage] = useState(
    "write a funny article about the top 10 most hyped female celebrities in 2024."
  );
  const [response, setResponse] = useState("");

  const handleSendMessage = async () => {
    // Send the message separately using fetch
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "text/event-stream",
      },
      body: JSON.stringify({ message }),
    });

    if (response !== null && response.body !== null) {
      // To recieve data as a string we use TextDecoderStream class in pipethrough
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = value.toString();
        console.log(chunk);
        setResponse((prev) => prev + chunk);
      }
    } else {
      console.log("No response body");
    }
  };

  return (
    <div>
      <h1>Streaming Chat</h1>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="border border-gray-300 rounded px-4 py-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
        {response && (
          <div className="border border-gray-300 rounded p-4">
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
