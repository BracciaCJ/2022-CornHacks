async function getA11yScores() {
  // Find all Google Search Results containers
  var searchBody = document.getElementById("search");
  var linkElements = searchBody.getElementsByTagName("a");
  if (linkElements) {
    for (var linkElement of linkElements) {
      // Adds a container with text score loading as the first child in each of the containers.
      let gContainer = linkElement.parentNode.parentNode.parentNode.parentNode;
      if (
        !linkElement.hasAttribute("role") &&
        gContainer.classList.contains("g") &&
        linkElement.hasAttribute("data-ved") &&
        !linkElement.getAttribute("href").startsWith("/search") &&
        !gContainer.firstChild.innerHTML.startsWith("Score:")
      ) {
        let score = document.createElement("span");
        gContainer.insertBefore(score, gContainer.firstChild);
        // Pass each of the URLs to be scanned by the API
        // NOTE: We encode the URI component so the special characters do not break the link.
        score.innerHTML = "Score: Loading";
        try {
          fetch(
            `http://localhost:8080?url=${encodeURIComponent(linkElement.href)}`
          )
            .then((results) => {
              return results.json();
            })
            .then((json) => {
              if (json.issues) {
                // Temporary hack for displaying the results from the API
                score.innerHTML = `Score: ${json.issues} errors`;
              } else {
                // This should never happen but we should be prepared to handle this.
                score.innerHTML = `Ha11y could not process this link - Error was ${json.error}`;
              }
            })
            .catch((error) => {
              console.log(error);
              score.innerHTML = `The Ha11y server is not reachable due to ${error.toString()}`;
            });
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}

chrome.webRequest.onCompleted.addListener(
  function (details) {
    // Run the get A11y Scores function after google searching.
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      function: getA11yScores,
    });
  },
  { urls: ["*://*.google.com/search?q=*"] }
);
chrome.runtime.onInstalled.addListener(async () => {
  // While we could have used `let url = "hello.html"`, using runtime.getURL is a bit more robust as
  // it returns a full URL rather than just a path that Chrome needs to be resolved contextually at
  // runtime.
  let url = chrome.runtime.getURL("index.html");

  // Open a new tab pointing at our page's URL using JavaScript's object initializer shorthand.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#new_notations_in_ecmascript_2015
  //
  // Many of the extension platform's APIs are asynchronous and can either take a callback argument
  // or return a promise. Since we're inside an async function, we can await the resolution of the
  // promise returned by the tabs.create call. See the following link for more info on async/await.
  // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
  let tab = await chrome.tabs.create({ url });
  console.log(`Created tab ${tab.id}`);
});
