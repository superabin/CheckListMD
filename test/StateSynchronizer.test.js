// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { StateSynchronizer } from "../src/modules/StateSynchronizer.js";

describe("StateSynchronizer 模組測試", () => {
  it("scanAndSync 應正確掃描 DOM 元件並回填初始狀態", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <input type="checkbox" name="項目 A" data-type="checkbox" checked>
      <input type="checkbox" name="項目 B" data-type="checkbox">
      <input type="radio" name="佈署" value="全新安裝" data-type="radio">
      <input type="radio" name="佈署" value="覆蓋升級" data-type="radio" checked>
      <input type="text" name="負責人" data-type="text" value="黃oo">
      <textarea name="備註" data-type="textarea">測試內容</textarea>
    `;

    const formData = {};
    StateSynchronizer.scanAndSync(container, formData);

    expect(formData["項目 A"]).toBe(true);
    expect(formData["項目 B"]).toBe(false);
    expect(formData["佈署"]).toBe("覆蓋升級");
    expect(formData["負責人"]).toBe("黃oo");
    expect(formData["備註"]).toBe("測試內容");
  });

  it("handleEvent 應在事件觸發時更新資料狀態", () => {
    const formData = { 聯絡人: "張三" };

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "聯絡人");
    input.setAttribute("data-type", "text");
    input.value = "李四";

    const event = { target: input };
    StateSynchronizer.handleEvent(event, formData);

    expect(formData["聯絡人"]).toBe("李四");
  });

  it("bind 應綁定事件監聽器，並於資料變更時同步更新，清理函式應能取消監聽", () => {
    const container = document.createElement("div");
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "主管");
    input.setAttribute("data-type", "text");
    input.value = "原主管";
    container.appendChild(input);

    const formData = {};
    const unbind = StateSynchronizer.bind(container, formData);

    // 初始掃描應完成
    expect(formData["主管"]).toBe("原主管");

    // 模擬使用者輸入
    input.value = "新主管";

    // 建立一個真實的 change 事件並分派
    const changeEvent = new window.Event("change", { bubbles: true });
    input.dispatchEvent(changeEvent);

    // 資料應該已經同步
    expect(formData["主管"]).toBe("新主管");

    // 執行清理 (unbind)
    unbind();

    // 再次更動資料並分派事件
    input.value = "另一位主管";
    input.dispatchEvent(changeEvent);

    // 因為已經 unbind，所以資料不應該再變動
    expect(formData["主管"]).toBe("新主管");
  });
});
