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
        add: false,
        lv: false,
        motor: false,
        cognitive: false,
        sk: false,
      },
      function (items) {
        // Update the ending based on the stored values
        ending = ending + "b" + (items.blind ? "t" : "f");
        ending = ending + "d" + (items.deaf ? "t" : "f");
        ending = ending + "c" + (items.colorBlind ? "t" : "f");
        ending = ending + "a" + (items.add ? "t" : "f");
        ending = ending + "l" + (items.lv ? "t" : "f");
        ending = ending + "m" + (items.motor ? "t" : "f");
        //doing g for cognitive because c is taken
        ending = ending + "g" + (items.cognitive ? "t" : "f");
        ending = ending + "s" + (items.sk ? "t" : "f");

        // Iterate through all links
        for (var linkElement of linkElements) {
          // Adds a container with text score loading as the first child in each of the containers.
          let gContainer =
            linkElement.parentNode.parentNode.parentNode.parentNode;
          let gContainerTwo =
            linkElement.parentNode.parentNode.parentNode.parentNode.parentNode
              .parentNode;
          let container = linkElement.parentNode;
          // console.log(linkElement);
          if (
            !linkElement.hasAttribute("role") &&
            (linkElement.classList.contains("l") ||
              linkElement.classList.contains("fl") ||
              linkElement.classList.contains("WlydOe") ||
              gContainer.classList.contains("g") ||
              gContainerTwo.classList.contains("g") ||
              gContainerTwo.tagName.toLowerCase() == "li" ||
              container.classList.contains("HiHjCd")) &&
            !linkElement.getAttribute("href").startsWith("/search")
          ) {
            // Pass each of the URLs to be scanned by the API
            // NOTE: We encode the URI component so the special characters do not break the link.
            let apiUrl = `http://localhost:8080?url=${encodeURIComponent(
              linkElement.href
            )}&disabilities=${ending}`;
            let linkTextElement = undefined;
            if (linkElement.classList.contains("WlydOe")) {
              linkTextElement = linkElement.getElementsByClassName("mCBkyc")[0];
            } else if (
              linkElement.classList.contains("l") ||
              linkElement.classList.contains("fl") ||
              container.classList.contains("HiHjCd")
            ) {
              linkTextElement = linkElement;
            } else if (linkElement.hasAttribute("data-ved")) {
              linkTextElement = linkElement.getElementsByTagName("h3")[0];
            }
            let originalHTML = linkTextElement.innerHTML;
            linkTextElement.innerHTML = "Ha11y Loading - " + originalHTML;
            // The following line should be considered make the app messier rather than more beneficial
            //linkText.setAttribute("aria-live","polite");

            fetch(apiUrl)
              .then((results) => {
                return results.json();
              })
              .then((json) => {
                if (json.totalScore) {
                  // Temporary hack for displaying the results from the API
                  linkTextElement.innerHTML =
                    `Ha11y Score ${json.totalScore} - ` + originalHTML;
                } else {
                  // This should never happen but we should be prepared to handle this.
                  linkTextElement.innerHTML =
                    `Ha11y Error - ` +
                    originalHTML +
                    ` - Ha11y error was ${json.errors}`;
                }
              })
              .catch((error) => {
                //console.log(error);
                linkTextElement.innerHTML =
                  "Ha11y Error - " +
                  originalHTML +
                  ` - Ha11y Server Error was ${error.toString()}`;
              });
          }
        }
      }

    );
  }
}

chrome.webRequest.onCompleted.addListener(
  function (details) {
    // Run the get A11y Scores function after google searching.
    // Do not run on fromCache as it crashes due to lack of permissions
    // This occurs when you click on a Google Result then go back a page
    if (!details["fromCache"]) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        function: getA11yScores,
      });
    }
  },
  { urls: [`*:\/\/*.google.com/search?q=*`] }
);
chrome.runtime.onInstalled.addListener(async () => {
  // Create a tab and display our current index.html file
  let url = chrome.runtime.getURL("index.html");

  let tab = await chrome.tabs.create({ url });
  console.log(`Created tab ${tab.id}`);
});
