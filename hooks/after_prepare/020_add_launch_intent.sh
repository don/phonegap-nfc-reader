#!/usr/bin/env zsh

MANIFEST=${0:h}/../../platforms/android/AndroidManifest.xml
[[ -e $MANIFEST ]] || { print "Manifest not found at $MANIFEST." ; exit 1; }

grep -q HANDLE_MOOZVINE_NOTIFICATION $MANIFEST && { print "Manifest already modified. Nothing to do."; exit 0; }

AFTER_LINE='android:name="MainActivity"'
ADDITION='\
        <intent-filter>\
        <action android:name="android.nfc.action.NDEF_DISCOVERED" />\
        <data android:mimeType="text/pg" />\
        <category android:name="android.intent.category.DEFAULT" />\
        </intent-filter>\
';

sed -i -e "/${AFTER_LINE}/a${ADDITION}" $MANIFEST