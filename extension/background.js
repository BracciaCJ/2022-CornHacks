async function getA11yScores() {
  // Find all Google Search Results containers
  var searchBody = document.getElementById("search");
  var linkElements = searchBody.getElementsByTagName("a");
  let ending = "";
  // Check that link elements were returned
  if (linkElements) {
    // Get the stored values for what disabilities the user has
    await chrome.storage.sync.get(
      {
        blind: false,
        deaf: false,
        colorBlind: false,
      },
      function (items) {
        // Update the ending based on the stored values
        ending = ending + 'b' + (items.blind ? 't' : 'f');
        ending = ending + 'd' + (items.deaf ? 't' : 'f');
        ending = ending + 'c' + (items.colorBlind ? 't' : 'f');
        // Iterate through all links
        for (var linkElement of linkElements) {
          // Adds a container with text score loading as the first child in each of the containers.
          let gContainer = linkElement.parentNode.parentNode.parentNode.parentNode;
          let gContainerTwo = linkElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
          if (!linkElement.hasAttribute('role') && (gContainer.classList.contains('g') || gContainerTwo.classList.contains('g') || gContainerTwo.tagName.toLowerCase()=='li') && linkElement.hasAttribute('data-ved') && !linkElement.getAttribute('href').startsWith('/search')) {
            let linkText= linkElement.getElementsByTagName('h3')[0];
            let originalHTML = linkText.innerHTML;
            linkText.innerHTML = "Ha11y Loading - "+originalHTML;
            // The following line should be considered make the app messier rather than more beneficial
            //linkText.setAttribute("aria-live","polite");
            // Pass each of the URLs to be scanned by the API
            // NOTE: We encode the URI component so the special characters do not break the link.
            let apiUrl = `http://localhost:8080?url=${encodeURIComponent(linkElement.href)}&disabilities=${ending}`

            try {
              fetch(apiUrl).then((results) => {
                return results.json();
              }).then(json => {
                if (json.issues) {
                  // Temporary hack for displaying the results from the API
                  linkText.innerHTML = `Ha11y Score ${json.score} - `+originalHTML;
                } else {
                  // This should never happen but we should be prepared to handle this.
                  linkText.innerHTML = `Ha11y Error `+originalHTML+` - Ha11y error was ${json.errors}`;
                }
              }).catch((error) => {
                console.log(error);
                linkText.innerHTML = 'Ha11y Error ' + originalHTML + ` - Ha11y Server Error was ${error.toString()}`;
              });
            } catch (err) {
              console.log(err);
            }
          }
        }

      });
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
  // Create a tab and display our current index.html file
  let url = chrome.runtime.getURL("index.html");

  let tab = await chrome.tabs.create({ url });
  console.log(`Created tab ${tab.id}`);
});
