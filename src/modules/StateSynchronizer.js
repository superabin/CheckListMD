export const StateSynchronizer = {
  /**
   * 初始化事件監聽與資料綁定
   * @param {HTMLElement} container - 表單容器的 DOM 元素
   * @param {object} formDataRef - Vue reactive 狀態物件的引用
   * @returns {function} 清理事件監聽器的回呼函數 (Cleanup function)
   */
  bind(container, formDataRef) {
    if (!container) return () => {};

    // 清除舊資料以重新初始化
    for (const key in formDataRef) {
      delete formDataRef[key];
    }

    // 1. 執行初始掃描，將畫面上已有的預設值回填至 formDataRef
    this.scanAndSync(container, formDataRef);

    // 建立事件處理器
    const changeHandler = (event) => {
      this.handleEvent(event, formDataRef);
    };

    const inputHandler = (event) => {
      const target = event.target;
      const dataType = target.getAttribute('data-type');
      if (dataType === 'text' || dataType === 'textarea') {
        this.handleEvent(event, formDataRef);
      }
    };

    // 2. 監聽 change 事件（適用於 Checkbox, Radio, 以及完成輸入的 Text/Textarea）
    container.addEventListener('change', changeHandler);

    // 3. 監聽 input 事件（針對 Text 與 Textarea，提供即時字元同步）
    container.addEventListener('input', inputHandler);

    // 返回清理函式，便於 Vue 卸載時清理監聽器防止記憶體洩漏
    return () => {
      container.removeEventListener('change', changeHandler);
      container.removeEventListener('input', inputHandler);
    };
  },

  /**
   * 處理輸入與變更事件並同步資料
   */
  handleEvent(event, formDataRef) {
    const target = event.target;
    const name = target.getAttribute('name');
    if (!name) return;

    const dataType = target.getAttribute('data-type') || target.type;

    if (dataType === 'checkbox') {
      formDataRef[name] = target.checked;
    } else if (dataType === 'radio') {
      if (target.checked) {
        formDataRef[name] = target.value;
      }
    } else {
      formDataRef[name] = target.value;
    }
  },

  /**
   * 掃描表單中所有帶有 name 的控制項，並同步其初始值
   */
  scanAndSync(container, formDataRef) {
    const inputs = container.querySelectorAll('[name]');
    inputs.forEach((input) => {
      const name = input.getAttribute('name');
      const dataType = input.getAttribute('data-type') || input.type;

      if (dataType === 'checkbox') {
        // Checkbox 初始化：依據 checked 屬性填入 true/false
        formDataRef[name] = input.checked;
      } else if (dataType === 'radio') {
        // Radio 初始化：只有被 checked 的那個 radio 的值會成為該 name 的 value
        if (input.checked) {
          formDataRef[name] = input.value;
        } else if (formDataRef[name] === undefined) {
          formDataRef[name] = '';
        }
      } else {
        // Text / Textarea 初始化
        formDataRef[name] = input.value || '';
      }
    });
  }
};
