export const DataExporter = {
  /**
   * 格式化時間戳記為 YYYY/M/D 下午 H:mm:ss 的格式
   * @param {Date} [date] - 選擇性傳入 Date 物件，預設為當前時間
   * @returns {string} 格式化後的時間
   */
  getFormattedTime(date = new Date()) {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const ampm = hours >= 12 ? '下午' : '上午';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(seconds).padStart(2, '0');

    // 格式範例：2026/5/23 下午 9:40:00
    // 注意，分和秒必須補 0，但時、分、秒格式中，小時不用補 0（即 9 而非 09）。分和秒若是個位數則補為兩位。
    // 這也是 YYYY/M/D 下午 H:mm:ss 的格式習慣。
    return `${yyyy}/${mm}/${dd} ${ampm} ${displayHours}:${displayMinutes}:${displaySeconds}`;
  },

  /**
   * 執行資料匯出並觸發瀏覽器下載
   * @param {object} formData - 填寫的表單資料物件
   * @param {Date} [date] - 選擇性傳入時間以利測試
   * @returns {object} 返回產生的匯出資料結構（方便單元測試）
   */
  exportToJSON(formData, date = new Date()) {
    const exportData = {
      export_at: this.getFormattedTime(date),
      results: { ...formData }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    
    // 建立 Blob 與觸發下載（這只在瀏覽器環境下有效）
    if (typeof Blob !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const filename = `checklist-${yyyy}${mm}${dd}.json`;

      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }

    return exportData;
  }
};
