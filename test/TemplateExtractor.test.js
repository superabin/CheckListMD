// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { TemplateExtractor } from '../src/modules/TemplateExtractor.js';

describe('TemplateExtractor 模組測試', () => {
  it('應正確定義 extract 函數', () => {
    expect(TemplateExtractor.extract).toBeTypeOf('function');
  });

  it('當 selector 不存在時應拋出 Error', () => {
    expect(() => {
      TemplateExtractor.extract('#non-existent');
    }).toThrow('找不到指定的範本標籤: #non-existent');
  });

  it('當無 selector 參數時應拋出錯誤', () => {
    expect(() => {
      TemplateExtractor.extract();
    }).toThrow('必須提供指定的 selector 參數');
  });

  it('應正確提取含有特殊 HTML 字元的原始內容，無轉義', () => {
    // 建立一個 script 標籤並附加至 body
    const scriptEl = document.createElement('script');
    scriptEl.id = 'markdown-template';
    scriptEl.type = 'text/markdown';
    // 放入含有特殊 HTML 字元的文字
    const testContent = '# 標題 <測試> & "引號" \n- [ ] 項目 1';
    scriptEl.textContent = testContent;
    document.body.appendChild(scriptEl);

    const result = TemplateExtractor.extract('#markdown-template');
    expect(result).toBe(testContent);

    // 清理 DOM
    document.body.removeChild(scriptEl);
  });
});
