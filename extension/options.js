// Saves options to chrome.storage
function save_options(event) {
  console.log("save options");
  event.preventDefault();
  var blind = document.getElementById("blind").checked;
  var deaf = document.getElementById("deaf").checked;
  var colorBlind = document.getElementById("colorblind").checked;
  const options = { blind: blind, deaf: deaf, colorBlind: colorBlind };
  chrome.storage.sync.set(options, function () {
    console.log(
      "Value is set to " + options.blind + options.deaf + options.colorBlind
    );
  });
}

function restore_options() {
  // Use default value blind = false, deaf = false, colorBlind = false
  console.log("restore options");
  chrome.storage.sync.get(
    {
      blind: false,
      deaf: false,
      colorBlind: false,
    },
    function (items) {
      console.log("Values are " + items.blind + items.deaf + items.colorBlind);
      document.getElementById("blind").checked = items.blind;
      document.getElementById("deaf").checked = items.deaf;
      document.getElementById("colorblind").checked = items.colorBlind;
    }
  );
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
