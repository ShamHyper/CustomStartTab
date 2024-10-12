chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "reloadTab") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
        });
        sendResponse({ status: "Tab reloaded" });
    }
});