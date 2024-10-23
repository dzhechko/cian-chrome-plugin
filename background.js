chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.match(/^https:\/\/.*\.cian\.ru\/.+\/flat\/.+$/)) {
    chrome.storage.sync.get('income', (data) => {
      if (data.income) {
        chrome.tabs.sendMessage(tabId, { action: 'analyze', income: parseFloat(data.income) });
      }
    });
  }
});
