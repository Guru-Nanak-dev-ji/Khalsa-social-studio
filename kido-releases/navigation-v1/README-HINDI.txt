KIDO AUTONOMOUS TEAM — नारद + AI agents
Version 1.0.0 | 19 October 2026
========================================

यह Android Termux के मौजूदा KIDO-AI-COMMAND-CENTER में अलग add-on है।
Grok आवश्यक नहीं है। Node 20+ के built-in modules से चलता है; npm install
या अतिरिक्त JavaScript packages की जरूरत नहीं। पुराने dashboard और master
की files को बदलता नहीं है।

1. INSTALL
----------
KIDO-AUTONOMOUS-SETUP.cjs को फोन के Download में डाउनलोड करें। Termux में:

node "/storage/emulated/0/Download/KIDO-AUTONOMOUS-SETUP.cjs"

यह default project ढूँढता है:
  $HOME/KIDO-AI-COMMAND-CENTER
और अपना add-on रखता है:
  $HOME/KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS

Installer अपने sources का SHA256 जाँचता है। मौजूदा अलग content वाली add-on
file मिलने पर रुकता है; उसे overwrite नहीं करता। पुराने KIDO की package.json,
index.html, kido-master.js या kido-free-router.js execute/modify नहीं करता।

यदि Termux shared storage पढ़ नहीं सकता, पहले termux-setup-storage चलाएँ और
Android का storage permission दें। फिर वही node command चलाएँ।
यदि file का नाम Download में "(1)" आदि है तो Files app में उसका ठीक नाम देखें।
यदि project दूसरी जगह है:
  node "/storage/emulated/0/Download/KIDO-AUTONOMOUS-SETUP.cjs" --project "/पूरा/project/path"

केवल install, server शुरू किए बिना:
  node "KIDO-AUTONOMOUS-SETUP.cjs" --project "/पूरा/project/path" --install-only

सफल install पर नया dashboard खुलने का प्रयास होगा। सामान्य पता:
  http://127.0.0.1:8110/
8110 busy होने पर 8111–8115 में अगला खाली port लिया जाता है। Terminal में
दिखाया DASHBOARD पता सही है। पुराना KIDO dashboard अलग बना रहता है।

2. AGENTS कौन क्या करता है?
--------------------------
GANESH: उपलब्ध AI provider/model चुनने वाला deterministic router; अलग paid
AI call नहीं। प्राथमिक provider विफल हो तो दूसरे उपलब्ध provider का सीमित
fallback। एक task पर कुल अधिकतम 8 model requests।

NARAD MUNI: public sources खोजता/पढ़ता है; source URL, excerpt, प्रकार और
retrieval date जमा करता है; topic और पिछले काम का संदर्भ team को देता है।
Sources स्वयं model instructions या execute करने का अधिकार नहीं बनते।

BRAHMA: योजना और पहला मसौदा।
MAHESH: तकनीकी/व्यावहारिक implementation का प्रस्ताव।
SARASWATI: तथ्य, कमियाँ, अनिश्चितताएँ और जाँचने योग्य दावे।
ये तीन roles अलग AI requests से काम करते हैं। उपलब्ध providers होने पर
अधिकतम 3 requests साथ चलती हैं। एक ही cloud provider पर अधिकतम 2 और
Ollama पर 1 request साथ चलता है, इसलिए एक model होने पर सबका वास्तव में
एक ही क्षण में चलना जरूरी नहीं।

VISHNU: उपलब्ध specialist drafts पढ़कर संयुक्त उत्तर और सीमाएँ देता है।
यह reviewer भी वास्तविक model request है। सामान्य सफल task में 4 calls।

अतिरिक्त विशेषज्ञ:
  INDRA / इन्द्र — संसाधन, निर्भरताएँ और तालमेल
  THOR / थॉर — मजबूती, विफलताओं और परीक्षण का प्रस्ताव
  ZEUS / ज़्यूस — प्राथमिकताएँ, tradeoffs और निर्णय की समीक्षा
काम के text में इनमें से जिस विशेषज्ञ का नाम लिखेंगे वह चुना जाएगा।
बाकी स्थान सामान्य विशेषज्ञ भरते हैं। उदाहरण:
  "इन्द्र, Thor और Zeus: KIDO की reliability और अगली प्राथमिकता की समीक्षा करो।"
इससे वही तीन विशेषज्ञ साथ काम करेंगे, फिर विष्णु समीक्षा करेगा।
हर task में अधिकतम तीन specialist roles रहते हैं; नामों की संख्या से कोई
अतिरिक्त शक्तियाँ या models अपने आप नहीं बनते। ये प्रतीकात्मक कार्य-नाम हैं,
धर्म या mythology का ऐतिहासिक/तथ्यात्मक mapping नहीं।

यह team report, plan, code draft और test proposal बना सकती है। यह संस्करण
model के दिए shell commands या self-modifying code को फोन पर execute नहीं
करता। किसी proposal को वास्तविक-world validated solution घोषित नहीं किया
जाता। Memory, पिछले drafts और सुधार-सुझाव आगे की research में काम आते हैं;
यह base AI model के weights का self-training नहीं है।

3. AI CONNECTIONS
-----------------
Dashboard में Connections खोलें। जिस provider की API key आपके पास हो उसे
enable करके key डालें और model चुनें:

  OpenAI       OPENAI_API_KEY       OPENAI_MODEL
  Gemini       GEMINI_API_KEY       GEMINI_MODEL
  Anthropic    ANTHROPIC_API_KEY    ANTHROPIC_MODEL
  DeepSeek     DEEPSEEK_API_KEY     DEEPSEEK_MODEL
  Groq         GROQ_API_KEY         GROQ_MODEL
  OpenRouter   OPENROUTER_API_KEY   OPENROUTER_MODEL
  Custom API   KIDO_LLM_API_KEY     KIDO_LLM_MODEL + KIDO_LLM_ENDPOINT
  Ollama       key नहीं            OLLAMA_MODEL (वैकल्पिक)

Groq और Grok अलग providers हैं। इस add-on में Grok adapter नहीं है।
Model defaults source में हैं और dashboard से बदले जा सकते हैं।
OpenRouter तथा Custom API में model ID स्वयं देना जरूरी है।
Custom endpoint पूरा HTTPS chat-completions URL होना चाहिए।

परिचित fixed providers केवल अपने official HTTPS endpoint पर key भेजते हैं।
API credentials आपके device के secrets.json में mode 0600 पर रहते हैं।
Dashboard keys वापस नहीं लौटाता और browser localStorage में नहीं रखता।
खाली key field सहेजने से पुरानी key बनी रहती है। Provider बंद करने के लिए
उसका Enabled switch बंद करें।

पहले से उपलब्ध environment variables और केवल अनुमति प्राप्त AI key/model
values इन files से भी पढ़ी जाती हैं; shell के रूप में source नहीं होतीं:
  project/.env
  $HOME/KIDO-PRIVATE/ai.env
  KIDO-AUTO-AGENTS/.env

CONFIGURED_UNTESTED = key/model दिए हैं, उत्तर मिलने की पुष्टि नहीं।
RESPONSE_OK = इस server session में model से वास्तविक उत्तर आया।
KEY_REQUIRED / MODEL_REQUIRED / OFFLINE / ERROR अलग स्थितियाँ हैं।
किसी app में login या केवल API key मौजूद होना paid quota, permission या
successful inference का प्रमाण नहीं। Provider की API usage उसकी billing
के अनुसार लग सकती है; startup पर cloud model test request नहीं भेजी जाती।

Ollama: केवल loopback local server और पहले से डाउनलोड किया local model।
यदि ollama command installed है तो standard local server शुरू करने का प्रयास
होगा। Models download नहीं किए जाते। उपलब्ध local models में सबसे छोटा
मॉडल स्वतः चुना जाता है; चुना हुआ model OLLAMA_MODEL से बदला जा सकता है।
Cloud-backed Ollama model tags इस local adapter में शामिल नहीं हैं।

4. NARAD का automatic चक्र
-------------------------
Automatic research शुरू से enabled है। Server चलते और AI उपलब्ध होते समय
हर 24 घंटे में अधिकतम एक automatic cycle चलता है। नया install 15 seconds
बाद readiness जाँचता है। कोई AI तैयार नहीं तो inference या web research
नहीं करता; 15 minutes बाद readiness फिर देखता है।

शुरुआती विषय:
  कम लागत में स्वच्छ पानी से जुड़े व्यावहारिक प्रश्न
  समुदाय में भोजन की बर्बादी कम करना
  offline काम कर सकने वाली सुलभ शिक्षा

Dashboard के "विषय और settings" में इन्हें बदलें (1–10 विषय)। हर चक्र अगला
विषय लेता है और उसी विषय के अधिकतम दो पिछले drafts का संदर्भ जोड़ता है।
पुराने परिणाम AI drafts के रूप में पहचाने जाते हैं, सत्यापित तथ्य नहीं।
Output में छोटा समस्या-भाग, समाधान-प्रस्ताव, मापने योग्य सफलता का मानदंड,
अगला प्रयोग और एक KIDO सुधार-सुझाव माँगा जाता है।

Brave Search key के बिना: Wikipedia encyclopedia search। यह पूरे web की
search नहीं है। आपकी चुनी अधिकतम 3 public HTTPS URLs अलग से पढ़ी जाती हैं।
Brave Search key देने पर broader web search results के indexed descriptions
मिलते हैं; snippets को page पढ़कर independently verified नहीं कहा जाता।
ताज़ा news के लिए संबंधित official source URLs जोड़ना उपयोगी है।

BRAVE_SEARCH_API_KEY को local env में रखें या Narad settings में key दें।
एक research cycle की सीमा: 8 public HTTP requests (redirects समेत),
अधिकतम 6 sources, हर source का छोटा excerpt और पूरे research JSON की सीमा।
Private/localhost network addresses और credentials वाले research URLs स्वीकार
नहीं किए जाते। Published date केवल source में उपलब्ध होने पर आती है।

Queue pause से अगले queued jobs और automatic research रुकते हैं; चल रहा
model job तभी रुकता है जब उसके Cancel बटन को दबाएँ। Stop से service बंद
होती है। Network request रुकने पर provider में billing का rollback निश्चित
नहीं होता।

"अभी शोध करें" आपका manual cycle है; automatic दैनिक सीमा से अलग explicit
काम है और उसकी सामान्य AI request usage लग सकती है।
Research विफल होने को "कोई खबर नहीं" नहीं माना जाता; त्रुटि दिखाई जाती है।
Restart पर पुराने missed days के सभी jobs एक साथ नहीं चलाए जाते।
बंद हुए RUNNING tasks INTERRUPTED रहते हैं और paid work अपने आप replay
नहीं होता। बचे QUEUED tasks सामान्य क्रम में आगे चलते हैं।

5. MEMORY, NEWS और NOTION
------------------------
हर पूर्ण/अधूरे research प्रयास का record रखा जाता है।
पूर्ण reviewed output स्थानीय news journal में स्वतः आता है:
  http://127.0.0.1:8110/news
सही port dashboard वाला है। Journal इस device पर है, public internet hosting
का प्रमाण नहीं।

अपने Notion page पर automatic append के लिए Narad settings में:
  Notion integration token
  Destination page ID या notion.so/notion.site page URL
  "इस Notion page पर ... अपने आप publish करें" enabled

Token को उस page की read और insert-content permission चाहिए। स्थानीय env
में NOTION_API_KEY या NOTION_TOKEN भी पढ़ा जा सकता है। ChatGPT का Notion
plugin और Termux की direct API integration अलग connections हैं।

"सहेजा connection जाँचें" केवल bot तथा चुने page को पढ़ता है।
READ_OK = page पढ़ा जा सका, write अभी अप्रमाणित हो सकती है।
WRITE_OK / PUBLISHED = append response में नए blocks की पुष्टि हुई।
Notion publishing तभी होता है जब selected destination configured हो, task
DONE हो, final output truncate न हुआ हो और source IDs का structural check
pass हो। यह check हर factual claim की सत्यता का प्रमाण नहीं है।
Updates research drafts के रूप में label होते हैं। API page notifications
silent रखी जाती हैं; किसी व्यक्ति को message भेजने वाला feature नहीं है।
Ambiguous write failure पर UNKNOWN_NO_RETRY रहता है; duplicate बनाने वाला
automatic retry नहीं होता। चुने page की public visibility बदली नहीं जाती।

अन्य public website/CMS को update करने का destination/credential इस package
में अनुमान से नहीं भरा गया है। अभी कोई public website deploy नहीं होती।

6. COMMANDS / STATUS
-------------------
node "$HOME/KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS/main.cjs" start
node "$HOME/KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS/main.cjs" status
node "$HOME/KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS/main.cjs" stop
node "$HOME/KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS/main.cjs" ask "यहाँ काम लिखें"
node "$HOME/KIDO-AI-COMMAND-CENTER/KIDO-AUTO-AGENTS/main.cjs" export TASK_ID

Add-on के अपने files:
  config.json / secrets.json / narad.json
  state/tasks/                 task records
  state/research/              retrieved-source snapshots
  state/journal/               TXT reports और local HTML journal
  state/narad-memory.json      अगले चक्रों के लिए latest 200 research records
  state/narad-state.json       schedule और progress
  state/server.log             startup/server errors
  state/ollama.log             optional local-engine start log

Task IDs dashboard में दिखते हैं। TXT export बटन भी है।
Manual tasks अधिकतम 12,000 characters; active+queued jobs अधिकतम 20।
Task हर checkpoint पर disk में save होता है; server local interface पर bind
होता है और mutation APIs session token से सुरक्षित हैं।

Android Termux background processes को रोक सकता है। Installer फोन को
24/7 server, reboot service या permanent wake lock में नहीं बदलता। ऐसे में
start command से फिर शुरू करें। लगातार online सेवा के लिए अलग always-on
runtime/hosting का चुनाव और deployment चाहिए।

7. VALIDATION और सीमा
---------------------
Package के साथ दिए source tests native API formats, concurrency, request
limits, fallback, abort, source fetching/redirect rules, key handling, task
recovery, research scheduling, publishing state और installer preservation
जाँचते हैं। Tests injected responses और temporary directories इस्तेमाल करते हैं।
ये आपके असली cloud keys/model quota या phone installation का प्रमाण नहीं।
Authoring environment से live Wikipedia fetch DNS_FAILED रहा; इसलिए वास्तविक
Termux internet transport अभी verify होना बाकी है।
Mobile CSS और UI/API contracts static रूप से जाँचे गए; इस वातावरण में
permitted browser QA उपलब्ध न होने से rendered mobile screenshot नहीं जाँचा।

8. OFFICIAL API REFERENCES
--------------------------
OpenAI: https://developers.openai.com/api/docs/guides/text
Gemini: https://ai.google.dev/api/generate-content
Anthropic: https://platform.claude.com/docs/en/api/messages/create
DeepSeek: https://api-docs.deepseek.com/
Groq: https://console.groq.com/docs/text-chat
OpenRouter: https://openrouter.ai/docs/api_reference/overview
Ollama: https://docs.ollama.com/api/chat
Ollama models: https://docs.ollama.com/api/tags
Wikipedia: https://www.mediawiki.org/wiki/API:Search
Brave: https://api-dashboard.search.brave.com/app/documentation/web-search/codes
Notion: https://developers.notion.com/reference/get-self
Notion page: https://developers.notion.com/reference/retrieve-a-page
Notion append: https://developers.notion.com/reference/patch-block-children
Termux background: https://github.com/termux/termux-app
