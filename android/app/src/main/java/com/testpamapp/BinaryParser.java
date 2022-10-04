package com.testpamapp;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeArray;

public class BinaryParser extends ReactContextBaseJavaModule {
    BinaryParser(ReactApplicationContext context) {
        super(context);
    }

    public String getName() {
        return "BinaryParser";
    }

    @ReactMethod
    public void intToBytes(double intVal, Callback resultCallback) {
        int val = (int)intVal;

        WritableNativeArray bytesArray = new WritableNativeArray();
        bytesArray.pushInt((val & 0xFF000000) >> 24);
        bytesArray.pushInt((val & 0xFF0000) >> 16);
        bytesArray.pushInt((val & 0xFF00) >> 8);
        bytesArray.pushInt((val & 0xFF));
        resultCallback.invoke(bytesArray);
    }

    @ReactMethod
    public void shortToBytes(double shortVal, Callback resultCallback) {
        short val = (short)shortVal;

        WritableNativeArray bytesArray = new WritableNativeArray();
        bytesArray.pushInt((val & 0xFF00) >> 8);
        bytesArray.pushInt((val & 0xFF));
        resultCallback.invoke(bytesArray);
    }

    @ReactMethod
    public void floatToBytes(double floatVal, Callback resultCallback) {
        int val = Float.floatToIntBits((float)floatVal);

        WritableNativeArray bytesArray = new WritableNativeArray();
        bytesArray.pushInt((val & 0xFF000000) >> 24);
        bytesArray.pushInt((val & 0xFF0000) >> 16);
        bytesArray.pushInt((val & 0xFF00) >> 8);
        bytesArray.pushInt((val & 0xFF));
        resultCallback.invoke(bytesArray);
    }

    @ReactMethod
    public void bytesToInt(double b1, double b2, double b3, double b4, Callback resultCallback) {
        int res = 0;
        res |= ((int)b1 << 24);
        res |= ((int)b2 << 16);
        res |= ((int)b3 << 8);
        res |= (int)b4;
        resultCallback.invoke(res);
    }

    @ReactMethod
    public void bytesToShort(double b1, double b2, Callback resultCallback) {
        short res = 0;
        res |= ((int)b1 << 8);
        res |= (int)b2;
        resultCallback.invoke((int)res);
    }

    @ReactMethod
    public void bytesToFloat(double b1, double b2, double b3, double b4, Callback resultCallback) {
        int res = 0;
        res |= ((int)b1 << 24);
        res |= ((int)b2 << 16);
        res |= ((int)b3 << 8);
        res |= (int)b4;
        resultCallback.invoke(Float.intBitsToFloat(res));
    }
}
