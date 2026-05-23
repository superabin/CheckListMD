# TemplateExtractor 模組任務清單

本模組負責從 HTML 的 `<script id="markdown-template" type="text/markdown">` 標籤中讀取並提取原始 Markdown 內容。

## 最小執行任務

- [x] **任務 1：建立模組基礎結構與介面定義**
  - **目標**：建立 `TemplateExtractor` 物件，並宣告 `extract(selector)` 方法。
  - **驗證**：在瀏覽器 Console 執行，確認 `TemplateExtractor.extract` 函數已定義。
- [x] **任務 2：實作 DOM 尋找與防錯機制**
  - **目標**：實作 `extract` 內部邏輯，使用 `document.querySelector(selector)` 獲取目標元素。若元素不存在，需拋出明確錯誤（例如：`找不到指定的範本標籤: <selector>`）。
  - **驗證**：傳入一個不存在的 ID（如 `#non-existent`），確認能拋出 `Error` 且錯誤訊息正確。
- [x] **任務 3：實作文字內容提取與防止 HTML 轉義字元干擾**
  - **目標**：透過優先讀取 `textContent`，其次 `innerText` 來獲取原始文字，確保如 `<`、`>`、`&` 等 Markdown 內可能出現的字元不被瀏覽器轉義成 `&lt;` 等 HTML Entity。
  - **驗證**：在 HTML 中建立一個內含 `* <測試> & "雙引號"` 的 `<script>` 標籤，呼叫 `extract` 後，比對回傳字串是否與原始輸入完全一致。
