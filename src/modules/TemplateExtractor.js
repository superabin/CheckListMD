export const TemplateExtractor = {
  /**
   * 從指定的 selector 讀取原始 Markdown 內容
   * @param {string} selector - CSS 選擇器，例如 '#markdown-template'
   * @returns {string} 原始 Markdown 文本
   */
  extract(selector) {
    if (!selector) {
      throw new Error('必須提供指定的 selector 參數');
    }
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`找不到指定的範本標籤: ${selector}`);
    }
    // 優先使用 textContent 以避免 innerHTML 自動將特殊字元轉義
    return element.textContent || element.innerText || '';
  }
};
