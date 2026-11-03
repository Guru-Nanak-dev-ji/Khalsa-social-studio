package world.khalsa.keyboard;

/** Independently authored Unicode layout; no Honso code or dictionary is included. */
public final class KeyboardLayout {
    private KeyboardLayout() {}
    public static final String[][] PUNJABI = {
        {"੧", "੨", "੩", "੪", "੫", "੬", "੭", "੮", "੯", "੦", "ੰ"},
        {"ੳ", "ਅ", "ੇ", "ਰ", "ਤ", "ਯ", "ੁ", "ਿ", "ੋ", "ਪ", "ੂ"},
        {"ਾ", "ਸ", "ਦ", "੍", "ਗ", "ਹ", "ਜ", "ਕ", "ਲ"},
        {"ਡ", "ੜ", "ਚ", "ਵ", "ਬ", "ਨ", "ਮ"}
    };
    // Shift and long-press share these alternatives. Main positions follow the supplied reference.
    public static final String[][] SHIFTED = {
        {"ਆ", "ਐ", "ਢ", "ਠ", "ਊ", "ਈ", "ਇ", "ਔ", "।", "॥", "ੱ"},
        {"ੲ", "ਆ", "ੈ", "ੜ", "ਥ", "ਟ", "ੂ", "ੀ", "ੌ", "ਫ", "ੰ"},
        {"ਓ", "ਸ਼", "ਧ", "਼", "ਘ", "ਙ", "ਝ", "ਖ", "ਲ਼"},
        {"ਢ", "ਠ", "ਛ", "ਞ", "ਭ", "ਣ", "ਂ"}
    };
    public static final String[][] ENGLISH = {
        {"1", "2", "3", "4", "5", "6", "7", "8", "9", "0"},
        {"q", "w", "e", "r", "t", "y", "u", "i", "o", "p"},
        {"a", "s", "d", "f", "g", "h", "j", "k", "l"},
        {"z", "x", "c", "v", "b", "n", "m"}
    };
    public static final String[][] SYMBOLS = {
        {"1", "2", "3", "4", "5", "6", "7", "8", "9", "0"},
        {"@", "#", "₹", "%", "&", "*", "-", "+", "(", ")"},
        {"!", "\"", "'", ":", ";", "/", "?", "=", "_"},
        {"[", "]", "{", "}", "<", ">", "\\"}
    };
    public static final String[][] VOWELS = {
        {"ਅ", "ਆ", "ਇ", "ਈ", "ਉ", "ਊ", "ਏ", "ਐ", "ਓ", "ਔ"},
        {"ਾ", "ਿ", "ੀ", "ੁ", "ੂ", "ੇ", "ੈ", "ੋ", "ੌ", "੍"},
        {"ੰ", "ਂ", "ੱ", "਼", "ੳ", "ੲ", "ੴ", "।", "॥"},
        {"ਸ਼", "ਖ਼", "ਗ਼", "ਜ਼", "ਫ਼", "ਲ਼", "ਞ"}
    };

    public static String visible(String value) {
        int kind = Character.getType(value.codePointAt(0));
        return kind == Character.NON_SPACING_MARK || kind == Character.COMBINING_SPACING_MARK
            ? "◌" + value : value;
    }

    /** Compose a carrier plus vowel sign, without rewriting surrounding words. */
    public static String vowelReplacement(String before, String typed) {
        if (before == null || before.isEmpty()) return null;
        String last = before.substring(before.offsetByCodePoints(before.length(), -1));
        return switch (last + typed) {
            case "ਅਾ" -> "ਆ";
            case "ਅੈ" -> "ਐ";
            case "ਅੌ" -> "ਔ";
            case "ੳੁ" -> "ਉ";
            case "ੳੂ" -> "ਊ";
            case "ੳੋ" -> "ਓ";
            case "ੲਿ" -> "ਇ";
            case "ੲੀ" -> "ਈ";
            case "ੲੇ" -> "ਏ";
            default -> null;
        };
    }
}
