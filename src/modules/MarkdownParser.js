export const MarkdownParser = {
  /**
   * 解析 Markdown 文本，預處理自訂語法後交由 markdown-it 渲染為 HTML
   * @param {string} markdownText - 原始 Markdown 文本
   * @param {object} mdEngine - markdown-it 的實例
   * @returns {string} 渲染後的 HTML 表單內容
   */
  parse(markdownText, mdEngine) {
    if (!markdownText) return '';
    if (!mdEngine || typeof mdEngine.render !== 'function') {
      throw new Error('必須提供有效的 mdEngine 實例');
    }
    
    let processedText = markdownText;

    // 1. 處理複選題預選 (- [x] 題目文字)
    processedText = processedText.replace(/^-\s+\[[xX]\]\s+(.+)$/gm, (match, title) => {
      const cleanTitle = title.trim();
      return `<div class="flex items-center my-2"><input type="checkbox" name="${cleanTitle}" data-type="checkbox" checked class="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"><span class="ml-2">${cleanTitle}</span></div>`;
    });

    // 2. 處理複選題未選 (- [ ] 題目文字)
    processedText = processedText.replace(/^-\s+\[\s*\]\s+(.+)$/gm, (match, title) => {
      const cleanTitle = title.trim();
      return `<div class="flex items-center my-2"><input type="checkbox" name="${cleanTitle}" data-type="checkbox" class="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"><span class="ml-2">${cleanTitle}</span></div>`;
    });

    // 3. 處理單選題預選 ((x) 群組名稱：選項文字 或 (*) 群組名稱：選項文字)
    processedText = processedText.replace(/\([xX*]\)\s*([^：\n]+)：([^：\n]+)/g, (match, group, option) => {
      const cleanGroup = group.trim();
      const cleanOption = option.trim();
      return `<label class="inline-flex items-center mr-4 my-1"><input type="radio" name="${cleanGroup}" value="${cleanOption}" data-type="radio" checked class="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"><span class="ml-2">${cleanOption}</span></label>`;
    });

    // 4. 處理單選題未選 (( ) 群組名稱：選項文字)
    processedText = processedText.replace(/\(\s*\)\s*([^：\n]+)：([^：\n]+)/g, (match, group, option) => {
      const cleanGroup = group.trim();
      const cleanOption = option.trim();
      return `<label class="inline-flex items-center mr-4 my-1"><input type="radio" name="${cleanGroup}" value="${cleanOption}" data-type="radio" class="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"><span class="ml-2">${cleanOption}</span></label>`;
    });

    // 5. 處理多行問答 [textarea: 提示欄位名]
    processedText = processedText.replace(/\[textarea:\s*([^\]]+)\]/g, (match, label) => {
      const cleanLabel = label.trim();
      return `<div class="my-3"><label class="block text-sm font-medium text-gray-700">${cleanLabel}</label><textarea name="${cleanLabel}" placeholder="${cleanLabel}" data-type="textarea" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"></textarea></div>`;
    });

    // 6. 處理單行問答 [text: 提示欄位名]
    processedText = processedText.replace(/\[text:\s*([^\]]+)\]/g, (match, label) => {
      const cleanLabel = label.trim();
      return `<div class="my-3"><label class="block text-sm font-medium text-gray-700">${cleanLabel}</label><input type="text" name="${cleanLabel}" placeholder="${cleanLabel}" data-type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"></div>`;
    });

    // 7. 最後交由 markdown-it 解析標準 Markdown 標籤 (標題、段落等)
    return mdEngine.render(processedText);
  }
};
