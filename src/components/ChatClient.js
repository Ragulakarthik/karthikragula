"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { PlusIcon } from "@/components/CategoryIcons";
import { streamChat } from "@/lib/chatStream";
import { ChatMarkdown } from "@/lib/chatMarkdown";
import { useChatSession } from "@/lib/useChatSession";

const SUGGESTIONS = [
  "How should I crack the Infosys aptitude test?",
  "How do I structure my resume as a fresher?",
  "What should I focus on for DSA prep?",
];

const MAX_CITATIONS = 3;
const TOOLTIP_WIDTH = 200;
const TOOLTIP_HEIGHT = 112;

function youtubeThumbUrl(url) {
  const match = url.match(/youtu\.be\/([\w-]+)/);
  return match ? `https://i.ytimg.com/vi/${match[1]}/mqdefault.jpg` : null;
}

function Citations({ citations, onHover, onLeave }) {
  if (!citations?.length) return null;
  return (
    <div className="gwk-scroll-x mt-2.5 flex gap-1.5 overflow-x-auto border-t-2 border-[var(--line)]/15 pb-0.5 pt-2.5">
      {citations.slice(0, MAX_CITATIONS).map((c, i) => (
        <a
          key={`${c.url}-${i}`}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={(e) => onHover(e.currentTarget.getBoundingClientRect(), c.url)}
          onMouseLeave={onLeave}
          className="flex max-w-[180px] shrink-0 items-center gap-1 rounded border border-[var(--line)]/25 bg-[var(--background)] px-2 py-1 text-[11px] font-bold text-[var(--ink)] transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
        >
          <span className="shrink-0">▶</span>
          <span className="truncate">{c.videoTitle}</span>
        </a>
      ))}
    </div>
  );
}

function FollowUps({ questions, onAsk }) {
  if (!questions?.length) return null;
  return (
    <div className="mx-auto grid w-full max-w-[85%] grid-cols-1 gap-2 sm:max-w-[88%] sm:grid-cols-3 lg:max-w-[760px]">
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onAsk(q)}
          className="w-full rounded-md border border-[var(--line)]/25 bg-[var(--background)] px-2.5 py-1.5 text-center text-xs font-bold text-[var(--ink)] transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

function TurnBubbles({ turn, isLast, onAsk, onCitationHover, onCitationLeave }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="ml-auto max-w-[85%] rounded-lg rounded-br-none bg-[var(--accent)] px-4 py-2.5 text-[15px] font-medium leading-relaxed text-white sm:max-w-[88%] lg:max-w-[760px]">
        {turn.question}
      </div>
      <div className="w-full max-w-[760px] rounded-lg rounded-bl-none border border-[var(--line)]/15 bg-[var(--surface)] px-4 py-3 text-[15px] leading-relaxed text-[var(--ink)]">
        {turn.error ? (
          <span className="font-bold text-red-500">{turn.error}</span>
        ) : (
          <>
            <ChatMarkdown content={turn.answer || "…"} />
            {turn.streaming && (
              <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-[var(--ink)] align-middle" />
            )}
            <Citations
              citations={turn.citations}
              onHover={onCitationHover}
              onLeave={onCitationLeave}
            />
          </>
        )}
      </div>
      {isLast && <FollowUps questions={turn.suggestions} onAsk={onAsk} />}
    </div>
  );
}

export default function ChatClient() {
  const { turns, setTurns, clearChat } = useChatSession();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const listRef = useRef(null);

  const showTooltip = (rect, url) => {
    const thumb = youtubeThumbUrl(url);
    if (!thumb) return;
    const left = Math.max(
      8,
      Math.min(rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2, window.innerWidth - TOOLTIP_WIDTH - 8)
    );
    let top = rect.top - TOOLTIP_HEIGHT - 10;
    if (top < 8) top = rect.bottom + 10;
    setTooltip({ src: thumb, left, top });
  };
  const hideTooltip = () => setTooltip(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const ask = (question) => {
    const trimmed = question.trim();
    if (!trimmed || sending) return;

    const history = turns
      .filter((t) => !t.streaming && !t.error)
      .map((t) => ({ question: t.question, answer: t.answer }));

    setTurns((prev) => [
      ...prev,
      { question: trimmed, answer: "", citations: null, suggestions: null, streaming: true },
    ]);
    setInput("");
    setSending(true);
    scrollToBottom();

    const updateLast = (patch) =>
      setTurns((prev) => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], ...patch };
        return next;
      });

    streamChat({
      question: trimmed,
      history,
      onCitations: (citations) => updateLast({ citations }),
      onAnswerUpdate: (answer) => {
        updateLast({ answer });
        scrollToBottom();
      },
      onSuggestions: (suggestions) => updateLast({ suggestions }),
      onError: (error) => {
        updateLast({ error, streaming: false });
        setSending(false);
      },
      onDone: () => {
        updateLast({ streaming: false });
        setSending(false);
        scrollToBottom();
      },
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[var(--surface)]">
      {turns.length > 0 && (
        <div className="flex justify-end border-b-2 border-[var(--line)]/10 px-3 py-1.5 sm:px-5">
          <button
            type="button"
            onClick={clearChat}
            title="Start a new chat"
            aria-label="Start a new chat"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--accent)]"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      <div
        ref={listRef}
        onScroll={hideTooltip}
        className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 sm:p-6"
      >
        {turns.length === 0 && (
          <div className="m-auto flex max-w-md flex-col items-center gap-3 text-center">
            <p className="font-medium text-[var(--muted)]">
              Ask me anything about my videos, and I&apos;ll point you to the exact moment I
              covered it.
            </p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="rounded-md border border-[var(--line)]/25 bg-[var(--background)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {turns.map((turn, i) => (
          <TurnBubbles
            key={i}
            turn={turn}
            isLast={i === turns.length - 1}
            onAsk={ask}
            onCitationHover={showTooltip}
            onCitationLeave={hideTooltip}
          />
        ))}
      </div>

      {tooltip && (
        <Image
          src={tooltip.src}
          alt=""
          width={TOOLTIP_WIDTH}
          height={TOOLTIP_HEIGHT}
          unoptimized
          className="pointer-events-none fixed z-[999] rounded-md border border-[var(--line)]/40 object-cover shadow-[2px_2px_0_0_var(--line)]"
          style={{ left: tooltip.left, top: tooltip.top }}
        />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex items-center gap-2 border-t-2 border-[var(--line)]/15 p-3 sm:p-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          disabled={sending}
          className="w-full rounded-md border border-[var(--line)]/30 bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="shrink-0 rounded-md bg-[var(--ink)] px-4 py-2 text-sm font-bold text-[var(--surface)] transition hover:bg-[var(--accent)] hover:text-white disabled:opacity-40"
        >
          {sending ? "…" : "Ask →"}
        </button>
      </form>
    </div>
  );
}
