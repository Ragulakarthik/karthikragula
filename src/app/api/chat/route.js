const BACKEND_URL = process.env.ASK_MY_CHANNEL_URL || "http://localhost:8080";
const HANDLE = process.env.ASK_MY_CHANNEL_HANDLE || "@karthikragula6666";

// Same-origin proxy to the ask-my-channel backend (a separate service) so the browser
// never has to make a cross-origin request to it — avoids needing any CORS config there.
export async function POST(request) {
  const body = await request.json();

  let backendResponse;
  try {
    backendResponse = await fetch(
      `${BACKEND_URL}/api/channels/${encodeURIComponent(HANDLE)}/chat/stream`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
  } catch {
    return Response.json(
      { error: "Chat backend isn't reachable. Is ask-my-channel running?" },
      { status: 503 }
    );
  }

  if (!backendResponse.ok || !backendResponse.body) {
    const text = await backendResponse.text().catch(() => "");
    return Response.json(
      { error: text || `Chat backend returned ${backendResponse.status}` },
      { status: backendResponse.status }
    );
  }

  return new Response(backendResponse.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
