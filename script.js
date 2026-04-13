const chatInput = $("#chatInput");
const messageFeed = $("#messageFeed");
const typingIndicator = $("#typingIndicator");
const welcomePanel = $("#welcomePanel");
const sidebar = $("#sidebar");
const chatHistory = $("#chatHistory");

const mockReplies = [
  "Sure, here’s a clear summary of the key points in a polished and easy-to-read format.",
  "A professional response can be structured with a friendly greeting, the requested details, and a polite closing.",
  "For improved productivity, try grouping similar tasks, keeping distractions minimal, and reviewing your priorities once per hour.",
  "Here’s a concise explanation that highlights the main idea without unnecessary detail.",
  "This example response is designed to be simple, actionable, and aligned with a business-style chat assistant.",
];

let chatCounter = 1;

function createHistoryItem(label) {
  const item = $(
    `<button type="button" class="history-item rounded-4 text-start">${label}</button>`
  );
  item.on("click", () => {
    $(".history-item").removeClass("active");
    item.addClass("active");
    addSystemMessage("Switched to chat: " + label);
  });
  return item;
}

function addSystemMessage(text) {
  const msg = $(
    `<div class="message-bubble left">
      <div class="message-avatar">AI</div>
      <div class="message-card ai">
        <p>${text}</p>
      </div>
    </div>`
  );
  messageFeed.append(msg);
  scrollMessages();
}

function addMessage(text, sender = "ai") {
  const isUser = sender === "user";
  const avatarText = isUser ? "YOU" : "AI";
  const bubbleClass = isUser ? "right" : "left";
  const cardClass = isUser ? "user" : "ai";
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const message = $(
    `<div class="message-bubble ${bubbleClass}">
      <div class="message-avatar">${avatarText}</div>
      <div class="message-card ${cardClass}">
        <p>${text.replace(/\n/g, "<br />")}</p>
        <div class="message-meta">${isUser ? "You" : "Assistant"} · ${timestamp}</div>
      </div>
    </div>`
  );

  messageFeed.append(message);
  scrollMessages();
}

function scrollMessages() {
  messageFeed.stop(true, true).animate({ scrollTop: messageFeed[0].scrollHeight }, 300);
}

function showTypingIndicator(show) {
  typingIndicator.toggleClass("d-none", !show);
  if (show) {
    scrollMessages();
  }
}

function getMockReply() {
  return mockReplies[Math.floor(Math.random() * mockReplies.length)];
}

function startNewChat() {
  messageFeed.empty();
  welcomePanel.removeClass("d-none");
  const label = `Chat ${chatCounter++}`;
  const item = createHistoryItem(label);
  chatHistory.prepend(item);
  item.trigger("click");
  if (chatHistory.children().length > 8) {
    chatHistory.children().last().remove();
  }
}

function finalizeUserMessage(inputText) {
  if (!inputText.trim()) return;
  addMessage(inputText, "user");
  chatInput.val("");
  resizeTextarea();
  showTypingIndicator(true);
  welcomePanel.addClass("d-none");

  setTimeout(() => {
    const reply = getMockReply();
    showTypingIndicator(false);
    addMessage(reply, "ai");
  }, 1100 + Math.random() * 900);
}

function sendMessage() {
  const value = chatInput.val();
  finalizeUserMessage(value);
}

function resizeTextarea() {
  chatInput.height(1);
  const newHeight = Math.min(chatInput[0].scrollHeight, 140);
  chatInput.height(newHeight);
}

$(document).ready(() => {
  startNewChat();

  chatInput.on("input", resizeTextarea);
  $("#sendBtn").on("click", sendMessage);
  $("#newChatBtn").on("click", startNewChat);
  $("#sidebarToggle, #mobileSidebarToggle").on("click", () => {
    sidebar.toggleClass("open");
  });
  $("#attachBtn").on("click", () => {
    addSystemMessage("Attachments are a mock feature in this interface.");
  });

  chatInput.on("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  $("#suggestions").on("click", ".suggestion-card", function () {
    const prompt = $(this).data("prompt");
    chatInput.val(prompt);
    resizeTextarea();
    finalizeUserMessage(prompt);
  });
});
