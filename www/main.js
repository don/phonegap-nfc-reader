function init() {
    document.addEventListener('deviceready', ready, false);
}

function template(record) {
    var id = "",
        tnf = tnfToString(record.tnf),
        recordType = nfc.bytesToString(record.type),
        payload;
        
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

    return (id + "TNF: <b>" + tnf + "<\/b><br/>" +
    "Record Type: <b>" + recordType + "<\/b>" +
    "<br/>" + payload
    );
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
    } else { // assuming blackberry
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

    function win() {
        console.log("Listening for NDEF Tags");
    }

    function fail(reason) {
        navigator.notification.alert(reason, function() {}, "There was a problem");
    }
    
    nfc.addNdefListener(
        onNfc,
        function() {
            console.log("Listening for NDEF tags.");
        },
        fail
    );
    
    // android launches the app when tags with text/pg are scanned
    // phonegap-nfc fires an ndef-mime event
    // I am reusing the same onNfc handler
    nfc.addMimeTypeListener(
        'text/pg',
        onNfc,
        function() {
            console.log("Listening for NDEF mime tags with type text/pg.");
        },
        fail
    );

    
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