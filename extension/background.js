
async function getA11yScores() {
  // Find all Google Search Results containers
  var searchBody = document.getElementById("search");
  var linkElements = searchBody.getElementsByTagName("a");
  if (linkElements) {
    for (var linkElement of linkElements) {
      // Adds a container with text score loading as the first child in each of the containers.
      let gContainer = linkElement.parentNode.parentNode.parentNode.parentNode;
      if (!linkElement.hasAttribute('role') && gContainer.classList.contains('g') && linkElement.hasAttribute('data-ved') && !linkElement.getAttribute('href').startsWith('/search') && !gContainer.firstChild.innerHTML.startsWith('Score:')) {

        let score = document.createElement("span");
        gContainer.insertBefore(score, gContainer.firstChild);
        // Pass each of the URLs to be scanned by the API
        // NOTE: We encode the URI component so the special characters do not break the link.
          score.innerHTML = 'Score: Loading';
          try{
          fetch(`http://localhost:8080?url=${encodeURIComponent(linkElement.href)}`).then((results) => {
            return results.json();
          }).then(json => {
            if (json.issues) {
              // Temporary hack for displaying the results from the API
              score.innerHTML = `Score: ${json.issues} errors`;
            } else {
              // This should never happen but we should be prepared to handle this.
              score.innerHTML = `Pa11y could not process this link - Error was ${json.error}`;
            }
          }).catch((error) => {
            console.log(error);
            score.innerHTML = `The server is not reachable due to ${error.toString()}`;
          });
        }catch(err){
          console.log(err);
        } 
      }
      }
    }
  }


chrome.webRequest.onCompleted.addListener(function (details) {
  // Run the get A11y Scores function after google searching.
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    function: getA11yScores
  });
},
  { urls: ['*:\/\/*.google.com/search?q=*'] }
);
chrome.runtime.onInstalled.addListener(async () => {
  // Load in the HTML
  let url = chrome.runtime.getURL("hello.html");
  // Create a tab to display the HTML Form
  let tab = await chrome.tabs.create({ url });
  console.log(`Created tab ${tab.id}`);
});
