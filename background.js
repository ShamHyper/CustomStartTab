chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "reloadTab") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.reload(tabs[0].id);
                sendResponse({ status: "Tab reloaded" });
            } else {
                sendResponse({ status: "No active tab found" });
            }
        });
        return true;
    }
});