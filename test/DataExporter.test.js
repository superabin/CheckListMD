import { describe, it, expect } from "vitest";
import { DataExporter } from "../src/modules/DataExporter.js";

describe("DataExporter 模組測試", () => {
  it("getFormattedTime 應正確格式化下午時間", () => {
    // 建立 2026 年 5 月 23 日下午 9 點 40 分 00 秒
    const testDate = new Date(2026, 4, 23, 21, 40, 0); // 月份從 0 開始，4 代表 5 月
    const result = DataExporter.getFormattedTime(testDate);
    expect(result).toBe("2026/5/23 下午 9:40:00");
  });

  it("getFormattedTime 應正確格式化上午時間", () => {
    // 建立 2026 年 5 月 23 日上午 9 點 05 分 08 秒
    const testDate = new Date(2026, 4, 23, 9, 5, 8);
    const result = DataExporter.getFormattedTime(testDate);
    expect(result).toBe("2026/5/23 上午 9:05:08");
  });

  it("exportToJSON 應產出符合 Schema 規格之資料結構", () => {
    const mockFormData = {
      "項目 A": true,
      部署人員: "黃oo",
    };
    const testDate = new Date(2026, 4, 23, 14, 0, 0); // 下午 2:00:00

    const exportResult = DataExporter.exportToJSON(mockFormData, testDate);

    expect(exportResult).toBeTypeOf("object");
    expect(exportResult.export_at).toBe("2026/5/23 下午 2:00:00");
    expect(exportResult.results).toEqual(mockFormData);
    // 驗證為深拷貝
    expect(exportResult.results).not.toBe(mockFormData);
  });
});
