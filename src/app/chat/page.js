import AgentAvatar from "@/components/AgentAvatar";
import ChatClient from "@/components/ChatClient";

export const metadata = {
  title: "Ask Me Anything - Karthik Ragula",
  description: "Ask a question and get an answer straight from Karthik.",
};

export default function ChatPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-6 flex items-center gap-4">
        <AgentAvatar className="h-12 w-12 shrink-0 border-2 border-[var(--line)]" />
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Ask Me Anything
          </h1>
          <p className="mt-1 font-medium text-[var(--muted)]">
            Ask me anything about my videos and I&apos;ll answer for real.
          </p>
        </div>
      </div>
      <div className="gwk-brutal flex h-[80vh] min-h-[560px] flex-col overflow-hidden rounded-xl">
        <ChatClient />
      </div>
    </div>
  );
}
