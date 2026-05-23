import { describe, it, expect } from 'vitest';
import { MarkdownParser } from '../src/modules/MarkdownParser.js';

// 模擬 markdown-it 實例
const mockMdEngine = {
  render: (text) => text // 直接返回文字以便觀察預處理後的結果
};

describe('MarkdownParser 模組測試', () => {
  it('當未提供 mdEngine 實例時應拋出 Error', () => {
    expect(() => {
      MarkdownParser.parse('# 測試', null);
    }).toThrow('必須提供有效的 mdEngine 實例');
  });

  it('應正確將空字串直接返回', () => {
    expect(MarkdownParser.parse('', mockMdEngine)).toBe('');
  });

  it('應正確將複選題預處理為 HTML Checkbox 標籤', () => {
    const raw = '- [ ] 項目 A\n- [x] 項目 B\n- [X] 項目 C';
    const result = MarkdownParser.parse(raw, mockMdEngine);
    
    // 驗證項目 A (未選取)
    expect(result).toContain('type="checkbox"');
    expect(result).toContain('name="項目 A"');
    expect(result).not.toContain('name="項目 A" data-type="checkbox" checked');

    // 驗證項目 B 與 C (預先選取)
    expect(result).toContain('name="項目 B" data-type="checkbox" checked');
    expect(result).toContain('name="項目 C" data-type="checkbox" checked');
  });

  it('應正確將單選題預處理為 HTML Radio 標籤', () => {
    const raw = '( ) 佈署類型：全新安裝\n(x) 佈署類型：覆蓋升級\n(*) 佈署類型：第三種';
    const result = MarkdownParser.parse(raw, mockMdEngine);

    expect(result).toContain('type="radio"');
    expect(result).toContain('name="佈署類型"');
    expect(result).toContain('value="全新安裝"');
    expect(result).not.toContain('value="全新安裝" data-type="radio" checked');

    expect(result).toContain('value="覆蓋升級" data-type="radio" checked');
    expect(result).toContain('value="第三種" data-type="radio" checked');
  });

  it('應正確將問答題預處理為 HTML Input 與 Textarea 標籤', () => {
    const raw = '[text: 驗收負責人]\n[textarea: 備註與說明]';
    const result = MarkdownParser.parse(raw, mockMdEngine);

    // 單行輸入
    expect(result).toContain('type="text"');
    expect(result).toContain('name="驗收負責人"');
    expect(result).toContain('placeholder="驗收負責人"');
    expect(result).toContain('data-type="text"');

    // 多行輸入
    expect(result).toContain('<textarea name="備註與說明"');
    expect(result).toContain('placeholder="備註與說明"');
    expect(result).toContain('data-type="textarea"');
  });

  it('應呼叫 mdEngine.render 完成渲染', () => {
    let called = false;
    const trackingEngine = {
      render: (text) => {
        called = true;
        return `RENDERED: ${text}`;
      }
    };
    const result = MarkdownParser.parse('- [ ] 項目 A', trackingEngine);
    expect(called).toBe(true);
    expect(result).toContain('RENDERED:');
  });
});
