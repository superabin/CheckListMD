# 單元測試報告 (Unit Test Report)

本報告記錄了「確認清單播放器」專案核心 JavaScript 模組的自動化單元測試執行結果與案例細節。

---

## 1. 測試環境與配置 (Test Environment)

*   **測試框架**：[Vitest v4.1.7](https://vitest.dev/)
*   **DOM 模擬環境**：[jsdom v22.0.0](https://github.com/jsdom/jsdom)（用於模擬瀏覽器的 DOM 結構與事件代理監聽）
*   **專案類型**：Node.js ES Modules (`"type": "module"`)
*   **測試指令**：`npm run test` (指向 `vitest run`)

---

## 2. 測試套件結構 (Test Suite Structure)

我們為系統的四個核心 JS 模組編寫了獨立的單元測試套件，總計 **16 個測試案例**：

| 測試檔案 | 測試目標模組 | 環境需求 | 案例數 | 測試重點 |
| :--- | :--- | :--- | :---: | :--- |
| `test/TemplateExtractor.test.js` | `TemplateExtractor` | `jsdom` | 4 | DOM 元素提取安全、防止 HTML 轉義、引數防錯機制。 |
| `test/MarkdownParser.test.js` | `MarkdownParser` | `node` | 6 | 自訂複選、單選、問答語法的 Regex 預處理，以及編譯器套接。 |
| `test/StateSynchronizer.test.js` | `StateSynchronizer` | `jsdom` | 3 | 初始 DOM 狀態掃描與回填、變更事件代理同步、監聽器清理 (Cleanup)。 |
| `test/DataExporter.test.js` | `DataExporter` | `node` | 3 | 台灣習慣本地時間格式化 (AM/PM)、匯出 JSON Schema 欄位與深拷貝。 |

---

## 3. 測試執行結果日誌 (Test Execution Log)

測試執行完成，**16 個測試案例 100% 成功通過**，無任何失敗或警告項目：

```plaintext
> checklistmd@1.0.0 test
> vitest run


 RUN  v4.1.7 C:/MyProg/AI/CheckListMD

 ✓ test/MarkdownParser.test.js (6 tests) 6ms
 ✓ test/DataExporter.test.js (3 tests) 10ms
 ✓ test/TemplateExtractor.test.js (4 tests) 13ms
 ✓ test/StateSynchronizer.test.js (3 tests) 20ms

 Test Files  4 passed (4)
      Tests  16 passed (16)
   Start at  22:00:20
   Duration  1.86s (transform 127ms, setup 0ms, import 219ms, tests 49ms, environment 3.01s)
```

---

## 4. 詳細測試案例清單 (Detailed Test Cases)

### 4.1 TemplateExtractor.test.js
*   **Case 1：應正確定義 `extract` 函數**
    *   *驗證：* 確保 `TemplateExtractor` 具備 `extract` 方法且型態為 `function`。
*   **Case 2：當 selector 不存在時應拋出 Error**
    *   *驗證：* 當 DOM 中沒有該 CSS 選擇器對應的元素時，必須拋出錯誤並包含資訊 `找不到指定的範本標籤: <selector>`。
*   **Case 3：當無 selector 參數時應拋出錯誤**
    *   *驗證：* 呼叫方法未帶任何參數時，主動攔截並拋出錯誤。
*   **Case 4：應正確提取含有特殊 HTML 字元的原始內容，無轉義**
    *   *驗證：* 在 DOM 中建立一個 `<script>` 標籤並寫入含有 `* <測試> & "雙引號"` 的原始 Markdown，呼叫提取後，比對回傳值是否 100% 與原始字元一致（無任何 `&lt;` 等轉義發生）。

### 4.2 MarkdownParser.test.js
*   **Case 1：當未提供 `mdEngine` 實例時應拋出 Error**
    *   *驗證：* 預防性檢查，若編譯引擎未傳入，主動拋出錯誤。
*   **Case 2：應正確將空字串直接返回**
    *   *驗證：* 若傳入空字串或無內容，應直接返回空字串，防止核心出錯。
*   **Case 3：應正確將複選題預處理為 HTML Checkbox 標籤**
    *   *驗證：* 傳入 `- [ ] 項目 A` 與 `- [x] 項目 B`，驗證分別產出 `data-type="checkbox"`、且包含/不包含 `checked` 屬性之 HTML input 元件。
*   **Case 4：應正確將單選題預處理為 HTML Radio 標籤**
    *   *驗證：* 傳入 `( ) 類型：A` 與 `(x) 類型：B`，驗證產出具備相同 `name="類型"`、不同 `value` 之單選鈕，且 B 有 `checked`。
*   **Case 5：應正確將問答題預處理為 HTML Input 與 Textarea 標籤**
    *   *驗證：* 傳入 `[text: 負責人]` 與 `[textarea: 說明]`，驗證產出對應的 `<input type="text">` 與 `<textarea>`，且其 `name` 與 `placeholder` 屬性正確。
*   **Case 6：應呼叫 `mdEngine.render` 完成渲染**
    *   *驗證：* 確認預處理後的字串確實有送入 `mdEngine` 渲染，而非只有字串處理。

### 4.3 StateSynchronizer.test.js
*   **Case 1：`scanAndSync` 應正確掃描 DOM 元件並回填初始狀態**
    *   *驗證：* 建立包含預選 Checkbox、選中 Radio、文字輸入框與多行問答的 DOM 容器，執行後確認 reactive 資料物件已回填所有欄位的預設值。
*   **Case 2：`handleEvent` 應在事件觸發時更新資料狀態**
    *   *驗證：* 模擬輸入元件變更，呼叫事件處理器，驗證變更後的值是否正確同步寫入資料物件。
*   **Case 3：`bind` 應綁定事件監聽器，並於資料變更時同步更新，清理函式應能取消監聽**
    *   *驗證：* 呼叫 `bind` 綁定表單容器，派生變更事件，驗證資料同步；執行回傳的清理函數後，再次觸發事件，驗證資料維持原值，不再同步。

### 4.4 DataExporter.test.js
*   **Case 1：`getFormattedTime` 應正確格式化下午時間**
    *   *驗證：* 傳入時間為下午的 `Date` 實例，驗證輸出是否為 `YYYY/M/D 下午 H:mm:ss` 格式，且小時無前導 0，分秒有前導 0。
*   **Case 2：`getFormattedTime` 應正確格式化上午時間**
    *   *驗證：* 傳入上午時間的 `Date` 實例，驗證輸出是否為 `YYYY/M/D 上午 H:mm:ss`。
*   **Case 3：`exportToJSON` 應產出符合 Schema 規格之資料結構**
    *   *驗證：* 傳入 `formData`，驗證生成的匯出 JSON 資料中包含對應格式的 `export_at` 與深拷貝後的 `results` 資料物件。

---

## 5. 測試結論 (Conclusion)

本專案之核心模組在設計上達成了**高內聚、低耦合**的目標，使得每一個模組都能透過模擬 `mdEngine` 或 `jsdom` 來完成獨立測試。目前 16 個自動化單元測試在 v11.13.0 等測試環境下已**全部通過驗證**，能保障「確認清單播放器」在生產環境運作時的穩定性與資料同步的精確性。
