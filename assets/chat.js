(function () {
  const CHAT_ENDPOINT = window.AURALIS_CHAT_ENDPOINT ||
    "https://YOUR-PROJECT-REF.supabase.co/functions/v1/chat";
  const SUPABASE_ANON_KEY = window.AURALIS_SUPABASE_ANON_KEY || "";

  const GREETING = "Welcome. I'm the AURALIS concierge — here to help you find your sound. Ask about the speakers, the woods, or how a pair gets made.";

  const state = {
    open: false,
    busy: false,
    messages: [],
  };

  const trigger = document.createElement("button");
  trigger.className = "auralis-chat-trigger";
  trigger.setAttribute("aria-label", "Open AURALIS concierge");
  trigger.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>`;
  document.body.appendChild(trigger);

  const panel = document.createElement("div");
  panel.className = "auralis-chat-panel";
  panel.innerHTML = `
    <div class="auralis-chat-header">
      <div>
        <div class="title">AURALIS concierge</div>
        <div class="sub">digital guide</div>
      </div>
      <button class="auralis-chat-close" aria-label="Close">×</button>
    </div>
    <div class="auralis-chat-log" role="log" aria-live="polite"></div>
    <form class="auralis-chat-form">
      <input class="auralis-chat-input" type="text" placeholder="Ask about the speakers…" autocomplete="off" maxlength="1000">
      <button type="submit" class="auralis-chat-send">Send</button>
    </form>
    <div class="auralis-chat-disclaimer">AI concierge · not a replacement for consultation</div>`;
  document.body.appendChild(panel);

  const log = panel.querySelector(".auralis-chat-log");
  const form = panel.querySelector(".auralis-chat-form");
  const input = panel.querySelector(".auralis-chat-input");
  const sendBtn = panel.querySelector(".auralis-chat-send");
  const closeBtn = panel.querySelector(".auralis-chat-close");

  function appendMessage(role, text) {
    const el = document.createElement("div");
    el.className = `auralis-chat-msg ${role}`;
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function appendError(text) {
    const el = document.createElement("div");
    el.className = "auralis-chat-error";
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  function openPanel() {
    if (state.open) return;
    state.open = true;
    panel.classList.add("open");
    trigger.style.display = "none";
    if (state.messages.length === 0) {
      appendMessage("assistant", GREETING);
    }
    setTimeout(() => input.focus(), 100);
  }

  function closePanel() {
    state.open = false;
    panel.classList.remove("open");
    trigger.style.display = "";
  }

  trigger.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || state.busy) return;

    input.value = "";
    appendMessage("user", text);
    state.messages.push({ role: "user", content: text });

    const assistantEl = appendMessage("assistant", "");
    assistantEl.classList.add("thinking");
    state.busy = true;
    sendBtn.disabled = true;

    try {
      const headers = { "Content-Type": "application/json" };
      if (SUPABASE_ANON_KEY) {
        headers["Authorization"] = `Bearer ${SUPABASE_ANON_KEY}`;
        headers["apikey"] = SUPABASE_ANON_KEY;
      }

      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers,
        body: JSON.stringify({ messages: state.messages }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Chat failed (${res.status}) ${errText}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload) continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.text) {
              if (assistantEl.classList.contains("thinking")) {
                assistantEl.classList.remove("thinking");
              }
              assistantText += evt.text;
              assistantEl.textContent = assistantText;
              log.scrollTop = log.scrollHeight;
            } else if (evt.error) {
              throw new Error(evt.error);
            }
          } catch (parseErr) {
            console.warn("Bad SSE payload:", payload);
          }
        }
      }

      if (assistantText.length === 0) {
        throw new Error("No response received");
      }
      state.messages.push({ role: "assistant", content: assistantText });
    } catch (err) {
      assistantEl.remove();
      appendError(err.message || "Something went wrong. Please try again.");
      state.messages.pop();
    } finally {
      state.busy = false;
      sendBtn.disabled = false;
      input.focus();
    }
  });
})();
