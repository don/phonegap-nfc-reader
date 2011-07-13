package com.chariotsolutions.nfc.demo.reader;

import com.phonegap.*;
import android.os.Bundle;

public class ReaderDemo extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}
