package world.khalsa.socialstudio;

import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import android.net.Uri;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

public class MainActivity extends Activity {
    private static final int GOLD = Color.rgb(239, 198, 110);
    private static final int BG = Color.rgb(18, 15, 12);
    private static final String REPO = "https://github.com/Guru-Nanak-dev-ji/Khalsa-social-studio";

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(BG);
        getWindow().setNavigationBarColor(BG);
        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setBackgroundColor(BG);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(dp(22), dp(30), dp(22), dp(28));
        scroll.addView(root);
        addText(root, "✦ KHALSA DIGITAL WORLD ✦", 14, GOLD, false);
        addText(root, "KDN Social Studio 🌍", 29, GOLD, true);
        addText(root, "ज्ञान • सेवा • सहयोग • तकनीक", 17, Color.WHITE, false);
        addText(root, "Android Control Room · v0.1", 15, 0xFFB9A98E, false);
        addSection(root, "📌 Work Queue", "GitHub Issues में वास्तविक कार्य और प्रगति देखें।", "Open Issues", REPO + "/issues");
        addSection(root, "⚙️ Build Status", "Android APK और अन्य automated tests देखें।", "Open Actions", REPO + "/actions");
        addSection(root, "🌐 Public Studio", "सार्वजनिक वेबसाइट खोलें।", "Open Website", "https://guru-nanak-dev-ji.github.io/Khalsa-social-studio/");
        addSection(root, "🔔 Notifications", "अभी सक्रिय नहीं। सुरक्षित backend और अनुमति मिलने पर जोड़ी जाएँगी।", null, null);
        addSection(root, "🔗 Social Accounts", "0 verified connected. किसी भी platform पर पोस्ट करने से पहले आधिकारिक authorization जरूरी है।", null, null);
        addText(root, "Open-source prototype • No login • No embedded secrets", 12, 0xFFB9A98E, false);
        setContentView(scroll);
    }

    private void addSection(LinearLayout root, String title, String description, String action, String url) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(18), dp(16), dp(18), dp(16));
        GradientDrawable shape = new GradientDrawable();
        shape.setColor(0xFF211A15);
        shape.setCornerRadius(dp(16));
        shape.setStroke(dp(1), 0xFF86602E);
        card.setBackground(shape);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(-1, -2);
        params.topMargin = dp(18);
        root.addView(card, params);
        addText(card, title, 20, GOLD, true);
        addText(card, description, 15, Color.WHITE, false);
        if (action != null) {
            Button button = new Button(this);
            button.setText(action);
            button.setAllCaps(false);
            button.setTextColor(0xFF25190C);
            button.setBackgroundTintList(android.content.res.ColorStateList.valueOf(GOLD));
            button.setOnClickListener(v -> {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                startActivity(intent);
            });
            card.addView(button);
        }
    }

    private void addText(LinearLayout root, String value, int size, int color, boolean bold) {
        TextView text = new TextView(this);
        text.setText(value);
        text.setTextSize(size);
        text.setTextColor(color);
        if (bold) text.setTypeface(null, Typeface.BOLD);
        text.setGravity(Gravity.START);
        text.setPadding(0, dp(5), 0, dp(5));
        root.addView(text);
    }

    private int dp(int n) { return (int)(n * getResources().getDisplayMetrics().density + 0.5f); }
}
