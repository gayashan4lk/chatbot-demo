import Chat from "@/app/components/chat";
import EventStream from "@/app/components/event-stream";
import StreamingChat from "@/app/components/streaming-chat";

export default function Home() {
  return (
    <div>
      <h1 className="text-5xl font-bold">Chatbot</h1>
      <StreamingChat />
      <Chat />
      {/* <EventStream /> */}
    </div>
  );
}
