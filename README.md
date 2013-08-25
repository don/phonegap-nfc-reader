# PhoneGap NFC Reader Demo

Simple web app that reads an NDEF Message from a NFC tag. 

The application will read NDEF tags when running.

The android will open the application when a tag with a Mime Media Record of type "text/pg" is scanned

## Supported Platforms
 
 * [Android](#android)

 See master branch for additional platforms
 
## Android

### Requires 

* Android Phone with NFC
* [Android SDK](http://developer.android.com/sdk/index.html)
* Cordova CLI
* PhoneGap 3.0 (included in project)
* [Device](http://docs.phonegap.com/en/3.0.0/cordova_device_device.md.html#Device) plugin (included in project)
* [phonegap-nfc](https://github.com/chariotsolutions/phonegap-nfc) plugin (included in project)

### Cordova CLI >= 3.0

Requires [nodejs](http://nodejs.org).

    $ npm install cordova -g

### Running

	$ cordova run

## PhoneGap NFC

See [phonegap-nfc](https://github.com/chariotsolutions/phonegap-nfc) for more info
