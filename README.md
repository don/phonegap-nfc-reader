# PhoneGap NFC Reader Demo

Simple web app that reads an NDEF Message from a NFC tag. 

The application will read NDEF tags when running.

The android will open the application when a tag with a Mime Media Record of type "text/pg" is scanned

## Android

### Requires 

* Android Phone with NFC
* [Android SDK](http://developer.android.com/sdk/index.html)
* PhoneGap 2.3.0 (included in project)
* phonegap-nfc-0.4.2 plugin (included in project)

### Configuration

Generate a `local.properties` file using the android tool.

	$ android update project -p

### Building

Use ant to build the code and install on your phone

	$ ant debug install

## BlackBerry 7

### Requires 

* BlackBerry Phone with NFC 
* BlackBerry OS 7 (7.1 recommended)
* [Webworks SmartPhone SDK](https://bdsc.webapps.blackberry.com/html5/download/sdk)
* [BlackBerry Desktop Software](http://us.blackberry.com/apps-software/desktop/)
* BlackBerry Signing Keys - See [PhoneGap Instruction](http://docs.phonegap.com/en/1.7.0/guide_getting-started_blackberry_index.md.html#Getting%20Started%20with%20Blackberry_5b_deploy_to_device_windows_and_mac) for more details
* PhoneGap 2.3.0 (included in project)
* phonegap-nfc-0.4.2 plugin (included in project)

### Configuration

Copy `webworks/project.properties.template` to `webworks/project.properties`.  Edit the entries for `blackberry.bbwp.dir=` and `blackberry.sigtool.password=`. 

	blackberry.bbwp.dir=/Developer/SDKs/Research\ In\ Motion/BlackBerry\ WebWorks\ SDK\ 2.3.1.5
	blackberry.sigtool.password=secret

### Building

Use ant to build the code and install on your phone

	$ ant blackberry load-device
	
### Known Issues

If you get a ControlledAccessException when registering the NFC listener, the version of the OS is too old.  Try version 7.0.0.337 (bundle 1603) or higher.

This code was test on a BlackBerry Bold 9900 (GSM) with 7.1.0.284 Bundle 998.

## BlackBerry 10

### Requires 

* BlackBerry 10 Phone with NFC 
* [BlackBerry Webworks 10 SDK](https://developer.blackberry.com/html5/download/)
* [BlackBerry 10 Signing Keys](https://www.blackberry.com/SignedKeys/codesigning.html)
* PhoneGap 2.3.0 (included in project)
* phonegap-nfc-0.4.2 plugin (included in project)

### Configuration

Copy `webworks/project.properties.template` to `webworks/project.properties`. Edit the entries for qnx.

    qnx.bbwp.dir=/Developer/SDKs/Research In Motion/BlackBerry 10 WebWorks SDK 1.0.4.5
    qnx.sigtool.password=secret
    qnx.device.ip=192.168.1.100
    qnx.device.password=secret2
    qnx.device.pin=optional

### Building

Use ant to build the code and install on your phone

    $ ant qnx load-device

This code was test on a BlackBerry 10 Dev Alpha B (GSM) with 10.0.9.1675 Bundle 395620.

## PhoneGap NFC

See [phonegap-nfc](https://github.com/chariotsolutions/phonegap-nfc) for more info

