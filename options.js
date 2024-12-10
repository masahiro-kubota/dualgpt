// ページが読み込まれたときに現在の設定を取得して選択状態を反映
document.addEventListener('DOMContentLoaded', () => {
  const modelSelect = document.getElementById('model');

  // 保存されたモデル名を取得
  chrome.storage.sync.get('selectedModel', (data) => {
    if (data.selectedModel) {
      modelSelect.value = data.selectedModel;
    }
  });

  // 設定を保存
  document.getElementById('model-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedModel = modelSelect.value;

    chrome.storage.sync.set({ selectedModel }, () => {
      alert('モデル設定が保存されました: ' + selectedModel);
    });
  });
});
