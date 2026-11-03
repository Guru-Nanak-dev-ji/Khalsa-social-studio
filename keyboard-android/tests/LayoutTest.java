import world.khalsa.keyboard.KeyboardLayout;
import java.util.HashSet;
import java.util.Set;

public class LayoutTest {
    static int checks;
    static void equal(Object expected, Object actual) {
        checks++;
        if (!java.util.Objects.equals(expected, actual)) throw new AssertionError(expected + " != " + actual);
    }
    public static void main(String[] args) {
        Set<String> accessible = new HashSet<>();
        for (String[][] page : new String[][][]{KeyboardLayout.PUNJABI, KeyboardLayout.SHIFTED, KeyboardLayout.VOWELS})
            for (String[] row : page) for (String key : row) {
                if (key.isBlank() || key.contains("◌")) throw new AssertionError("Invalid committed key");
                accessible.add(key);
            }
        // Every ordinary Gurmukhi consonant, vowel and productive combining mark has a key.
        String required = "ਅਆਇਈਉਊਏਐਓਔਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵੜਸ਼ਖ਼ਗ਼ਜ਼ਫ਼ਲ਼ਾਿੀੁੂੇੈੋੌ਼੍ੰਂੱ";
        required.codePoints().forEach(c -> equal(true, accessible.contains(new String(Character.toChars(c)))));
        equal("ੳਅੇਰਤਯੁਿੋਪੂ", String.join("", KeyboardLayout.PUNJABI[1]));
        equal("ਾਸਦ੍ਗਹਜਕਲ", String.join("", KeyboardLayout.PUNJABI[2]));
        equal("ਡੜਚਵਬਨਮ", String.join("", KeyboardLayout.PUNJABI[3]));
        for (int r=0;r<4;r++) equal(KeyboardLayout.PUNJABI[r].length, KeyboardLayout.SHIFTED[r].length);
        String[][] combinations = {{"ਅ","ਾ","ਆ"},{"ਅ","ੈ","ਐ"},{"ਅ","ੌ","ਔ"},
            {"ੳ","ੁ","ਉ"},{"ੳ","ੂ","ਊ"},{"ੳ","ੋ","ਓ"},
            {"ੲ","ਿ","ਇ"},{"ੲ","ੀ","ਈ"},{"ੲ","ੇ","ਏ"}};
        for (String[] combination : combinations) {
            equal(combination[2], KeyboardLayout.vowelReplacement("before " + combination[0], combination[1]));
        }
        equal(null, KeyboardLayout.vowelReplacement("ਪ", "ਿ"));
        equal(null, KeyboardLayout.vowelReplacement("😀", "ਿ"));
        equal(null, KeyboardLayout.vowelReplacement(null, "ਾ"));
        equal("◌ਿ", KeyboardLayout.visible("ਿ"));
        equal("ਪ", KeyboardLayout.visible("ਪ"));
        equal("ਪੰਜਾਬੀ", String.join("", "ਪ", "ੰ", "ਜ", "ਾ", "ਬ", "ੀ"));
        equal("ਵਾਹਿਗੁਰੂ", String.join("", "ਵ", "ਾ", "ਹ", "ਿ", "ਗ", "ੁ", "ਰ", "ੂ"));
        System.out.println("PASS: " + checks + " layout and Unicode checks");
    }
}
