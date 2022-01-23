// Saves options to chrome.storage
function save_options(event) {
  console.log("save options");
  event.preventDefault();
  var blind = document.getElementById("blind").checked;
  var deaf = document.getElementById("deaf").checked;
  var colorBlind = document.getElementById("colorblind").checked;
  var mobility = document.getElementById("mobility").checked;
  var cognitive = document.getElementById("cognitive").checked;
  var attentionDeficit = document.getElementById("attentionDeficit").checked;
  var sightedKeyboardUsers = document.getElementById(
    "sightedKeyboardUsers"
  ).checked;
  var lowVision = document.getElementById("lowVision").checked;
  const options = {
    blind: blind,
    deaf: deaf,
    colorBlind: colorBlind,
    mobility: mobility,
    cognitive: cognitive,
    attentionDeficit: attentionDeficit,
    sightedKeyboardUsers: sightedKeyboardUsers,
    lowVision: lowVision,
  };
  chrome.storage.sync.set(options, function () {
    console.log(
      "Value is set to " +
        options.blind +
        options.deaf +
        options.colorBlind +
        options.mobility +
        options.cognitive +
        options.attentionDeficit +
        options.sightedKeyboardUsers +
        options.lowVision
    );
  });
}

function on_load() {
  restore_options();
  document
    .getElementById("disability-submit")
    .addEventListener("click", save_options);
}
function restore_options() {
  // Use default value blind = false, deaf = false, colorBlind = false
  console.log("restore options");
  chrome.storage.sync.get(
    {
      blind: false,
      deaf: false,
      colorBlind: false,
      mobility: false,
      cognitive: false,
      attentionDeficit: false,
      sightedKeyboardUsers: false,
      lowVision: false,
    },
    function (items) {
      console.log("Values are " + items.blind + items.deaf + items.colorBlind);
      document.getElementById("blind").checked = items.blind;
      document.getElementById("deaf").checked = items.deaf;
      document.getElementById("colorblind").checked = items.colorBlind;
      document.getElementById("mobility").checked = items.mobility;
      document.getElementById("cognitive").checked = items.cognitive;
      document.getElementById("attentionDeficit").checked =
        items.attentionDeficit;
      document.getElementById("sightedKeyboardUsers").checked =
        items.sightedKeyboardUsers;
      document.getElementById("lowVision").checked = items.lowVision;
    }
  );
}

document.addEventListener("DOMContentLoaded", on_load);
