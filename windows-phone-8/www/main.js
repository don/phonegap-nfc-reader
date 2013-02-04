function init() {
    document.addEventListener('deviceready', ready, false);
}

// TODO need better html make it clear this is record info
function template(record) {
    var id = "",
        tnf = tnfToString(record.tnf),
        recordType = nfc.bytesToString(record.type),
        payload,
        html;
        
    if (record.id && (record.id.length > 0)) {
        id = "Record Id: <b>" + record.id + "<\/b><br/>";
    }        

    if (recordType === "T") {
        var langCodeLength = record.payload[0],
        text = record.payload.slice((1 + langCodeLength), record.payload.length);
        payload = nfc.bytesToString(text);

    } else if (recordType === "U") {
        var url =  nfc.bytesToString(record.payload);
        payload = "<a href='" + url + "'>" + url + "<\/a>";

    } else {
        // attempt display as a string
        payload = nfc.bytesToString(record.payload);
    }

    html = id + "TNF: <b>" + tnf + "<\/b><br/>";

    if (record.tnf !== ndef.TNF_EMPTY) {
        html +=  "Record Type: <b>" + recordType + "<\/b>" +
                 "<br/>" + payload;
    } 

    return html;
}

function showProperty(parent, name, value) {
    var dt, dd;
    dt = document.createElement("dt");
    dt.innerHTML = name;
    dd = document.createElement("dd");
    dd.innerHTML = value;
    parent.appendChild(dt);
    parent.appendChild(dd);
}

function clearScreen() {
    document.getElementById("tagContents").innerHTML = "";
}

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

    var tag = nfcEvent.tag;    
    var records = tag.ndefMessage || [],
    display = document.getElementById("tagContents");
    display.appendChild(
        document.createTextNode(
            "Scanned an NDEF tag with " + records.length + " record" + ((records.length === 1) ? "": "s")
        )
    );
    
    // Display Tag Info
    var meta = document.createElement('dl');
    display.appendChild(meta);
        
    if (device.platform.match(/Android/i)) {
        if (tag.id) {
            showProperty(meta, "Id", nfc.bytesToHexString(tag.id));
        }
        showProperty(meta, "Tag Type", tag.type);
        showProperty(meta, "Max Size", tag.maxSize + " bytes");
        showProperty(meta, "Is Writable", tag.isWritable);
        showProperty(meta, "Can Make Read Only", tag.canMakeReadOnly);
    
    } else if (device.platform.match(/Win.+/i)) {

        // don't know how to get tag meta info /yet/ for Windows Phone

    } else if (navigator.userAgent.indexOf("BB10") > -1) {
        
        // don't know how to get tag meta info /yet/ for BB10

    } else { // assuming blackberry 7
        if (tag.serialNumber) {
            showProperty(meta, "Serial Number", nfc.bytesToHexString(tag.serialNumber));        
        }        
        showProperty(meta, "Tag Type", tag.tagType);        
        showProperty(meta, "Free Space", tag.freeSpaceSize + " bytes");
        showProperty(meta, "Is Writable", !tag.isLocked);
        showProperty(meta, "Can Make Read Only", tag.isLockable);        
    }

    // Display Record Info
    for (var i = 0; i < records.length; i++) {
        var record = records[i],
        p = document.createElement('p');
        p.innerHTML = template(record);
        display.appendChild(p);
    }
    navigator.notification.vibrate(100);
}

var ready = function() {

    function failure(reason) {
        navigator.notification.alert(reason, function() {}, "There was a problem");
    }
    
    nfc.addNdefListener(
        onNfc,
        function() {
            console.log("Listening for NDEF tags.");
        },
        failure
    );
    
    if (device.platform == "Android") {

        // Android reads non-NDEF tag. BlackBerry and Windows don't.
        nfc.addTagDiscoveredListener(
            function(nfcEvent) {
                var tag = nfcEvent.tag;
                navigator.notification.alert(nfc.bytesToHexString(tag.id), function() {}, "NFC Tag");
            },
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
            onNfc,
            function() {
                console.log("Listening for NDEF mime tags with type text/pg.");
            },
            failure
        );

    }
    
    showInstructions();
    
};

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