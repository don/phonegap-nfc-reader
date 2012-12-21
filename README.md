# PhoneGap NFC Reader Demo

Simple web app that reads an NDEF Message from a NFC tag. 

The application will read NDEF tags when running.

The android will open the application when a tag with a Mime Media Record of type "text/pg" is scanned

## Android

### Requires 

* Android Phone with NFC
* [Android SDK](http://developer.android.com/sdk/index.html)
* PhoneGap 2.2.0 (included in project)
* phonegap-nfc-0.4.1 plugin (included in project)

### Configuration

Generate a `local.properties` file using the android tool.

	$ android update project -p

### Building

Use ant to build the code and install on your phone

	$ ant debug install

## Blackberry

### Requires 

* Blackberry Phone with NFC 
* Blackberry OS 7 (7.1 recommended)
* [Webworks SmartPhone SDK](https://bdsc.webapps.blackberry.com/html5/download/sdk)
* [Blackberry Desktop Software](http://us.blackberry.com/apps-software/desktop/)
* Blackberry Signing Keys - See [PhoneGap Instruction](http://docs.phonegap.com/en/1.7.0/guide_getting-started_blackberry_index.md.html#Getting%20Started%20with%20Blackberry_5b_deploy_to_device_windows_and_mac) for more details
* PhoneGap 1.9.0 (included in project)
* phonegap-nfc-0.4.1 plugin (included in project)

### Configuration

Copy `webworks/project.properties.template` to `webworks/project.properties`.  Edit the entries for `blackberry.bbwp.dir=` and `blackberry.sigtool.password=`. 

	blackberry.bbwp.dir=/Developer/SDKs/Research\ In\ Motion/BlackBerry\ WebWorks\ SDK\ 2.3.1.5
	blackberry.sigtool.password=secret

### Building

Use ant to build the code and install on your phone

	$ ant blackberry load-device
	
### Known Issues

If you get a ControlledAccessException when registering the NFC listener, the version of the OS is too old.  Try version 7.0.0.337 (bundle 1603) or higher.

This code was test on a Blackberry Bold 9900 (GSM) with 7.1.0.284 Bundle 998.

## PhoneGap NFC

See [phonegap-nfc](https://github.com/chariotsolutions/phonegap-nfc) for more info

