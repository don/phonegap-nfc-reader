var ready = function() {

    function nfcListener(nfcEvent) { 
        navigator.notification.alert(nfc.bytesToHexString(nfcEvent.tag.id), function() {}, "NFC Tag ID");
    }

    function win() {
        console.log("Listening for tags");
    }

    function fail(reason) {
        navigator.notification.alert(reason, function() {}, "There was a problem");
    }

    // Create 2 Listeners that use the same event handler
    nfc.addTagDiscoveredListener(nfcListener, win, fail); // non-ndef tags
    nfc.addNdefListener(nfcListener, win, fail);
    
};

document.addEventListener('deviceready', ready, false);
