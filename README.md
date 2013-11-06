# PhoneGap NFC Reader Demo

Simple web app that reads an NDEF Message from a NFC tag. 

The application will read NDEF tags when running.

The Android version will open the application when a tag with a Mime Media Record of type "text/pg" is scanned. On BlackBerry 10, the application will open when any NFC tag is scanned.

## Supported Platforms
 
 * [Android](#android)
 * [Windows Phone 8](#windows-phone-8)
 * [BlackBerry 10](#blackberry-10)

See the BlackBerry7 tag for the last version to support BlackBerry 7

### Cordova CLI

Cordova 3.1 or greater is required. User npm to install Cordova. npm is part of [nodejs](http://nodejs.org).

    $ npm install cordova -g
 
## Plugins 

* [Device](http://docs.phonegap.com/en/3.1.0/cordova_device_device.md.html#Device) plugin (included in project)
* [Notification](http://docs.phonegap.com/en/3.1.0/cordova_notification_notification.md.html#Notification) vibration plugin (included in project)
* [phonegap-nfc](https://github.com/chariotsolutions/phonegap-nfc) plugin (included in project)
 
## Android

### Requires 

* Android Phone with NFC
* [Android SDK](http://developer.android.com/sdk/index.html)
* Cordova CLI

### Running

	$ cordova run android

## Windows Phone 8

### Requires 

* Windows Phone 8 with NFC 
* [Windows Phone 8 SDK](http://dev.windowsphone.com/en-us/downloadsdk)
* Visual Studio 2012

### Building

Build and deploy with Visual Studio.

This code was test on a Nokia Lumia 825.	

### WP8 Problems

Cordova CLI 3.1.0-0.2.0 is broken (or misconfigured) and won't deploy the plugins, use Visual Studio to deploy.

Windows Phone NFC support is sketchy. Windows wants to grab and handle all NFC tags before the app does. This means that you'll get prompted by Windows to open URIs or get error messages for tags that Windows can't handle like Mime Media Tags. Dismiss the errors and you should be able to see the data in phonegap-nfc-reader. It's not ideal. Microsoft says they know about this. Maybe it will be fixed in Windows Phone 8.1?

## BlackBerry 10

### Requires 

* BlackBerry 10 device with NFC 
* [BlackBerry Native SDK](http://developer.blackberry.com/native/download/)
* Cordova CLI
* [com.blackberry.invoke](http://plugins.cordova.io/#/com.blackberry.invoke) plugin (included in project)

### Running

See the PhoneGap [BlackBerry 10 Platform Guide](http://docs.phonegap.com/en/3.1.0/guide_platforms_blackberry10_index.md.html#BlackBerry%2010%20Platform%20Guide) if you need help getting your environment configured.

	$ cordova run blackberry10 --devicepass 123456
	
This code was test on a BlackBerry Z10.

### BlackBerry 10 Problems

Cordova CLI 3.1.0-0.2.0 has a problem with the engines tag in plugin.xml. If you want to install this in your own project, you may need to delete the engines section from plugin.xml before installing until a newer version of Cordova is released.

## PhoneGap NFC

See [phonegap-nfc](https://github.com/chariotsolutions/phonegap-nfc) for more info
