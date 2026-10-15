package world.khalsa.keyboard;

import android.app.Activity;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.provider.Settings;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

public class SetupActivity extends Activity {
    private static final int TEAL = 0xFFA6E1D9;
    private TextView status;
    private EditText test;
    private int dp(float n) { return Math.round(n * getResources().getDisplayMetrics().density); }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setBackgroundColor(0xFF171D27);
        FrameLayout frame = new FrameLayout(this);
        frame.setBackgroundColor(0xFF171D27);
        frame.addView(scroll, new FrameLayout.LayoutParams(-1, -1));
        if (android.os.Build.VERSION.SDK_INT >= 30) getWindow().setDecorFitsSystemWindows(false);
        // Resize the scrolling viewport explicitly: Android 15 is edge-to-edge.
        frame.setOnApplyWindowInsetsListener((v, insets) -> {
            if (android.os.Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                int ime = insets.getInsets(WindowInsets.Type.ime()).bottom;
                v.setPadding(bars.left, bars.top, bars.right, Math.max(bars.bottom, ime));
                if (ime > 0 && test != null && test.hasFocus()) test.post(() ->
                    test.requestRectangleOnScreen(new android.graphics.Rect(0, 0, test.getWidth(), test.getHeight()), false));
            }
            return insets;
        });
        LinearLayout body = new LinearLayout(this);
        body.setOrientation(LinearLayout.VERTICAL);
        body.setPadding(dp(22), dp(22), dp(22), dp(18));
        body.setFocusableInTouchMode(true);
        scroll.addView(body);
        setContentView(frame);

        text(body, "KDN  /  KEYBOARD", 12, TEAL, 0);
        TextView title = text(body, "ਆਪਣੀ ਬੋਲੀ,\nਆਪਣਾ ਕੀਬੋਰਡ।", 30, Color.WHITE, 12);
        title.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        text(body, "ਵਾਹਿਗੁਰੂ  ·  ਪੰਜਾਬੀ + English", 15, TEAL, 10);
        text(body, "आपके पुराने layout से प्रेरित नया, स्वतंत्र keyboard। Android 7 और आगे के लिए।", 15, 0xFFC5CBD5, 14);

        status = text(body, "", 13, TEAL, 18);
        button(body, "1  ·  Keyboard चालू करें", "Enable keyboard", () ->
            startActivity(new Intent(Settings.ACTION_INPUT_METHOD_SETTINGS)));
        button(body, "2  ·  KDN Keyboard चुनें", "Choose KDN keyboard", () ->
            ((InputMethodManager)getSystemService(INPUT_METHOD_SERVICE)).showInputMethodPicker());

        text(body, "3  ·  यहाँ लिखकर देखें", 16, Color.WHITE, 20);
        test = new EditText(this);
        test.setId(View.generateViewId());
        test.setContentDescription("Typing test");
        test.setHint("ਪੰਜਾਬੀ · ਵਾਹਿਗੁਰੂ");
        test.setTextSize(21);
        test.setTextColor(Color.WHITE);
        test.setHintTextColor(0xFF929DAF);
        test.setGravity(Gravity.TOP | Gravity.START);
        test.setMinLines(2); test.setMaxLines(4);
        test.setPadding(dp(14), dp(12), dp(14), dp(12));
        test.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_MULTI_LINE | InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS);
        test.setImeOptions(EditorInfo.IME_ACTION_NONE | EditorInfo.IME_FLAG_NO_ENTER_ACTION);
        test.setSaveEnabled(false);
        if (android.os.Build.VERSION.SDK_INT >= 26) test.setImportantForAutofill(View.IMPORTANT_FOR_AUTOFILL_NO);
        GradientDrawable field = new GradientDrawable();
        field.setColor(0xFF252E3D); field.setCornerRadius(dp(16)); field.setStroke(dp(1), 0xFF4E6469);
        test.setBackground(field);
        LinearLayout.LayoutParams fieldParams = new LinearLayout.LayoutParams(-1, -2);
        fieldParams.topMargin = dp(10); body.addView(test, fieldParams);

        LinearLayout modes = new LinearLayout(this);
        body.addView(modes);
        mode(modes, "ਪੰਜਾਬੀ", "Text mode", InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_FLAG_MULTI_LINE, EditorInfo.IME_ACTION_NONE | EditorInfo.IME_FLAG_NO_ENTER_ACTION);
        mode(modes, "Email", "Email mode", InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS, EditorInfo.IME_ACTION_NEXT);
        mode(modes, "123", "Number mode", InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL, EditorInfo.IME_ACTION_DONE);

        text(body, "ਛੋਹੋ ਤੇ ਲਿਖੋ", 18, TEAL, 22);
        text(body, "⇧ Shift या अक्षर को दबाकर रखें → दूसरा अक्षर\nਅ ਆ → स्वर, मात्राएँ और बाकी अक्षर\nEN → English  ·  123 → अंक और चिन्ह\n⌨ → दूसरा keyboard चुनें", 14, 0xFFC5CBD5, 8);
        text(body, "Offline · टाइप किया पाठ सेव नहीं होता\nInternet, contacts और microphone की permission नहीं। Android सभी keyboards को सामान्य चेतावनी दिखाता है।", 13, 0xFF9BA8B9, 18);
        text(body, "v0.1 · अभी tap typing; swipe शब्द और autocorrect नहीं। Honso / Multiling O से संबद्ध नहीं।", 12, 0xFF9BA8B9, 16);
        body.requestFocus();
    }

    private TextView text(LinearLayout parent, String value, int size, int color, int top) {
        TextView text = new TextView(this); text.setText(value); text.setTextSize(size); text.setTextColor(color);
        text.setLineSpacing(dp(3), 1);
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(-1, -2); p.topMargin = dp(top);
        parent.addView(text, p); return text;
    }
    private void button(LinearLayout parent, String value, String desc, Runnable action) {
        Button button = new Button(this); button.setText(value); button.setAllCaps(false);
        button.setTextColor(0xFF142B2C); button.setTextSize(15);
        button.setBackgroundTintList(ColorStateList.valueOf(TEAL)); button.setContentDescription(desc);
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(-1, dp(54)); p.topMargin = dp(7);
        parent.addView(button, p); button.setOnClickListener(v -> action.run());
    }
    private void mode(LinearLayout row, String label, String desc, int type, int options) {
        Button b = new Button(this); b.setText(label); b.setAllCaps(false); b.setTextSize(12);
        b.setTextColor(TEAL); b.setBackgroundTintList(ColorStateList.valueOf(0xFF303B4D));
        b.setContentDescription(desc); row.addView(b, new LinearLayout.LayoutParams(0, dp(48), 1));
        b.setOnClickListener(v -> {
            test.setInputType(type); test.setImeOptions(options); test.setSelection(test.length()); test.requestFocus();
            InputMethodManager imm = (InputMethodManager)getSystemService(INPUT_METHOD_SERVICE);
            imm.restartInput(test); imm.showSoftInput(test, InputMethodManager.SHOW_IMPLICIT);
        });
    }
    @Override protected void onResume() {
        super.onResume();
        InputMethodManager imm = (InputMethodManager)getSystemService(INPUT_METHOD_SERVICE);
        boolean enabled = false;
        for (InputMethodInfo info : imm.getEnabledInputMethodList()) if (info.getPackageName().equals(getPackageName())) enabled = true;
        String selected = Settings.Secure.getString(getContentResolver(), Settings.Secure.DEFAULT_INPUT_METHOD);
        status.setText(selected != null && selected.startsWith(getPackageName() + "/") ? "●  KDN Keyboard चुना हुआ है" : enabled ? "●  चालू है — अब KDN चुनें" : "○  शुरू करने के लिए ये दो कदम");
    }
}
