chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getInput") {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      sendResponse({ text: textarea.value });
    } else {
      sendResponse({ text: "" });
    }
  }
});
