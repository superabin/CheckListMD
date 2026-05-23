# MarkdownParser 模組任務清單

本模組負責自訂語法預處理並透過 `markdown-it` 將 Markdown 編譯為 HTML 表單標籤。

## 最小執行任務

- [x] **任務 1：預處理複選題語法 (- [ ] 與 - [x])**
  - **目標**：使用正規表示式匹配 `^- \[ \] (.+)$` 與 `^- \[x\] (.+)$`，並將其替換為包含 `data-type="checkbox"`、`name="題目文字"` 與 Tailwind 樣式的 HTML Checkbox。
  - **驗證**：呼叫 `MarkdownParser.parse` 並傳入 `"- [ ] 複選題A"`，驗證輸出包含 `<input type="checkbox" name="複選題A" data-type="checkbox"`，且預選狀態為未選取。傳入 `"- [x] 複選題B"` 時，驗證輸出包含 `checked` 屬性。
- [x] **任務 2：預處理單選題語法 (( ) 與 (x))**
  - **目標**：使用正規表示式匹配 `\(\s*\)\s*([^：\n]+)：([^：\n]+)` 與 `\([xX*]\)\s*([^：\n]+)：([^：\n]+)`。將其替換為具備相同 `name`（群組名稱）、不同 `value`（選項文字）與 `data-type="radio"` 的 HTML Radio 按鈕。
  - **驗證**：傳入 `"( ) 部署：全新安裝"`，驗證輸出為單選鈕，且 `name` 為 `"部署"`，`value` 為 `"全新安裝"`。傳入 `"(x) 部署：覆蓋升級"` 時，驗證輸出包含 `checked`。
- [x] **任務 3：預處理單行與多行問答語法 ([text: ...] 與 [textarea: ...])**
  - **目標**：使用正規表示式匹配 `[text: 提示名]` 與 `[textarea: 提示名]`。分別轉為具備 `name="提示名"` 的 `<input type="text">` 與 `<textarea>`，並設定對應 placeholder 與 Tailwind 樣式。
  - **驗證**：傳入 `"[text: 負責人]"`，驗證轉出 `<input type="text" name="負責人" placeholder="負責人" data-type="text"`。
- [x] **任務 4：引擎整合與標準 Markdown 渲染**
  - **目標**：在解析自訂語法後，將結果字串送入啟用 `{ html: true }` 設定的 `markdown-it` 實例進行最後渲染.
  - **驗證**：輸入包含 `# 標題一` 與 `- [ ] 複選項目` 的文字，驗證回傳的 HTML 包含 `<h1>` 標籤與對應的 Checkbox。
