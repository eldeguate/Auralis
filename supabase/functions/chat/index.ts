// @ts-nocheck
import Anthropic from "npm:@anthropic-ai/sdk@0.68.0";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "https://eldeguate.github.io";
const MAX_MESSAGES = 30;
const MAX_CONTENT_LEN = 4000;

const SYSTEM_PROMPT = `You are the AURALIS concierge — a warm, knowledgeable guide to AURALIS bespoke hi-fi speakers handcrafted in Antigua, Guatemala by Mateo Xoc and his team.

About AURALIS:
- Four speakers in the collection: Balam (jaguar / flagship open-baffle, from $7,800/pair), Ixchel (moon goddess / stand-mount monitor), Kuhul (sacred / floorstander), Tz'ikin (bird / compact bookshelf).
- Each pair is built to order in 6–8 weeks using sustainably sourced Guatemalan tonewoods: Hormigo, Granadillo, Conacaste, Cocobolo.
- Inspired by a thousand-year Mayan acoustic tradition.
- No inventory, no two pairs alike.

Your job:
- Answer questions about the speakers, tonewoods, process, and ordering.
- Help visitors figure out which speaker fits their room, music, and listening habits.
- For purchase intent, guide them to the consultation page (consultation.html) — don't try to close the sale yourself.
- If asked something you don't know (exact lead time for their order, shipping quotes, custom finishes), tell them honestly and point them to consultation.html to speak with Mateo.

Voice:
- Warm but understated. Quiet confidence. Never pushy.
- Short paragraphs. No bullet-point spam. No emoji.
- When it helps, refer to the forest, the wood, the craft — but sparingly, not every turn.
- Never claim to be a human. If asked, say you're the AURALIS digital concierge.`;

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin",
};

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonError("Method not allowed", 405);
  }
  if (!ANTHROPIC_API_KEY) {
    return jsonError("Server not configured", 500);
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON", 400);
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return jsonError("messages must be a non-empty array (max 30)", 400);
  }

  const cleaned: { role: "user" | "assistant"; content: string }[] = [];
  for (const m of messages) {
    if (
      !m ||
      typeof m !== "object" ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length === 0 ||
      m.content.length > MAX_CONTENT_LEN
    ) {
      return jsonError("Invalid message shape", 400);
    }
    cleaned.push({ role: m.role, content: m.content });
  }
  if (cleaned[0].role !== "user") {
    return jsonError("First message must be from user", 400);
  }

  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

      try {
        const anthropicStream = anthropic.messages.stream({
          model: "claude-opus-4-7",
          max_tokens: 1024,
          system: [
            {
              type: "text",
              text: SYSTEM_PROMPT,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: cleaned,
        });

        for await (const event of anthropicStream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send({ text: event.delta.text });
          }
        }
        const final = await anthropicStream.finalMessage();
        send({ done: true, usage: final.usage });
      } catch (err) {
        send({ error: err instanceof Error ? err.message : String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
});
