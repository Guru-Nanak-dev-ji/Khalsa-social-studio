package world.khalsa.keyboard;

import android.app.Instrumentation;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Rect;
import android.os.Bundle;
import android.os.SystemClock;
import android.view.MotionEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.view.accessibility.AccessibilityWindowInfo;
import java.io.File;
import java.io.FileOutputStream;

/** Runs against the real Android editor + installed IME, without external test dependencies. */
public class KeyboardSmokeTest extends Instrumentation {
    private int checks;
    private android.widget.EditText editor;
    @Override public void onCreate(Bundle args) { super.onCreate(args); start(); }
    @Override public void onStart() {
        Bundle result = new Bundle();
        try {
            AccessibilityServiceInfo info = getUiAutomation().getServiceInfo();
            info.flags |= AccessibilityServiceInfo.FLAG_RETRIEVE_INTERACTIVE_WINDOWS;
            getUiAutomation().setServiceInfo(info);
            Intent intent = new Intent(getTargetContext(), SetupActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            android.app.Activity activity = startActivitySync(intent);
            runOnMainSync(() -> editor = findEditor(activity.getWindow().getDecorView()));
            if (editor == null) throw new AssertionError("Missing host editor");
            pause(700);
            tap("Typing test");
            waitFor("key:ਪ");
            keys("ਪ", "ੰ", "ਜ", "ਾ", "ਬ");
            tap("Shift"); key("ੀ");
            expect("ਪੰਜਾਬੀ");
            tap("Enter");
            keys("ਵ", "ਾ", "ਹ", "ਿ", "ਗ", "ੁ", "ਰ", "ੂ");
            expect("ਪੰਜਾਬੀ\nਵਾਹਿਗੁਰੂ");
            screenshot("keyboard-punjabi.png");
            tap("Delete"); expect("ਪੰਜਾਬੀ\nਵਾਹਿਗੁਰ");
            key("ੂ"); expect("ਪੰਜਾਬੀ\nਵਾਹਿਗੁਰੂ");

            // Cursor-aware editing and deletion must not split an emoji surrogate pair.
            replace("ਅ😀ਬ"); select(3, 3); tap("Delete"); expect("ਅਬ");
            replace("ਪੁਰਾਣਾ"); select(0, 6); key("ਨ"); expect("ਨ");
            replace(""); keys("ੳ", "ੁ"); expect("ਉ");
            tap("Space"); keys("ਅ", "ਾ"); expect("ਉ ਆ");
            replace("");
            longPress("key:ਿ"); expect("ੀ");
            tap("Delete");
            tap("Vowels and extra letters"); key("ਫ਼"); expect("ਫ਼");
            tap("Vowels and extra letters");

            replace(""); tap("Switch language"); keys("k", "d", "n");
            tap("Space"); tap("Shift"); key("A"); key("i"); expect("kdn Ai");
            screenshot("keyboard-english.png");
            tap("Numbers and symbols"); key("₹"); expect("kdn Ai₹");
            tap("Numbers and symbols");

            // Exercise real EditorInfo from different fields, not just direct service calls.
            getUiAutomation().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_BACK);
            pause(400); tap("Email mode"); waitFor("key:q");
            if (!"Next".contentEquals(waitFor("Enter").getText())) throw new AssertionError("Email action is not Next");
            replace(""); keys("a", "b"); tap("Numbers and symbols"); key("@"); expect("ab@");
            getUiAutomation().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_BACK);
            pause(400); tap("Number mode"); waitFor("key:1");
            if (!"✓".contentEquals(waitFor("Enter").getText())) throw new AssertionError("Number action is not Done");
            replace(""); keys("1", "2", ".", "3"); expect("12.3");
            getUiAutomation().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_BACK);
            pause(400); tap("Text mode"); waitFor("key:q"); tap("Switch language");
            replace(""); keys("ਪ", "ੰ", "ਜ", "ਾ", "ਬ"); tap("Shift"); key("ੀ");
            tap("Enter"); keys("ਵ", "ਾ", "ਹ", "ਿ", "ਗ", "ੁ", "ਰ", "ੂ");
            expect("ਪੰਜਾਬੀ\nਵਾਹਿਗੁਰੂ"); screenshot("keyboard-punjabi.png");
            result.putString("stream", "PASS: " + checks + " native keyboard checks\n");
            finish(-1, result);
        } catch (Throwable error) {
            try { screenshot("keyboard-failure.png"); } catch (Throwable ignored) {}
            result.putString("stream", "FAIL: " + error + "\n" + android.util.Log.getStackTraceString(error));
            finish(0, result);
        }
    }
    private void pause(long ms) { SystemClock.sleep(ms); }
    private AccessibilityNodeInfo find(AccessibilityNodeInfo node, String desc) {
        if (node == null) return null;
        if (desc.contentEquals(node.getContentDescription() == null ? "" : node.getContentDescription())) return node;
        for (int i=0; i<node.getChildCount(); i++) {
            AccessibilityNodeInfo found = find(node.getChild(i), desc);
            if (found != null) return found;
        }
        return null;
    }
    private AccessibilityNodeInfo waitFor(String desc) {
        long deadline = SystemClock.uptimeMillis() + 6000;
        do {
            for (AccessibilityWindowInfo window : getUiAutomation().getWindows()) {
                AccessibilityNodeInfo found = find(window.getRoot(), desc);
                if (found != null && found.isVisibleToUser()) return found;
            }
            pause(100);
        } while (SystemClock.uptimeMillis() < deadline);
        throw new AssertionError("Cannot find visible control: " + desc);
    }
    private void tap(String desc) {
        AccessibilityNodeInfo node = waitFor(desc);
        Rect rect = new Rect(); node.getBoundsInScreen(rect);
        long time = SystemClock.uptimeMillis();
        MotionEvent down = MotionEvent.obtain(time, time, MotionEvent.ACTION_DOWN, rect.centerX(), rect.centerY(), 0);
        down.setSource(android.view.InputDevice.SOURCE_TOUCHSCREEN);
        getUiAutomation().injectInputEvent(down, true); down.recycle();
        MotionEvent up = MotionEvent.obtain(time, time + 60, MotionEvent.ACTION_UP, rect.centerX(), rect.centerY(), 0);
        up.setSource(android.view.InputDevice.SOURCE_TOUCHSCREEN);
        getUiAutomation().injectInputEvent(up, true); up.recycle(); pause(170);
    }
    private void longPress(String desc) {
        Rect rect = new Rect(); waitFor(desc).getBoundsInScreen(rect);
        long time = SystemClock.uptimeMillis();
        MotionEvent down = MotionEvent.obtain(time, time, 0, rect.centerX(), rect.centerY(), 0);
        down.setSource(android.view.InputDevice.SOURCE_TOUCHSCREEN);
        getUiAutomation().injectInputEvent(down, true); down.recycle(); pause(800);
        MotionEvent up = MotionEvent.obtain(time, SystemClock.uptimeMillis(), 1, rect.centerX(), rect.centerY(), 0);
        up.setSource(android.view.InputDevice.SOURCE_TOUCHSCREEN);
        getUiAutomation().injectInputEvent(up, true); up.recycle(); pause(200);
    }
    private void key(String value) { tap("key:" + value); }
    private void keys(String... values) { for (String value : values) key(value); }
    private void expect(String expected) {
        checks++;
        String actual = String.valueOf(waitFor("Typing test").getText());
        if (!expected.equals(actual)) throw new AssertionError("Expected [" + expected + "] but got [" + actual + "]");
    }
    private void replace(String value) {
        // Fixture setup runs on the host's UI thread. Actual typing still uses real touches + IME.
        runOnMainSync(() -> { editor.setText(value); editor.setSelection(editor.length()); });
        pause(150);
    }
    private void select(int start, int end) {
        runOnMainSync(() -> {
            editor.setSelection(start, end);
            if (editor.getSelectionStart() != start || editor.getSelectionEnd() != end) throw new AssertionError("Selection mismatch");
        });
        pause(100);
    }
    private android.widget.EditText findEditor(android.view.View view) {
        if (view instanceof android.widget.EditText) return (android.widget.EditText)view;
        if (view instanceof android.view.ViewGroup) {
            android.view.ViewGroup group = (android.view.ViewGroup)view;
            for (int i=0; i<group.getChildCount(); i++) {
                android.widget.EditText found = findEditor(group.getChildAt(i));
                if (found != null) return found;
            }
        }
        return null;
    }
    private void screenshot(String name) throws Exception {
        Bitmap bitmap = getUiAutomation().takeScreenshot();
        try (FileOutputStream stream = new FileOutputStream(new File(getTargetContext().getFilesDir(), name))) {
            if (bitmap == null || !bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream)) throw new AssertionError("Screenshot failed");
        }
    }
}
