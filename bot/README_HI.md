# KDN Telegram Bot — Cloudflare Worker (मुफ़्त)

यह bot Telegram से आए button (✅ हाँ / ✏️ बदलो / ❌ नहीं) संभालता है और "हाँ" पर text **Khalsa konnect** group में डालता है। सिर्फ़ मालिक (ID 7812291108) ही इसे चला सकता है। Box पर long polling वाले `bot.py` की जगह यह 24×7 मुफ़्त चलता है।

> ⚠️ Webhook लगाने से पहले box वाला `bot.py` बंद करें — Telegram में webhook और polling एक साथ नहीं चलते।

## 1. Cloudflare account (मुफ़्त)
1. फ़ोन में https://dash.cloudflare.com/sign-up खोलें, email + password से account बनाएँ, email verify करें।
2. Free plan ही काफ़ी है (रोज़ 1 लाख requests मुफ़्त)।

## 2. Wrangler चलाना (कंप्यूटर/Termux, या Grok Bot से करवाएँ)
```bash
npm install -g wrangler
wrangler login                 # browser में Allow दबाएँ
cd bot
wrangler secret put TELEGRAM_BOT_TOKEN   # BotFather वाला token paste करें (दिखेगा नहीं)
wrangler secret put WEBHOOK_SECRET       # कोई लंबा random शब्द, जैसे kdn-8f3k2...  (A-Z a-z 0-9 _ -)
wrangler deploy
```
Deploy के बाद एक URL मिलेगा, जैसे `https://kdn-telegram-bot.<आपका-नाम>.workers.dev`।

## 3. Webhook लगाएँ
नीचे TOKEN, URL और SECRET अपने वाले डालकर एक बार चलाएँ (token किसी को न दिखाएँ):
```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://kdn-telegram-bot.<आपका-नाम>.workers.dev" \
  -d "secret_token=<WEBHOOK_SECRET>" \
  -d 'allowed_updates=["message","callback_query"]'
```
जाँच: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo` में आपका URL दिखना चाहिए।

## 4. इस्तेमाल
- Bot को private chat में लिखें: `/post आज शाम 7 बजे लंगर सेवा है` → popup आएगा।
- ✅ दबाने पर group में post जाएगी; ✏️ पर नया `/post ...` भेजें; ❌ पर कुछ नहीं होगा।
- Bot group में admin होना चाहिए (या post करने की अनुमति हो)।

## वापस polling पर जाना
`https://api.telegram.org/bot<TOKEN>/deleteWebhook` खोलें, फिर box का `bot.py` चालू करें।

## 5. Creator से Telegram मंज़ूरी (`/draft`)
1. एक लंबी random app key बनाएँ और worker में डालें: `wrangler secret put APP_KEY`
2. `wrangler deploy`
3. Creator में "App key (सिर्फ़ मालिक के लिए)" खोलें, वही key paste करके "Key सेव करें" दबाएँ।
4. "Telegram पर मंज़ूरी के लिए भेजें" दबाएँ → Telegram में ✅/✏️/❌ popup आएगा। ✅ के बिना group में कुछ नहीं जाता।

सुरक्षा: key सिर्फ़ उसी फ़ोन के localStorage में रहती है; worker key को constant-time से जाँचता है, सिर्फ़ `https://guru-nanak-dev-ji.github.io` से CORS देता है, प्रति IP 5 requests/मिनट की सीमा है, post 3500 अक्षर तक।
