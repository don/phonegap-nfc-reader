// TODO wrap in app object

function init() {
    document.addEventListener('deviceready', ready, false);
}

function clearScreen() {
    document.getElementById("tagContents").innerHTML = "";
}

// TODO move markup to index.html
function showInstructions() {
    document.getElementById("tagContents").innerHTML =
    "<div id='instructions'>" +
    " <p>Scan a tag to begin.<\/p>" +
    " <p><\/p>" +    
    "<\/div>";
}

function onNfc(nfcEvent) {
    console.log(JSON.stringify(nfcEvent.tag));
    clearScreen();

    var tag = nfcEvent.tag,
        source = document.getElementById('non-ndef-template').innerHTML,
        template = Handlebars.compile(source);

    tagContents.innerHTML = template(tag);

    navigator.notification.vibrate(100);
}

function onNdef(nfcEvent) {
    console.log(JSON.stringify(nfcEvent.tag));
    clearScreen();

    var tag = nfcEvent.tag;

    // BB7 has different names, copy to Android names
    if (tag.serialNumber) {
        tag.id = tag.serialNumber;
        tag.isWritable = !tag.isLocked;
        tag.canMakeReadOnly = tag.isLockable;
    }

    // TODO compile template outside of listener
    var source = document.getElementById('tag-template').innerHTML;
    var template = Handlebars.compile(source);
    
    tagContents.innerHTML = template(tag);

    navigator.notification.vibrate(100);
}

var ready = function() {

    function failure(reason) {
        navigator.notification.alert(reason, function() {}, "There was a problem");
    }
    
    nfc.addNdefListener(
        onNdef,
        function() {
            console.log("Listening for NDEF tags.");
        },
        failure
    );
    
    if (device.platform == "Android") {

        // Android reads non-NDEF tag. BlackBerry and Windows don't.
        nfc.addTagDiscoveredListener(
            onNfc,
            function() {
                console.log("Listening for non-NDEF tags.");
            },
            failure
        );

        // Android launches the app when tags with mime type text/pg are scanned
        // because of an intent in AndroidManifest.xml.
        // phonegap-nfc fires an ndef-mime event (as opposed to an ndef event)
        // the code reuses the same onNfc handler
        nfc.addMimeTypeListener(
            'text/pg',
            onNdef,
            function() {
                console.log("Listening for NDEF mime tags with type text/pg.");
            },
            failure
        );

    }

    Handlebars.registerHelper('bytesToString', function(byteArray) { 
        return nfc.bytesToString(byteArray);  // TODO nfc util
    });

    Handlebars.registerHelper('bytesToHexString', function(byteArray) {
        return nfc.bytesToHexString(byteArray);  // TODO nfc util
    });

    // useful for boolean
    Handlebars.registerHelper('toString', function(value) {  
        return String(value);  
    });

    Handlebars.registerHelper('tnfToString', function(tnf) {  
        return tnfToString(tnf);  
    });

    Handlebars.registerHelper('decodePayload', function(record) {

        var recordType = nfc.bytesToString(record.type),
            payload;

        // TODO extract this out to decoders that live in NFC code
        // TODO add a method to ndefRecord so the helper 
        // TODO doesn't need to do this

        if (recordType === "T") {
            var langCodeLength = record.payload[0],
            text = record.payload.slice((1 + langCodeLength), record.payload.length);
            payload = nfc.bytesToString(text);

        } else if (recordType === "U") {
            var identifierCode = record.payload.shift(),
            uri =  nfc.bytesToString(record.payload);

            if (identifierCode !== 0) {
                // TODO decode based on URI Record Type Definition
                console.log("WARNING: uri needs to be decoded");
            }
            //payload = "<a href='" + uri + "'>" + uri + "<\/a>";
            payload = uri;

        } else {

            // kludge assume we can treat as String
            payload = nfc.bytesToString(record.payload); 
        }

        return payload;
    });


    showInstructions();
    
};


// TODO - process the message before sending to template??
function convertData() {

    // tag
    // add id as hex string (keep binary version)
    // convert boolean to string (keep boolean?)

    // for each record in the ndef message
    // record.tnfString = tnfToString(record.tnf);
    // record.typeString = nfc.bytesToString(record.type);
    // record.payloadString = nfc.decodePayload(record);
    //     TODO can people add their own decode?
    // record.idString = nfc.bytesToString(record.id);
}


// TODO move to phonegap-nfc util
function tnfToString(tnf) {
    var value = tnf;
    
    switch (tnf) {
    case ndef.TNF_EMPTY:
        value = "Empty";
        break; 
    case ndef.TNF_WELL_KNOWN:
        value = "Well Known";
        break;     
    case ndef.TNF_MIME_MEDIA:
        value = "Mime Media";
        break;     
    case ndef.TNF_ABSOLUTE_URI:
        value = "Absolute URI";
        break;     
    case ndef.TNF_EXTERNAL_TYPE:
        value = "External";
        break;     
    case ndef.TNF_UNKNOWN:
        value = "Unknown";
        break;     
    case ndef.TNF_UNCHANGED:
        value = "Unchanged";
        break;     
    case ndef.TNF_RESERVED:
        value = "Reserved";
        break;     
    }
    return value;
}