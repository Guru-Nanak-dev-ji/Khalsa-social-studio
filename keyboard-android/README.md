# KDN ਪੰਜਾਬੀ Keyboard — Android prototype 0.1

An independent, offline Android input method inspired by the main key positions in the user's Honso / Multiling O Punjabi screenshot. This is a real `InputMethodService`, usable in other Android apps. It does not depend on the discontinued installation on the user's phone, and does not contain Honso code, dictionary, images or branding.

## Install on a phone

Requires **Android 7.0 or later**. Download `KDN-Punjabi-Keyboard-0.1.apk` from the draft PR's **KDN Punjabi Keyboard APK** workflow artifact. This is a signed **debug prototype**, not a Play Store release. Future builds may need a stable signing key for in-place updates; no signing keys are committed.

1. Open the APK. If Android asks, permit this installation from the app used to open it.
2. Open **KDN ਪੰਜਾਬੀ Keyboard** → **Keyboard चालू करें** → enable KDN.
3. Return → **KDN Keyboard चुनें** → select KDN → type in the test field or another app.

Android displays its standard warning for all third-party keyboards. This app requests **no permissions**, including no Internet permission. The service is protected by Android's `BIND_INPUT_METHOD` permission. It writes no typed text, analytics, dictionary or clipboard data. The setup test field is not saved. The host app you type into still receives your text as usual.

Switch back at any time with **⌨**, or long-press the space bar. Uninstalling this prototype does not delete the old keyboard or project data.

## Main layout

| Row | Keys, left to right |
|---|---|
| Numbers | ੧ ੨ ੩ ੪ ੫ ੬ ੭ ੮ ੯ ੦ ੰ |
| Upper | ੳ ਅ ੇ ਰ ਤ ਯ ੁ ਿ ੋ ਪ ੂ |
| Middle | ਾ ਸ ਦ ੍ ਗ ਹ ਜ ਕ ਲ |
| Lower | Shift · ਡ ੜ ਚ ਵ ਬ ਨ ਮ · Delete |
| Bottom | Keyboard picker · comma · space · period · Enter |

Some glyphs in the source screenshot are ambiguous. The main positions are transcribed from it; this is **not a verified byte-for-byte copy of the legacy plugin layout**. Shift/long-press alternatives are newly specified in `KeyboardLayout.java`. A secondary glyph is shown above each normal Punjabi key. Shift affects one subsequent character. **ਅ ਆ** opens all standalone vowels, vowel signs and additional letters; **EN / ਪੰ** switches language; **123** opens ASCII numbers and punctuation. Password, email, URL and numeric fields start with ASCII-compatible layouts.

Type the consonant **before** its vowel sign, including `ਿ`: Android renders the sign on the correct side. For `ਪੰਜਾਬੀ`: ਪ → ੰ → ਜ → ਾ → ਬ → Shift → ੀ. For `ਵਾਹਿਗੁਰੂ`: ਵ → ਾ → ਹ → ਿ → ਗ → ੁ → ਰ → ੂ. Carrier + vowel sign pairs (`ੳੁ`, `ੳੂ`, `ੳੋ`, `ਅਾ`, `ਅੈ`, `ਅੌ`, `ੲਿ`, `ੲੀ`, `ੲੇ`) become the corresponding independent vowel.

Delete removes a selected range, otherwise one Unicode code point (a vowel sign can be removed separately). Holding Delete repeats. Enter respects Next/Search/Done/Send when provided by the host app; multiline text receives a newline. Landscape uses shorter rows and does not take over the screen with a fullscreen editor.

## Deliberate first-version limits

- Tap and long-press typing only. **No swipe-to-word, predictions, autocorrect or custom dictionary.** The animated swipe trail in the reference is not implemented.
- No permanent learning, settings or typed-text history.
- Native Gurmukhi fonts are supplied by Android; exact glyph appearance depends on the phone.
- Android emulator checks do not replace installation and typing tests on the user's physical phones. iPhones are not supported by this APK.

## Build and verify

JDK 17, Gradle 8.9, Android SDK 35 / Build Tools 35.0.0. From this directory:

```bash
gradle :app:assembleDebug :app:assembleDebugAndroidTest :app:lintDebug
mkdir -p build/core-tests
javac -encoding UTF-8 -d build/core-tests app/src/main/java/world/khalsa/keyboard/KeyboardLayout.java tests/LayoutTest.java
java -cp build/core-tests LayoutTest
bash scripts/emulator-test.sh  # with a running Android emulator
```

CI builds the real APK, runs layout/Unicode checks, then installs it on an Android 15 emulator and types through the actual system IME. It checks Punjabi words, vowel composition, long-press, Shift, English, selected-text replacement, mid-string emoji deletion, multiline Enter, email and number EditorInfo behavior. The QA artifact includes actual device screenshots and instrumentation output. The instrumentation APK is a separate test artifact and must not be installed on the user's phone.

This isolated project and its draft PR do not modify the existing `android/` app, website, stories, old doors, DNS or production deployment.

References: [Android IME guide](https://developer.android.com/develop/ui/views/touch-and-input/creating-input-method), [Honso's Punjabi plugin listing](https://play.google.com/store/apps/details?id=klye.plugin.pa). Reference images are not bundled.
