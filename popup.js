document.addEventListener('DOMContentLoaded', () => {
  const incomeInput = document.getElementById('income');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resultDiv = document.getElementById('result');
  const dealStatus = document.getElementById('dealStatus');
  const monthlyPayment = document.getElementById('monthlyPayment');
  const requiredIncome = document.getElementById('requiredIncome');
  const percentageDifference = document.getElementById('percentageDifference');
  const errorDiv = document.getElementById('error');

  // Load saved income
  chrome.storage.sync.get('income', (data) => {
    if (data.income) {
      incomeInput.value = data.income;
      hideError(); // Скрываем сообщение об ошибке при загрузке сохраненного дохода
    }
  });

  // Save income when changed and hide error message
  incomeInput.addEventListener('change', () => {
    chrome.storage.sync.set({ income: incomeInput.value });
    if (parseFloat(incomeInput.value)) {
      hideError(); // Скрываем сообщение об ошибке, если введен корректный доход
    }
  });

  analyzeBtn.addEventListener('click', () => {
    const income = parseFloat(incomeInput.value);
    if (!income) {
      showError('Пожалуйста, введите ваш доход.');
      return;
    }

    hideError(); // Скрываем сообщение об ошибке перед началом анализа

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab.url.match(/^https:\/\/.*\.cian\.ru\/.+\/flat\/.+$/)) {
        showError('Пожалуйста, убедитесь, что вы находитесь на странице объявления Cian.');
        return;
      }

      chrome.tabs.sendMessage(tab.id, { action: 'analyze', income }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Ошибка при отправке сообщения:', chrome.runtime.lastError);
          showError(`Ошибка при анализе: ${chrome.runtime.lastError.message}. Пожалуйста, обновите страницу и попробуйте снова.`);
          return;
        }

        if (!response) {
          showError('Не получен ответ от content script. Пожалуйста, обновите страницу и попробуйте снова.');
          return;
        }

        if (response.error) {
          showError(response.error);
          return;
        }

        displayResults(response);
      });
    });
  });

  function displayResults(data) {
    resultDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');

    console.log('Received data:', data); // Отладочная информация

    dealStatus.textContent = data.isGoodDeal ? 'Хорошая сделка' : 'Плохая сделка';
    dealStatus.className = data.isGoodDeal ? 'text-green-500 font-bold' : 'text-red-500 font-bold';
    monthlyPayment.textContent = `Ежемесячный платеж: ${data.monthlyPayment.toLocaleString()} ₽`;
    requiredIncome.textContent = `Необходимый доход: ${data.requiredIncome.toLocaleString()} ₽`;
    
    if (data.incomeShare !== undefined) {
      percentageDifference.textContent = `Доля от дохода: ${data.incomeShare.toFixed(2)}%`;
    } else {
      percentageDifference.textContent = 'Доля от дохода: Недостаточно данных';
    }
  }

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');
  }

  function hideError() {
    errorDiv.textContent = '';
    errorDiv.classList.add('hidden');
  }
});
