
(() => {
  // `contenteditable="true"` を持つ要素を取得
  const editableDiv = document.querySelector('[contenteditable="true"]');

  if (editableDiv) {
    // 内部のテキストを取得
    const inputText = editableDiv.innerText;
    console.log("入力内容:", inputText);
    return inputText; // 入力内容を返す
  } else {
    console.error("contenteditable要素が見つかりません");
    return ""; // 空文字を返す
  }
})();
