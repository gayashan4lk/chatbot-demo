"use client";

import { useEffect, useState } from "react";

export default function EventStream() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/stream?input=Hello`
    );
    eventSource.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
    eventSource.onerror = (error) => {
      console.error(error);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);
  return (
    <div>
      {messages.length === 0 ? (
        <p>Waiting for messages...</p>
      ) : (
        messages.map((message: string, index: number) => (
          <p key={index}>{message}</p>
        ))
      )}
    </div>
  );
}
