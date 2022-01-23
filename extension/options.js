// Saves options to chrome.storage
function save_options(event) {
  console.log("save options");
  event.preventDefault();
  var blind = document.getElementById("blind").checked;
  var deaf = document.getElementById("deaf").checked;
  var colorBlind = document.getElementById("colorblind").checked;
  var add = document.getElementById("add").checked;
  var lv = document.getElementById("lv").checked;
  var motor = document.getElementById("motor").checked;
  var cognitive = document.getElementById("cognitive").checked;
  var sk = document.getElementById("sk").checked
;
  const options = { blind: blind, deaf: deaf, colorBlind: colorBlind, add: add, lv: lv, motor: motor, cognitive: cognitive, sk: sk, };
  chrome.storage.sync.set(options, function () {
    console.log(
      "Value is set to " + options.blind + options.deaf + options.colorBlind + options.add + options.lv + options.motor + options.cognitive +options.sk
    );
  });
}

function on_load(){
  let inputs = document.getElementsByTagName('input');
  for(var input of inputs){
    if(input.getAttribute("type")=="checkbox"){
        input.addEventListener("change",save_options);
    }
  }
  restore_options();
  
}
function restore_options() {
  // Use default value blind = false, deaf = false, colorBlind = false
  console.log("restore options");
  chrome.storage.sync.get(
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
      console.log("Values are " + items.blind + items.deaf + items.colorBlind);
      document.getElementById("blind").checked = items.blind;
      document.getElementById("deaf").checked = items.deaf;
      document.getElementById("colorblind").checked = items.colorBlind;
      document.getElementById("add").checked = items.add;
      document.getElementById("lv").checked = items.lv;
      document.getElementById("motor").checked = items.motor;
      document.getElementById("cognitive").checked = items.cognitive;
      document.getElementById("sk").checked = items.sk;
    }
  );
}

document.addEventListener("DOMContentLoaded", on_load);
