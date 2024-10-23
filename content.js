function extractData() {
  const selectors = {
    monthlyPayment: [
      'span[class*="--color_text-primary-default--"][class*="--fontSize_22px--"]',
      'span[class*="--color_text-primary-default--"][class*="--fontSize_20px--"]',
      // Добавим дополнительные селекторы
      'span[data-testid="price-amount"]',
      'span[data-mark="MainPrice"]'
    ],
    requiredIncome: [
      'span[class*="--color_text-primary-default--"][class*="--fontSize_22px--"]',
      'span[class*="--color_text-primary-default--"][class*="--fontSize_20px--"]',
      // Добавим дополнительные селекторы
      'span[data-testid="required-income-amount"]',
      'span[data-mark="RequiredIncome"]'
    ],
  };

  let monthlyPayment, requiredIncome;

  for (const selector of selectors.monthlyPayment) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      if (element.textContent.includes('₽')) {
        const value = parseFloat(element.textContent.replace(/[^\d]/g, ''));
        if (value && (!monthlyPayment || value < monthlyPayment)) {
          monthlyPayment = value;
        }
      }
    }
    if (monthlyPayment) break;
  }

  for (const selector of selectors.requiredIncome) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      if (element.textContent.includes('₽') && (!monthlyPayment || !element.textContent.includes(monthlyPayment.toString()))) {
        const value = parseFloat(element.textContent.replace(/[^\d]/g, ''));
        if (value && (!requiredIncome || value > requiredIncome)) {
          requiredIncome = value;
        }
      }
    }
    if (requiredIncome) break;
  }

  console.log('Extracted data:', { monthlyPayment, requiredIncome });
  return { monthlyPayment, requiredIncome };
}

function injectResult(isGoodDeal, incomeShare) {
  const titleSelector = 'h1[class*="--title--"]';
  const title = document.querySelector(titleSelector);

  if (title) {
    let resultElement = document.getElementById('cian-deal-analyzer-result');
    if (!resultElement) {
      resultElement = document.createElement('span');
      resultElement.id = 'cian-deal-analyzer-result';
      title.parentNode.insertBefore(resultElement, title.nextSibling);
    }

    const dealText = isGoodDeal ? 'Хорошая сделка' : 'Плохая сделка';
    const backgroundColor = isGoodDeal ? '#10B981' : '#EF4444'; // Зеленый для хорошей сделки, красный для плохой
    
    resultElement.innerHTML = `
      <span style="
        display: inline-block;
        margin-left: 8px;
        padding: 4px 8px;
        border-radius: 4px;
        background-color: ${backgroundColor};
        color: white;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      ">${dealText}</span>
      <span style="
        margin-left: 8px;
        font-size: 14px;
        color: #4B5563;
      ">(Доля от дохода: ${incomeShare.toFixed(2)}%)</span>
    `;
  }
}

function analyzeDeal(income, monthlyPayment) {
  const isGoodDeal = monthlyPayment < income / 3;
  const incomeShare = (monthlyPayment / income) * 100;
  return { isGoodDeal, incomeShare };
}

function removeExistingResult() {
  const existingResult = document.getElementById('cian-deal-analyzer-result');
  if (existingResult) {
    existingResult.remove();
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyze') {
    removeExistingResult();
    const { income } = request;
    const extractedData = extractData();

    if (!extractedData.monthlyPayment || !extractedData.requiredIncome) {
      console.error('Не удалось извлечь данные:', extractedData);
      sendResponse({ error: 'Не удалось извлечь данные. Пожалуйста, убедитесь, что вы находитесь на странице объявления Cian.' });
      return true;
    }

    const { isGoodDeal, incomeShare } = analyzeDeal(income, extractedData.monthlyPayment);
    injectResult(isGoodDeal, incomeShare);

    sendResponse({
      isGoodDeal,
      monthlyPayment: extractedData.monthlyPayment,
      requiredIncome: extractedData.requiredIncome,
      incomeShare, // Добавляем incomeShare в ответ
    });
  }
  return true;
});

// Добавим автоматический запуск анализа при загрузке страницы
chrome.storage.sync.get('income', (data) => {
  if (data.income) {
    const income = parseFloat(data.income);
    if (income) {
      removeExistingResult(); // Удаляем существующий результат перед новым анализом
      const extractedData = extractData();
      if (extractedData.monthlyPayment && extractedData.requiredIncome) {
        const { isGoodDeal, incomeShare } = analyzeDeal(income, extractedData.monthlyPayment);
        injectResult(isGoodDeal, incomeShare);
      }
    }
  }
});
