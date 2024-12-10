let newTabId = null;

chrome.action.onClicked.addListener((tab) => {
  console.log("拡張機能がクリックされました");

  if (tab.url.includes("chatgpt.com")) {
    console.log("ChatGPTのページを検出");
    
    // 保存されたモデル名を取得
    chrome.storage.sync.get('selectedModel', (data) => {
      const selectedModel = data.selectedModel || 'o1-pro'; // デフォルトモデルを設定
      const modelUrl = `https://chatgpt.com/?model=${selectedModel}`;

      // 新しいタブをバックグラウンドで開く
      chrome.tabs.create({ url: modelUrl, active: false }, (newTab) => {
        newTabId = newTab.id;
        console.log("新しいタブをバックグラウンドで開きました:", newTabId);

        // 現在のタブでスクリプトを実行して入力内容を取得
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ["getInput.js"]
          },
          (results) => {
            if (chrome.runtime.lastError) {
              console.error("スクリプト実行エラー:", chrome.runtime.lastError.message);
              return;
            }

            console.log("入力内容取得結果:", results);

            if (results && results[0] && results[0].result) {
              const inputText = results[0].result;
              console.log("取得した入力内容:", inputText);

              // 新しいタブに入力内容を送信して送信ボタンをクリック
              setTimeout(() => {
                chrome.scripting.executeScript(
                  {
                    target: { tabId: newTabId },
                    func: (text) => {
                      const sendButtonSelector = 'button[data-testid="send-button"]';

                      // ボタンが見つかるまで監視
                      const observer = new MutationObserver(() => {
                        const sendButton = document.querySelector(sendButtonSelector);
                        if (sendButton) {
                          console.log("送信ボタンが見つかりました:", sendButton);
                          sendButton.click(); // ボタンをクリック
                          observer.disconnect(); // 監視を終了
                        }
                      });

                      // MutationObserverでDOMの変更を監視
                      observer.observe(document.body, { childList: true, subtree: true });

                      // 入力内容を設定
                      const editableDiv = document.querySelector('[contenteditable="true"]');
                      if (editableDiv) {
                        console.log("新しいタブのcontenteditable要素に内容を送信:", text);
                        editableDiv.innerHTML = `<p>${text}</p>`; // HTMLを直接挿入
                        editableDiv.dispatchEvent(new Event("input", { bubbles: true })); // 入力イベントを発火
                      } else {
                        console.error("新しいタブでcontenteditable要素が見つかりません");
                      }
                    },
                    args: [inputText]
                  },
                  () => {
                    if (chrome.runtime.lastError) {
                      console.error("新しいタブへのスクリプト実行エラー:", chrome.runtime.lastError.message);
                    }
                  }
                );
              }, 3000); // ページロード待機
            } else {
              console.error("入力内容が取得できませんでした");
            }
          }
        );
      });
    });
  } else {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "エラー",
      message: "ChatGPTのページで拡張機能を使用してください！"
    });
    console.error("現在のページはChatGPTではありません");
  }
});
