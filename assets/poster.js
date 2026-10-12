(() => {
  'use strict';
  const P = window.KDNPoster, C = window.KDNCreator, $ = id => document.getElementById(id);
  // Hindi / Punjabi / English. Changing labels never translates authored content.
  const copy = {
    style:['मेहराब का अंदाज़','ਮਹਿਰਾਬ ਦਾ ਅੰਦਾਜ਼','Mehrab style'],royal:['शाही मेहराब','ਸ਼ਾਹੀ ਮਹਿਰਾਬ','Royal arch'],court:['शतरंज दरबार','ਸ਼ਤਰੰਜ ਦਰਬਾਰ','Chess court'],cards:['पत्तों की मेहराब','ਤਾਸ਼ ਦੀ ਮਹਿਰਾਬ','Card gallery'],
    skip:['पोस्टर पर जाएँ','ਪੋਸਟਰ ਵੱਲ ਜਾਓ','Skip to poster'],writer:['← टेक्स्ट Creator','← ਟੈਕਸਟ Creator','← Text Creator'],
    title:['शब्दों को तस्वीर बनाइए।','ਸ਼ਬਦਾਂ ਨੂੰ ਤਸਵੀਰ ਬਣਾਓ।','Give your words a canvas.'],subtitle:['आपकी फोटो, आपकी खबर — Royal Gold पोस्टर में।','ਤੁਹਾਡੀ ਫੋਟੋ, ਤੁਹਾਡੀ ਖ਼ਬਰ — Royal Gold ਪੋਸਟਰ ਵਿੱਚ।','Your photo and your story in a Royal Gold poster.'],
    language:['भाषा / Language','ਭਾਸ਼ਾ / Language','Language'],languageNote:['भाषा बदलने से आपका लिखा अनुवाद नहीं होता।','ਭਾਸ਼ਾ ਬਦਲਣ ਨਾਲ ਤੁਹਾਡੀ ਲਿਖਤ ਦਾ ਅਨੁਵਾਦ ਨਹੀਂ ਹੁੰਦਾ।','Changing language does not translate your writing.'],
    editor:['01 · पोस्टर तैयार करें','01 · ਪੋਸਟਰ ਤਿਆਰ ਕਰੋ','01 · Build your poster'],draftLabel:['सेव किए टेक्स्ट ड्राफ्ट से शुरू करें','ਸੰਭਾਲੇ ਟੈਕਸਟ ਡਰਾਫਟ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ','Start from a saved text draft'],useDraft:['ड्राफ्ट की कॉपी लें','ਡਰਾਫਟ ਦੀ ਕਾਪੀ ਲਵੋ','Copy draft'],refresh:['सूची अपडेट करें','ਸੂਚੀ ਅੱਪਡੇਟ ਕਰੋ','Refresh list'],draftNote:['या नीचे सीधे लिखें। मूल ड्राफ्ट में बदलाव नहीं होगा।','ਜਾਂ ਹੇਠਾਂ ਸਿੱਧਾ ਲਿਖੋ। ਮੂਲ ਡਰਾਫਟ ਨਹੀਂ ਬਦਲੇਗਾ।','Or write below. Your original draft stays unchanged.'],
    format:['पोस्टर का आकार','ਪੋਸਟਰ ਦਾ ਆਕਾਰ','Poster size'],square:['Square · 1080 × 1080','Square · 1080 × 1080','Square · 1080 × 1080'],portrait:['Portrait · 1080 × 1350','Portrait · 1080 × 1350','Portrait · 1080 × 1350'],headline:['शीर्षक','ਸਿਰਲੇਖ','Headline'],detail:['छोटा संदेश (वैकल्पिक)','ਛੋਟਾ ਸੁਨੇਹਾ (ਵਿਕਲਪਿਕ)','Short message (optional)'],credit:['स्रोत / फोटो क्रेडिट (वैकल्पिक)','ਸਰੋਤ / ਫੋਟੋ ਕ੍ਰੈਡਿਟ (ਵਿਕਲਪਿਕ)','Source / photo credit (optional)'],
    photo:['अपनी फोटो चुनें (वैकल्पिक)','ਆਪਣੀ ਫੋਟੋ ਚੁਣੋ (ਵਿਕਲਪਿਕ)','Choose your photo (optional)'],photoNote:['JPG, PNG या WebP · अधिकतम 12 MB। फोटो आपके डिवाइस पर ही रहती है।','JPG, PNG ਜਾਂ WebP · ਵੱਧ ਤੋਂ ਵੱਧ 12 MB। ਫੋਟੋ ਤੁਹਾਡੇ ਡਿਵਾਈਸ ਉੱਤੇ ਹੀ ਰਹਿੰਦੀ ਹੈ।','JPG, PNG or WebP · up to 12 MB. Your photo stays on your device.'],horizontal:['फोटो में जगह चुनें — बाएँ / दाएँ','ਫੋਟੋ ਵਿੱਚ ਥਾਂ ਚੁਣੋ — ਖੱਬੇ / ਸੱਜੇ','Photo focus — left / right'],vertical:['फोटो में जगह चुनें — ऊपर / नीचे','ਫੋਟੋ ਵਿੱਚ ਥਾਂ ਚੁਣੋ — ਉੱਪਰ / ਹੇਠਾਂ','Photo focus — top / bottom'],removePhoto:['फोटो हटाएँ','ਫੋਟੋ ਹਟਾਓ','Remove photo'],
    temporary:['पोस्टर इस खुली स्क्रीन तक रहता है। जाने से पहले PNG डाउनलोड करें। सेव किए टेक्स्ट ड्राफ्ट Creator में रहते हैं।','ਪੋਸਟਰ ਇਸ ਖੁੱਲ੍ਹੀ ਸਕ੍ਰੀਨ ਤੱਕ ਰਹਿੰਦਾ ਹੈ। ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ PNG ਡਾਊਨਲੋਡ ਕਰੋ। ਸੰਭਾਲੇ ਟੈਕਸਟ ਡਰਾਫਟ Creator ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ।','This poster stays only in this open screen. Download PNG before leaving. Saved text drafts remain in the Creator.'],
    preview:['02 · पोस्टर देखें','02 · ਪੋਸਟਰ ਵੇਖੋ','02 · Preview'],download:['PNG डाउनलोड करें','PNG ਡਾਊਨਲੋਡ ਕਰੋ','Download PNG'],share:['PNG Share','PNG Share','Share PNG'],previewNote:['प्रिव्यू और डाउनलोड में एक ही डिज़ाइन है। Share menu में अगला कदम आप चुनते हैं।','ਪ੍ਰੀਵਿਊ ਅਤੇ ਡਾਊਨਲੋਡ ਦਾ ਡਿਜ਼ਾਈਨ ਇੱਕੋ ਹੈ। Share menu ਵਿੱਚ ਅਗਲਾ ਕਦਮ ਤੁਸੀਂ ਚੁਣਦੇ ਹੋ।','The preview is the exported design. You choose the next step in the share menu.'],openImage:['PNG खोलें / सेव करें →','PNG ਖੋਲ੍ਹੋ / ਸੰਭਾਲੋ →','Open / save PNG →'],downloadHelp:['डाउनलोड न दिखे तो चित्र खोलकर उसे दबाएँ और Save image चुनें।','ਡਾਊਨਲੋਡ ਨਾ ਦਿਸੇ ਤਾਂ ਤਸਵੀਰ ਖੋਲ੍ਹ ਕੇ ਦਬਾਓ ਅਤੇ Save image ਚੁਣੋ।','If the download does not appear, open the image, press and hold it, then choose Save image.'],reset:['नया पोस्टर','ਨਵਾਂ ਪੋਸਟਰ','New poster'],retry:['फ़ॉन्ट फिर लोड करें','ਫੌਂਟ ਮੁੜ ਲੋਡ ਕਰੋ','Retry fonts'],footer:['साथ • सेवा • सहयोग','ਸਾਥ • ਸੇਵਾ • ਸਹਿਯੋਗ','Together • Service • Support'],
    selectDraft:['ड्राफ्ट चुनें…','ਡਰਾਫਟ ਚੁਣੋ…','Choose a draft…'],noDrafts:['अभी कोई सेव किया ड्राफ्ट नहीं','ਹਾਲੇ ਕੋਈ ਸੰਭਾਲਿਆ ਡਰਾਫਟ ਨਹੀਂ','No saved drafts yet'],draftsError:['ड्राफ्ट पढ़े नहीं जा सके। आप नीचे नया पोस्टर लिख सकते हैं।','ਡਰਾਫਟ ਪੜ੍ਹੇ ਨਹੀਂ ਜਾ ਸਕੇ। ਤੁਸੀਂ ਹੇਠਾਂ ਨਵਾਂ ਪੋਸਟਰ ਲਿਖ ਸਕਦੇ ਹੋ।','Could not read drafts. You can still write a new poster below.'],draftMissing:['यह ड्राफ्ट अब सूची में नहीं है। सूची अपडेट करें।','ਇਹ ਡਰਾਫਟ ਹੁਣ ਸੂਚੀ ਵਿੱਚ ਨਹੀਂ ਹੈ। ਸੂਚੀ ਅੱਪਡੇਟ ਕਰੋ।','This draft is no longer available. Refresh the list.'],draftCopied:['कॉपी आ गई। पोस्टर के लिए संदेश छोटा करें; पूरा मूल ड्राफ्ट सुरक्षित है।','ਕਾਪੀ ਆ ਗਈ। ਪੋਸਟਰ ਲਈ ਸੁਨੇਹਾ ਛੋਟਾ ਕਰੋ; ਪੂਰਾ ਮੂਲ ਡਰਾਫਟ ਸੁਰੱਖਿਅਤ ਹੈ।','Draft copied. Shorten the message for your poster; the full original is preserved.'],replace:['इस पोस्टर का टेक्स्ट बदलें? अभी डाउनलोड न किया काम बदल जाएगा।','ਇਸ ਪੋਸਟਰ ਦਾ ਟੈਕਸਟ ਬਦਲਣਾ ਹੈ? ਹਾਲੇ ਡਾਊਨਲੋਡ ਨਾ ਕੀਤਾ ਕੰਮ ਬਦਲ ਜਾਵੇਗਾ।','Replace this poster text? Work not yet downloaded will be replaced.'],clear:['यह पोस्टर छोड़कर नया बनाएँ?','ਇਹ ਪੋਸਟਰ ਛੱਡ ਕੇ ਨਵਾਂ ਬਣਾਉਣਾ ਹੈ?','Leave this poster and start a new one?'],
    fontsLoading:['फ़ॉन्ट तैयार हो रहे हैं…','ਫੌਂਟ ਤਿਆਰ ਹੋ ਰਹੇ ਹਨ…','Preparing fonts…'],fontsFailed:['फ़ॉन्ट लोड नहीं हुए। इंटरनेट के साथ फिर कोशिश करें।','ਫੌਂਟ ਲੋਡ ਨਹੀਂ ਹੋਏ। ਇੰਟਰਨੈੱਟ ਨਾਲ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।','Fonts could not load. Reconnect and retry.'],empty:['शीर्षक लिखें, फिर PNG तैयार होगा।','ਸਿਰਲੇਖ ਲਿਖੋ, ਫਿਰ PNG ਤਿਆਰ ਹੋਵੇਗਾ।','Add a headline to prepare your PNG.'],overflow:['टेक्स्ट पूरा नहीं समा रहा। संदेश छोटा करें या Portrait चुनें। PNG अभी बंद है ताकि शब्द न कटें।','ਪੂਰਾ ਟੈਕਸਟ ਨਹੀਂ ਸਮਾ ਰਿਹਾ। ਸੁਨੇਹਾ ਛੋਟਾ ਕਰੋ ਜਾਂ Portrait ਚੁਣੋ। ਸ਼ਬਦ ਕੱਟਣ ਤੋਂ ਬਚਾਉਣ ਲਈ PNG ਹਾਲੇ ਬੰਦ ਹੈ।','The full text does not fit. Shorten it or choose Portrait. PNG export is paused so words are not cut off.'],ready:['पूरा टेक्स्ट समा गया। PNG तैयार है।','ਪੂਰਾ ਟੈਕਸਟ ਸਮਾ ਗਿਆ। PNG ਤਿਆਰ ਹੈ।','All text fits. Your PNG is ready.'],preparing:['PNG तैयार हो रहा है…','PNG ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ…','Preparing PNG…'],photoLoading:['फोटो खुल रही है…','ਫੋਟੋ ਖੁੱਲ੍ਹ ਰਹੀ ਹੈ…','Opening your photo…'],photoError:['यह फोटो नहीं खुली। JPG, PNG या WebP चुनें: अधिकतम 12 MB, 40 megapixels और 12,000 pixels प्रति किनारा।','ਇਹ ਫੋਟੋ ਨਹੀਂ ਖੁੱਲ੍ਹੀ। JPG, PNG ਜਾਂ WebP ਚੁਣੋ: ਵੱਧ ਤੋਂ ਵੱਧ 12 MB, 40 megapixels ਅਤੇ 12,000 pixels ਪ੍ਰਤੀ ਪਾਸਾ।','Could not open this photo. Choose JPG, PNG or WebP: up to 12 MB, 40 megapixels and 12,000 pixels per side.'],canvasError:['PNG नहीं बना। संदेश छोटा करें या पेज फिर खोलें।','PNG ਨਹੀਂ ਬਣਿਆ। ਸੁਨੇਹਾ ਛੋਟਾ ਕਰੋ ਜਾਂ ਪੇਜ ਮੁੜ ਖੋਲ੍ਹੋ।','Could not create PNG. Shorten the message or reopen this page.'],downloaded:['PNG डाउनलोड शुरू किया गया। नीचे चित्र खोलने का विकल्प भी है।','PNG ਡਾਊਨਲੋਡ ਸ਼ੁਰੂ ਕੀਤਾ ਗਿਆ। ਹੇਠਾਂ ਤਸਵੀਰ ਖੋਲ੍ਹਣ ਦਾ ਵਿਕਲਪ ਵੀ ਹੈ।','PNG download requested. You can also open the image below.'],shareUnavailable:['इस ब्राउज़र में फ़ाइल Share उपलब्ध नहीं है। PNG डाउनलोड करके अपने सोशल ऐप में चुनें।','ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਫ਼ਾਈਲ Share ਨਹੀਂ ਹੈ। PNG ਡਾਊਨਲੋਡ ਕਰਕੇ ਆਪਣੇ ਸੋਸ਼ਲ ਐਪ ਵਿੱਚ ਚੁਣੋ।','File sharing is unavailable here. Download PNG, then select it in your social app.'],shared:['PNG share menu को दिया गया। प्रकाशन अपने सोशल ऐप में जाँचें।','PNG share menu ਨੂੰ ਦਿੱਤਾ ਗਿਆ। ਪ੍ਰਕਾਸ਼ਨ ਆਪਣੇ ਸੋਸ਼ਲ ਐਪ ਵਿੱਚ ਜਾਂਚੋ।','PNG handed to the share menu. Check publication in your social app.'],shareError:['Share नहीं हुआ। PNG डाउनलोड करें।','Share ਨਹੀਂ ਹੋਇਆ। PNG ਡਾਊਨਲੋਡ ਕਰੋ।','Sharing failed. Download PNG instead.']
  };
  let lang = 'hi', photo = null, logo = null, dirty = false, fontsReady = false, fontError = false;
  let photoLoading = false, photoTicket = 0, renderTicket = 0, timer, readyBlob = null, downloadURL = null, sharing = false;
  let drafts = [], fontAttempt = 0;
  const t = key => copy[key]?.[({hi:0,pa:1,en:2})[lang]] || key;
  const status = (key, error = false) => { $('notice').textContent = t(key); $('notice').classList.toggle('error', error); };
  const state = () => ({format:$('format').value, style:$('style').value, headline:$('headline').value.trim(), detail:$('detail').value.trim(), credit:$('credit').value.trim(), focusX:$('focus-x').value, focusY:$('focus-y').value});
  function previewStatus(key, error = false) { $('poster-status').textContent = t(key); $('poster-status').classList.toggle('error', error); }
  function buttons() { $('download-png').disabled = !readyBlob; $('share-png').disabled = !readyBlob || sharing; }
  function clearDownload() {
    if (downloadURL) URL.revokeObjectURL(downloadURL);
    downloadURL = null; $('open-png').removeAttribute('href'); $('download-fallback').hidden = true;
  }
  function paint() {
    clearTimeout(timer); const ticket = ++renderTicket; readyBlob = null; clearDownload(); buttons();
    const value = state();
    Object.entries(P.limits).forEach(([key, max]) => {
      $(key + '-count').textContent = value[key].length + ' / ' + max;
      $(key + '-count').classList.toggle('error', value[key].length > max);
    });
    let plan;
    try { plan = P.render($('poster-canvas'), value, photo, logo); }
    catch { previewStatus('canvasError', true); return; }
    $('dimensions').textContent = plan.width + ' × ' + plan.height;
    $('poster-canvas').setAttribute('aria-label', t('preview') + ': ' + [value.headline, value.detail, value.credit].filter(Boolean).join('. '));
    if (!fontsReady) { previewStatus(fontError ? 'fontsFailed' : 'fontsLoading', fontError); return; }
    if (photoLoading) { previewStatus('photoLoading'); return; }
    if (!value.headline) { previewStatus('empty'); return; }
    if (!plan.valid) { previewStatus('overflow', true); return; }
    previewStatus('preparing');
    // Prepare before the tap, so navigator.share retains the tap's user activation.
    timer = setTimeout(() => {
      try {
        $('poster-canvas').toBlob(blob => {
          if (ticket !== renderTicket) return;
          readyBlob = blob; buttons(); previewStatus(blob ? 'ready' : 'canvasError', !blob);
        }, 'image/png');
      } catch { if (ticket === renderTicket) previewStatus('canvasError', true); }
    }, 120);
  }
  function draftOptions() {
    const selected = $('draft-select').value; $('draft-select').replaceChildren();
    const option = document.createElement('option'); option.value = ''; option.textContent = t(drafts.length ? 'selectDraft' : 'noDrafts'); $('draft-select').append(option);
    for (const d of drafts) { const n = document.createElement('option'); n.value = d.id; n.textContent = (d.heading || d.body).slice(0, 90); $('draft-select').append(n); }
    $('draft-select').value = drafts.some(d => d.id === selected) ? selected : '';
    $('use-draft').disabled = !$('draft-select').value;
  }
  function loadDrafts() {
    try { const store = new C.Store(window.localStorage); if (store.error) throw store.error; drafts = store.drafts.slice().sort((a,b) => b.updated.localeCompare(a.updated)); }
    catch { drafts = []; status('draftsError', true); }
    draftOptions();
  }
  function translate() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(n => { n.textContent = t(n.dataset.i18n); });
    draftOptions(); paint();
  }
  async function loadFonts() {
    const attempt = ++fontAttempt; fontsReady = false; fontError = false; $('retry-fonts').hidden = true; paint();
    try {
      if (!document.fonts) throw new Error('fonts');
      const results = await Promise.all(['KDN Devanagari','KDN Gurmukhi'].flatMap(name => [400,700].map(weight => document.fonts.load(`${weight} 32px "${name}"`))));
      if (results.some(faces => !faces.length)) throw new Error('fonts');
      if (attempt !== fontAttempt) return; fontsReady = true;
    } catch { if (attempt !== fontAttempt) return; fontError = true; $('retry-fonts').hidden = false; }
    paint();
  }
  ['headline','detail','credit','format','style','focus-x','focus-y'].forEach(id => $(id).addEventListener('input', () => { dirty = true; $('notice').textContent = ''; paint(); }));
  $('language').onchange = () => { lang = $('language').value; $('notice').textContent = ''; translate(); };
  $('draft-select').onchange = () => { $('use-draft').disabled = !$('draft-select').value; };
  $('refresh-drafts').onclick = loadDrafts;
  $('use-draft').onclick = () => {
    const id = $('draft-select').value; loadDrafts(); const d = drafts.find(item => item.id === id);
    if (!d) { status('draftMissing', true); return; }
    if (dirty && !confirm(t('replace'))) return;
    // Copy complete fields. Oversized text stays editable and blocks export until shortened.
    $('headline').value = d.heading; $('detail').value = d.body; $('credit').value = d.source;
    lang = d.language; $('language').value = lang; dirty = true; translate(); status('draftCopied');
  };
  $('photo').onchange = () => {
    const file = $('photo').files[0]; $('photo').value = ''; if (!file) return;
    const ticket = ++photoTicket;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || !file.size || file.size > 12 * 1024 * 1024) {
      photoLoading = false; paint(); status('photoError', true); return;
    }
    photoLoading = true; paint();
    let url;
    try { url = URL.createObjectURL(file); } catch { photoLoading = false; paint(); status('photoError', true); return; }
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url); if (ticket !== photoTicket) return; photoLoading = false;
      const w = img.naturalWidth, h = img.naturalHeight;
      if (!w || !h || w * h > 40000000 || Math.max(w,h) > 12000) { paint(); status('photoError', true); return; }
      photo = img; dirty = true; $('focus-x').value = $('focus-y').value = '50'; $('crop-controls').hidden = false; $('notice').textContent = ''; paint();
    };
    img.onerror = () => { URL.revokeObjectURL(url); if (ticket !== photoTicket) return; photoLoading = false; paint(); status('photoError', true); };
    img.src = url;
  };
  function removePhoto() { ++photoTicket; photoLoading = false; photo = null; $('crop-controls').hidden = true; $('photo').value = ''; }
  $('remove-photo').onclick = () => { removePhoto(); dirty = true; paint(); };
  const filename = () => 'kdn-poster-' + $('format').value + '-' + new Date().toISOString().slice(0,10) + '.png';
  $('download-png').onclick = () => {
    if (!readyBlob) return;
    try {
      clearDownload(); downloadURL = URL.createObjectURL(readyBlob);
      const a = document.createElement('a'); a.href = downloadURL; a.download = filename(); document.body.append(a); a.click(); a.remove();
      $('open-png').href = downloadURL; $('download-fallback').hidden = false; dirty = false; status('downloaded');
    } catch { status('canvasError', true); }
  };
  $('share-png').onclick = async () => {
    if (!readyBlob || sharing) return;
    const ticket = renderTicket;
    try {
      const file = new File([readyBlob], filename(), {type:'image/png'});
      if (!navigator.share || !navigator.canShare || !navigator.canShare({files:[file]})) { status('shareUnavailable'); return; }
      sharing = true; buttons(); await navigator.share({files:[file],title:$('headline').value});
      if (ticket === renderTicket) { dirty = false; status('shared'); }
    } catch(e) { if (e.name !== 'AbortError') status('shareError', true); }
    finally { sharing = false; buttons(); }
  };
  $('reset').onclick = () => {
    if (dirty && !confirm(t('clear'))) return;
    ['headline','detail','credit'].forEach(id => { $(id).value = ''; }); $('format').value = 'square'; $('style').value = 'royal'; $('draft-select').value = ''; $('use-draft').disabled = true;
    removePhoto(); dirty = false; $('notice').textContent = ''; paint(); $('headline').focus();
  };
  $('retry-fonts').onclick = loadFonts;
  window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
  window.addEventListener('storage', e => { if (e.key === C.KEY || e.key === null) loadDrafts(); });
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  const emblem = new Image(); emblem.onload = () => { logo = emblem; paint(); }; emblem.src = './icons/khalsa-v1-192.png';
  loadDrafts(); translate(); loadFonts();
})();
