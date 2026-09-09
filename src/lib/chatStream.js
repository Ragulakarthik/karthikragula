// Parses the proxied ask-my-channel SSE stream. The backend's AnswerStreamParser already
// strips the model's internal markers server-side, so "token" events here are always clean,
// reader-facing text — no client-side marker detection needed. "citations" and "suggestions"
// arrive as their own events, last, right before the stream closes (the server only knows
// whether the answer was actually grounded once generation has finished). A server-side
// failure (e.g. both LLM providers down) arrives as an "error" event rather than just dropping
// the connection.
export async function streamChat({
  question,
  history,
  onCitations,
  onAnswerUpdate,
  onSuggestions,
  onError,
  onDone,
}) {
  let response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
    });
  } catch {
    onError("Couldn't reach the chat backend.");
    return;
  }

  if (!response.ok || !response.body) {
    const data = await response.json().catch(() => ({}));
    onError(data.error || `Request failed (${response.status}).`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let answer = "";
  let hasContent = false;
  let serverErrorMessage = null;

  const handleEvent = (rawEvent) => {
    const eventMatch = rawEvent.match(/^event:\s*(.+)$/m);
    const dataMatch = rawEvent.match(/^data:\s*(.+)$/m);
    if (!dataMatch) return;

    const eventName = eventMatch ? eventMatch[1].trim() : "message";
    try {
      const parsed = JSON.parse(dataMatch[1]);
      if (eventName === "citations") onCitations(parsed);
      else if (eventName === "suggestions") onSuggestions(parsed);
      else if (eventName === "error") serverErrorMessage = parsed;
      else if (eventName === "token") {
        hasContent = true;
        answer += parsed;
        onAnswerUpdate(answer);
      }
    } catch {
      // ignore a malformed frame rather than breaking the whole stream
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let sepIndex;
      while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
        const rawEvent = buffer.slice(0, sepIndex);
        buffer = buffer.slice(sepIndex + 2);
        handleEvent(rawEvent);
      }
    }
  } catch {
    onError("The chat stream was interrupted.");
    return;
  }

  if (serverErrorMessage) {
    if (hasContent) {
      onAnswerUpdate(`${answer}\n\n*(interrupted: ${serverErrorMessage})*`);
    } else {
      onError(serverErrorMessage);
      return;
    }
  }

  onDone();
}
