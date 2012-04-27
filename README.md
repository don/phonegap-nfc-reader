# PhoneGap NFC Reader Demo

Simple web app that reads an NDEF Message from a NFC tag. 

The application will read NDEF and NDEF Formatable tags when running.

Android will open the application when a tag with a Mime Media Record of type "text/pg" is scanned

## Requires 

* Android Phone with NFC
* [Android SDK](http://developer.android.com/sdk/index.html)
* PhoneGap 1.6.1 (included in project)
* phonegap-nfc plugin (included in project)

## Building

Use ant to build the code and install on your phone

	$ ant debug install

See [phonegap-nfc](https://github.com/chariotsolutions/phonegap-nfc) for more info

