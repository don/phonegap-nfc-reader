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
* PhoneGap 2.8.0 (included in project)
* phonegap-nfc-0.4.4 plugin (included in project)

### Cordova CLI >= 2.8.19

Requires [nodejs](http://nodejs.org).

    $ npm install cordova -g

### Running

	$ cordova run

## PhoneGap NFC

See [phonegap-nfc](https://github.com/chariotsolutions/phonegap-nfc) for more info
