// In-page cache of the user's options
const options = { blind: false, deaf: false, colorBlind: false };
chrome.storage.sync.set(options);

// Saves options to chrome.storage
function save_options(event) {
  event.preventDefault();
  var blind = document.getElementById("blind").checked;
  var deaf = document.getElementById("deaf").checked;
  var colorBlind = document.getElementById("colorblind").checked;
  const options = { blind: blind, deaf: deaf, colorBlind: colorBlind };
  chrome.storage.sync.set(options);
}

function restore_options() {
  // Use default value blind = false, deaf = false, colorBlind = false
  console.log("helllllllllllllllllllllllp");
  chrome.storage.sync.get(
    {
      blind: false,
      deaf: false,
      colorBlind: false,
    },
    function (items) {
      document.getElementById("blind").checked = items.blind;
      document.getElementById("deaf").checked = items.deaf;
      document.getElementById("colorblind").checked = items.colorBlind;
    }
  );
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);

/* function handleCheckboxCeck(event) {
  // Remove styling from the previously selected color
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  let blind = event.target.dataset.blind;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ blind });
} */
