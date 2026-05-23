# StateSynchronizer 模組任務清單

本模組負責透過事件代理，監聽動態渲染出的表單變更，即時同步至 Vue 內部的反應式狀態物件 `formData`。

## 最小執行任務

- [x] **任務 1：實作初始狀態掃描 (scanAndSync)**
  - **目標**：實作 `scanAndSync(container, formData)`，遍歷表單容器內所有具備 `name` 屬性的 `input` 與 `textarea` 標籤，讀取其初始值（`checked` 或 `value`）並寫入 `formData`。
  - **驗證**：提供一個包含預設選中 checkbox 及 radio 的容器，執行後確認 `formData` 已包含這些欄位的預設值。
- [x] **任務 2：綁定事件監聽器與事件代理**
  - **目標**：在表單容器上監聽 `change` 事件（對 text 欄位可同時監聽 `input` 事件以即時同步），並在事件觸發時透過 `event.target` 獲取控制項資訊。
  - **驗證**：手動或程式觸發事件後，確認事件處理器能被成功呼叫，且能正確讀取到目標元素的 `name` 與 `data-type` 屬性。
- [x] **任務 3：處理不同元件的值寫入邏輯**
  - **目標**：在事件處理器中，根據元素類型進行值寫入：
    - `checkbox`：寫入 `checked` 狀態（布林值）。
    - `radio`：若被選中，寫入 `value`。
    - `text` / `textarea`：寫入 `value` 內容。
  - **驗證**：更動各元件，確認 `formData` 的值會隨著操作即時且正確地改變。
