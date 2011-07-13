/*global NdefPlugin, Ndef */

function onNfc(nfcEvent) {
  console.log(JSON.stringify(nfcEvent.tagData));
  // ignore what's on the tag for now, just overwrite
  
  var mimeType = document.forms[0].elements["mimeType"].value,
    payload = document.forms[0].elements["payload"].value,
    record = Ndef.mimeMediaRecord(mimeType, Ndef.stringToBytes(payload));

  navigator.nfc.writeTag(
        [record], 
        function () { 
            navigator.notification.vibrate(100);
        }, function () {
            alert("Failed to write message to tag.");
        });   
}

var ready = function () {
  
  function win() {
    console.log("Listening for NDEF tags");
  }
  
  function fail() {
    alert('Failed to register NFC Listener');
  }
  
  navigator.nfc.addNdefListener(onNfc, win, fail);          
};

// deviceready is being called before the plugins finish initializing
// add setTimeout as a kludge until the real problem is fixed
document.addEventListener('deviceready', ready, false);