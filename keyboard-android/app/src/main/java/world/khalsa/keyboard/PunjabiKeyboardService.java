package world.khalsa.keyboard;

import android.content.res.ColorStateList;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.RippleDrawable;
import android.inputmethodservice.InputMethodService;
import android.os.Handler;
import android.os.Looper;
import android.text.InputType;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputConnection;
import android.view.inputmethod.InputMethodManager;
import android.widget.LinearLayout;
import android.widget.TextView;
import java.util.Locale;

/** Offline system IME. Text is sent only to Android's active editor. */
public class PunjabiKeyboardService extends InputMethodService {
    private static final int BG = Color.rgb(62, 68, 78);
    private static final int ACCENT = Color.rgb(166, 225, 217);
    private LinearLayout keyboard;
    private boolean punjabi = true, shifted, symbols, vowels;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private boolean repeating;
    private boolean repeated;
    private final Runnable deleteRepeat = new Runnable() {
        @Override public void run() {
            if (!repeating) return;
            repeated = true;
            deleteOne();
            handler.postDelayed(this, 65);
        }
    };

    @Override public View onCreateInputView() {
        keyboard = new LinearLayout(this);
        keyboard.setOrientation(LinearLayout.VERTICAL);
        keyboard.setLayoutDirection(View.LAYOUT_DIRECTION_LTR);
        keyboard.setBackgroundColor(BG);
        keyboard.setPadding(dp(3), 0, dp(3), dp(4));
        if (android.os.Build.VERSION.SDK_INT >= 26)
            keyboard.setImportantForAutofill(View.IMPORTANT_FOR_AUTOFILL_NO_EXCLUDE_DESCENDANTS);
        render();
        return keyboard;
    }

    @Override public boolean onEvaluateFullscreenMode() { return false; }

    @Override public void onStartInputView(EditorInfo info, boolean restarting) {
        super.onStartInputView(info, restarting);
        stopRepeat();
        shifted = false;
        vowels = false;
        int cls = info.inputType & InputType.TYPE_MASK_CLASS;
        int variation = info.inputType & InputType.TYPE_MASK_VARIATION;
        symbols = cls == InputType.TYPE_CLASS_NUMBER || cls == InputType.TYPE_CLASS_PHONE
            || cls == InputType.TYPE_CLASS_DATETIME;
        boolean latin = symbols || (info.imeOptions & EditorInfo.IME_FLAG_FORCE_ASCII) != 0
            || (cls == InputType.TYPE_CLASS_TEXT && (
                variation == InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS
                || variation == InputType.TYPE_TEXT_VARIATION_WEB_EMAIL_ADDRESS
                || variation == InputType.TYPE_TEXT_VARIATION_URI
                || variation == InputType.TYPE_TEXT_VARIATION_PASSWORD
                || variation == InputType.TYPE_TEXT_VARIATION_WEB_PASSWORD
                || variation == InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD));
        if (latin) punjabi = false;
        render();
    }

    @Override public void onFinishInputView(boolean finishingInput) {
        stopRepeat();
        super.onFinishInputView(finishingInput);
    }
    @Override public void onDestroy() { stopRepeat(); super.onDestroy(); }

    private int dp(float value) { return Math.round(value * getResources().getDisplayMetrics().density); }
    private int rowHeight() {
        return getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE ? 39 : 52;
    }

    private RippleDrawable keyBackground(boolean selected) {
        GradientDrawable base = new GradientDrawable();
        base.setColor(selected ? Color.rgb(79, 101, 107) : Color.TRANSPARENT);
        base.setCornerRadius(dp(12));
        return new RippleDrawable(ColorStateList.valueOf(0x66A6E1D9), base, null);
    }

    private TextView key(String label, String description, float weight, LinearLayout row, Runnable action) {
        TextView view = new TextView(this);
        view.setText(label);
        view.setTextColor(Color.WHITE);
        view.setTextSize(24);
        view.setGravity(Gravity.CENTER);
        view.setIncludeFontPadding(true);
        view.setContentDescription(description);
        view.setFocusable(true);
        view.setClickable(true);
        view.setBackground(keyBackground(false));
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, weight);
        lp.setMargins(dp(1), dp(1), dp(1), dp(1));
        row.addView(view, lp);
        view.setOnClickListener(v -> action.run());
        return view;
    }

    private LinearLayout row(int height) {
        LinearLayout row = new LinearLayout(this);
        row.setGravity(Gravity.CENTER);
        keyboard.addView(row, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(height)));
        return row;
    }

    private void render() {
        if (keyboard == null) return;
        stopRepeat();
        keyboard.removeAllViews();
        LinearLayout toolbar = row(40);
        toolbar.setBackgroundColor(Color.rgb(48, 54, 63));
        TextView brand = key("KDN · " + (punjabi ? "ਪੰਜਾਬੀ" : "English"), "Keyboard language", 2.0f, toolbar, () -> {});
        brand.setTextSize(14); brand.setTextColor(ACCENT); brand.setClickable(false); brand.setFocusable(false);
        TextView extras = key(vowels ? "ABC" : "ਅ ਆ", "Vowels and extra letters", 1, toolbar, () -> {
            vowels = !vowels; symbols = false; shifted = false; punjabi = true; render();
        });
        extras.setTextSize(17);
        TextView lang = key(punjabi ? "EN" : "ਪੰ", "Switch language", 0.8f, toolbar, () -> {
            punjabi = !punjabi; symbols = false; vowels = false; shifted = false; render();
        });
        lang.setTextSize(16);
        TextView nums = key(symbols ? "ABC" : "123", "Numbers and symbols", 0.8f, toolbar, () -> {
            symbols = !symbols; vowels = false; shifted = false; render();
        });
        nums.setTextSize(16);

        String[][] layout = symbols ? KeyboardLayout.SYMBOLS : vowels ? KeyboardLayout.VOWELS
            : punjabi ? (shifted ? KeyboardLayout.SHIFTED : KeyboardLayout.PUNJABI) : KeyboardLayout.ENGLISH;
        for (int r = 0; r < layout.length; r++) {
            LinearLayout row = row(rowHeight());
            if (r == 2) row.setPadding(dp(13), 0, dp(13), 0);
            if (r == 3) {
                TextView shift = key("⇧", "Shift", 1.15f, row, () -> { shifted = !shifted; render(); });
                shift.setTextColor(shifted ? ACCENT : Color.WHITE);
                shift.setBackground(keyBackground(shifted));
                shift.setEnabled(!symbols && !vowels);
                shift.setAlpha(shift.isEnabled() ? 1 : 0.35f);
            }
            for (int c = 0; c < layout[r].length; c++) {
                String raw = layout[r][c];
                String output = !punjabi && !symbols && shifted ? raw.toUpperCase(Locale.ROOT) : raw;
                String alt = punjabi && !symbols && !vowels && !shifted ? KeyboardLayout.SHIFTED[r][c] : null;
                TextView letter = key(KeyboardLayout.visible(output), "key:" + output, 1, row, () -> type(output));
                if (r == 0) letter.setTextSize(22);
                if (alt != null) {
                    // Small secondary glyph, like the reference; commits only the actual Unicode value.
                    android.text.SpannableString caption = new android.text.SpannableString(KeyboardLayout.visible(alt) + "\n" + KeyboardLayout.visible(output));
                    int end = caption.toString().indexOf('\n');
                    caption.setSpan(new android.text.style.AbsoluteSizeSpan(10, true), 0, end, 0);
                    caption.setSpan(new android.text.style.ForegroundColorSpan(0xFFAAB2BD), 0, end, 0);
                    if (getResources().getConfiguration().orientation != Configuration.ORIENTATION_LANDSCAPE) {
                        letter.setText(caption);
                        letter.setLineSpacing(dp(-3), 1);
                    }
                    letter.setOnLongClickListener(v -> { type(alt); return true; });
                }
            }
            if (r == 3) {
                TextView delete = key("⌫", "Delete", 1.15f, row, this::deleteOne);
                delete.setOnTouchListener((v, event) -> {
                    switch (event.getActionMasked()) {
                        case MotionEvent.ACTION_DOWN:
                            repeating = true; repeated = false; v.setPressed(true);
                            handler.postDelayed(deleteRepeat, 360); return true;
                        case MotionEvent.ACTION_UP:
                            boolean didRepeat = repeated;
                            stopRepeat(); v.setPressed(false);
                            if (!didRepeat) v.performClick();
                            return true;
                        case MotionEvent.ACTION_CANCEL:
                            stopRepeat(); v.setPressed(false); return true;
                        case MotionEvent.ACTION_MOVE:
                            if (event.getX() < 0 || event.getX() > v.getWidth()
                                    || event.getY() < 0 || event.getY() > v.getHeight()) {
                                stopRepeat(); repeated = true; v.setPressed(false);
                            }
                            return true;
                        default: return true;
                    }
                });
            }
        }

        LinearLayout bottom = row(rowHeight());
        TextView picker = key("⌨", "Choose keyboard", 1.05f, bottom, () ->
            ((InputMethodManager)getSystemService(INPUT_METHOD_SERVICE)).showInputMethodPicker());
        picker.setTextColor(ACCENT);
        key(",", "key:,", 0.8f, bottom, () -> type(","));
        TextView space = key(punjabi ? "ਪੰਜਾਬੀ" : "English", "Space", 4.1f, bottom, () -> type(" "));
        space.setTextSize(17);
        space.setTypeface(Typeface.DEFAULT, Typeface.NORMAL);
        GradientDrawable pill = new GradientDrawable();
        pill.setColor(0xFF4B525E); pill.setCornerRadius(dp(24));
        space.setBackground(new RippleDrawable(ColorStateList.valueOf(0x66A6E1D9), pill, null));
        space.setOnLongClickListener(v -> {
            ((InputMethodManager)getSystemService(INPUT_METHOD_SERVICE)).showInputMethodPicker(); return true;
        });
        key(".", "key:.", 0.8f, bottom, () -> type("."));
        TextView enter = key(enterLabel(), "Enter", 1.2f, bottom, this::enter);
        enter.setTextSize(19); enter.setTextColor(ACCENT);
    }

    private void stopRepeat() { repeating = false; handler.removeCallbacks(deleteRepeat); }

    private void type(String value) {
        InputConnection ic = getCurrentInputConnection();
        if (ic == null) return;
        CharSequence selection = ic.getSelectedText(0);
        CharSequence before = selection == null || selection.length() == 0 ? ic.getTextBeforeCursor(2, 0) : null;
        String composed = KeyboardLayout.vowelReplacement(before == null ? null : before.toString(), value);
        ic.beginBatchEdit();
        try {
            if (composed != null && ic.deleteSurroundingTextInCodePoints(1, 0)) {
                ic.commitText(composed, 1);
            } else {
                ic.commitText(value, 1);
            }
        } finally { ic.endBatchEdit(); }
        if (shifted) { shifted = false; render(); }
    }

    private void deleteOne() {
        InputConnection ic = getCurrentInputConnection();
        if (ic == null) return;
        CharSequence selection = ic.getSelectedText(0);
        if (selection != null && selection.length() > 0) { ic.commitText("", 1); return; }
        if (!ic.deleteSurroundingTextInCodePoints(1, 0)) {
            ic.sendKeyEvent(new KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_DEL));
            ic.sendKeyEvent(new KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_DEL));
        }
    }

    private int action() {
        EditorInfo info = getCurrentInputEditorInfo();
        if (info == null || (info.imeOptions & EditorInfo.IME_FLAG_NO_ENTER_ACTION) != 0) return EditorInfo.IME_ACTION_NONE;
        return info.imeOptions & EditorInfo.IME_MASK_ACTION;
    }
    private String enterLabel() {
        return switch (action()) {
            case EditorInfo.IME_ACTION_GO -> "Go";
            case EditorInfo.IME_ACTION_SEARCH -> "⌕";
            case EditorInfo.IME_ACTION_SEND -> "Send";
            case EditorInfo.IME_ACTION_NEXT -> "Next";
            case EditorInfo.IME_ACTION_DONE -> "✓";
            case EditorInfo.IME_ACTION_PREVIOUS -> "Prev";
            default -> "↵";
        };
    }
    private void enter() {
        InputConnection ic = getCurrentInputConnection();
        if (ic == null) return;
        int action = action();
        if (action != EditorInfo.IME_ACTION_NONE && action != EditorInfo.IME_ACTION_UNSPECIFIED
                && ic.performEditorAction(action)) return;
        ic.commitText("\n", 1);
    }
}
