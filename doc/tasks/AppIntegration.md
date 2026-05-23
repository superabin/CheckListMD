# AppIntegration 整合模組任務清單

本模組負責將所有獨立的核心 JS 模組（提取、解析、同步、匯出）與 Vue 3 生命週期結合，並建置 Tailwind CSS UI 樣式。

## 最小執行任務

- [x] **任務 1：建立 HTML 骨架與內置 Markdown 範本**
  - **目標**：在 `index.html` 中引入靜態庫與 CSS，並在 `<script id="markdown-template" type="text/markdown">` 標籤內填入符合 proposal 規格的測試用確認清單範本。
  - **驗證**：打開檔案能正確載入 DOM，且 template 標籤內有完整的 Markdown 內容。
- [x] **任務 2：初始化 Vue 3 實例與生命週期掛載**
  - **目標**：實作 Vue 3 `app.mount()`，在 `mounted()` 生命週期中呼叫 `TemplateExtractor` 與 `MarkdownParser`，並將渲染出的 HTML 賦值給 Vue 的狀態變數 `renderedHtml`。
  - **驗證**：畫面成功渲染出初步的表單 HTML，包含正確的樣式與配置。
- [x] **任務 3：綁定狀態同步器與匯出按鈕**
  - **目標**：在 Vue 的 `nextTick`（表單渲染至 DOM 後）呼叫 `StateSynchronizer.bind`，將事件監聽綁定至容器。在 UI 上放置「匯出 JSON」按鈕，點擊時觸發 `DataExporter.exportToJSON(formData)`。
  - **驗證**：在瀏覽器中填寫表單後點擊按鈕，能下載到完整的 JSON 填寫紀錄。
