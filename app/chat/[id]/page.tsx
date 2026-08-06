import { ChatClient } from "@/components/chat-client";
import { bots } from "@/lib/mock-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return bots.map(bot => ({ id: bot.id }));
}

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatClient id={params.id} />;
}
