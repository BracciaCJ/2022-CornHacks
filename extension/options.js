// Saves options to chrome.storage
function save_options(event) {
  console.log("save options");
  event.preventDefault();
  var blind = document.getElementById("blind").checked;
  var deaf = document.getElementById("deaf").checked;
  var colorBlind = document.getElementById("colorblind").checked;
  var add = document.getElementById("add").checked;
  var lv = document.getElementById("lowvision").checked;
  var motor = document.getElementById("motor").checked;
  var cognitive = document.getElementById("cognitive").checked;
  var sk = document.getElementById("sightedkeyboarduser").checked;
  let verbose = document.getElementById("verbose");
  let medium = document.getElementById("medium");
  let errorLoggingVerbosityVal=0;
  if(verbose.checked){
    errorLoggingVerbosityVal = 2
  }else if(medium.checked){
    errorLoggingVerbosityVal = 1;
  }
  const options = { blind: blind, deaf: deaf, colorBlind: colorBlind, add: add, lv: lv, motor: motor, cognitive: cognitive, sk: sk, errorLoggingVerbosityVal:errorLoggingVerbosityVal};
  chrome.storage.sync.set(options, function () {
    console.log(
      "Updated the values of the Chrome Storage Options"
      );
  });
}

function on_load(){
  let inputs = document.getElementsByTagName('input');
  for(var input of inputs){
        input.addEventListener("change",save_options);
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
      errorLoggingVerbosityVal:0,

    },
    function (items) {
      
      console.log("Values are " + items.blind + items.deaf + items.colorBlind);
      if(items.errorLoggingVerbosityVal==2){
        document.getElementById("verbose").checked=true;
      }else if(items.errorLoggingVerbosityVal==1){
        document.getElementById("medium").checked =true
      }else{
        document.getElementById("low").checked = true;
      }
      document.getElementById("blind").checked = items.blind;
      document.getElementById("deaf").checked = items.deaf;
      document.getElementById("colorblind").checked = items.colorBlind;
      document.getElementById("add").checked = items.add;
      document.getElementById("lowvision").checked = items.lv;
      document.getElementById("motor").checked = items.motor;
      document.getElementById("cognitive").checked = items.cognitive;
      document.getElementById("sightedkeyboarduser").checked = items.sk;
    }
  );
}

document.addEventListener("DOMContentLoaded", on_load);
