const getCookieToken = (sendResponse) => {
  chrome.cookies.get(
    {
      url: "http://localhost:5173/",
      name: "extension-github-token",
    },
    (cookie) => {
      if (cookie) {
        sendResponse(cookie.value);
      }
    }
  );
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get-github-token") {
    getCookieToken(sendResponse);
  }
  return true;
});
