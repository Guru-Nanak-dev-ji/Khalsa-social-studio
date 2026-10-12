(function (root) {
  'use strict';
  const sizes = {square: [1080, 1080], portrait: [1080, 1350]};
  const limits = {headline: 140, detail: 420, credit: 100};
  const family = '"KDN Devanagari", "KDN Gurmukhi", sans-serif';
  const font = (size, weight = 400) => `${weight} ${size}px ${family}`;

  // Never split a word or an Indic combining sequence to squeeze it into a line.
  // An unbreakable word that is too wide is reported, not clipped in an export.
  function wrap(ctx, value, width) {
    const lines = [];
    for (const paragraph of value.trim().split(/\r?\n/)) {
      let line = '';
      for (const word of paragraph.trim().split(/\s+/).filter(Boolean)) {
        const next = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(next).width > width) { lines.push(line); line = word; }
        else line = next;
      }
      lines.push(line);
    }
    return value.trim() ? lines : [];
  }

  function cover(iw, ih, width, height, x = 50, y = 50) {
    if (![iw, ih, width, height].every(n => Number.isFinite(n) && n > 0)) throw new Error('dimensions');
    const scale = Math.max(width / iw, height / ih);
    const sw = width / scale, sh = height / scale;
    const clamp = n => Math.max(0, Math.min(100, Number(n) || 0)) / 100;
    return {sx: (iw - sw) * clamp(x), sy: (ih - sh) * clamp(y), sw, sh};
  }

  function layout(ctx, state, hasPhoto) {
    const overLimit = Object.entries(limits).some(([key, max]) => state[key].length > max);
    state = {...state, ...Object.fromEntries(Object.entries(limits).map(([key,max]) => [key, state[key].slice(0, max + 1)]))};
    const [width, height] = sizes[state.format] || sizes.square;
    const photo = {x: 64, y: 172, width: 952, height: height === 1080 ? 386 : 536};
    const top = hasPhoto ? photo.y + photo.height + 34 : (height === 1080 ? 398 : 450);
    const available = height - 172 - top;
    let result;
    for (let size = hasPhoto ? 68 : 92; size >= (hasPhoto ? 42 : 48); size -= 2) {
      const bodySize = Math.max(28, Math.min(38, Math.round(size * .52)));
      ctx.font = font(size, 700);
      const heading = wrap(ctx, state.headline, 920);
      const headingFits = heading.every(line => ctx.measureText(line).width <= 920);
      ctx.font = font(bodySize);
      const body = wrap(ctx, state.detail, 920);
      const bodyFits = body.every(line => ctx.measureText(line).width <= 920);
      const used = heading.length * size * 1.5 + (body.length ? 18 + body.length * bodySize * 1.55 : 0);
      result = {width, height, photo, top, available, heading, body, size, bodySize,
        fits: headingFits && bodyFits && used <= available};
      if (result.fits) break;
    }
    ctx.font = font(24);
    result.credit = wrap(ctx, state.credit, 920);
    result.fits = result.fits && result.credit.length <= 2 && result.credit.every(line => ctx.measureText(line).width <= 920);
    result.overLimit = overLimit;
    result.valid = !!state.headline.trim() && result.fits && !result.overLimit;
    return result;
  }

  function arch(ctx, x, y, w, h, r, style = 'royal') {
    ctx.beginPath(); ctx.moveTo(x, y + r);
    if (style === 'court') {
      ctx.bezierCurveTo(x, y + r * .4, x + w * .3, y + r * .55, x + w / 2, y);
      ctx.bezierCurveTo(x + w * .7, y + r * .55, x + w, y + r * .4, x + w, y + r);
    } else if (style === 'cards') {
      ctx.quadraticCurveTo(x, y + r * .2, x + w * .2, y + r * .4);
      ctx.quadraticCurveTo(x + w * .3, y, x + w * .4, y + r * .15);
      ctx.quadraticCurveTo(x + w / 2, y - r * .15, x + w * .6, y + r * .15);
      ctx.quadraticCurveTo(x + w * .7, y, x + w * .8, y + r * .4);
      ctx.quadraticCurveTo(x + w, y + r * .2, x + w, y + r);
    } else {
      ctx.quadraticCurveTo(x, y, x + w / 2, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    }
    ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath();
  }

  function ornaments(ctx, h, style) {
    ctx.save(); ctx.translate(82, h - 67); ctx.scale(.72, .72);
    ctx.fillStyle = '#d8bc84'; ctx.strokeStyle = '#d8bc84'; ctx.lineWidth = 2;
    // Pawn and rook silhouettes; vector geometry also works without symbol fonts.
    ctx.beginPath(); ctx.arc(20, 10, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(13,21); ctx.lineTo(27,21); ctx.lineTo(29,30); ctx.lineTo(25,30); ctx.lineTo(29,45); ctx.lineTo(34,49); ctx.lineTo(34,55); ctx.lineTo(6,55); ctx.lineTo(6,49); ctx.lineTo(11,45); ctx.lineTo(15,30); ctx.lineTo(11,30); ctx.closePath(); ctx.fill();
    ctx.translate(45,0); ctx.beginPath(); ctx.moveTo(2,4); ctx.lineTo(9,4); ctx.lineTo(9,12); ctx.lineTo(15,12); ctx.lineTo(15,4); ctx.lineTo(22,4); ctx.lineTo(22,12); ctx.lineTo(28,12); ctx.lineTo(28,4); ctx.lineTo(35,4); ctx.lineTo(35,22); ctx.lineTo(28,25); ctx.lineTo(28,44); ctx.lineTo(35,49); ctx.lineTo(35,55); ctx.lineTo(2,55); ctx.lineTo(2,49); ctx.lineTo(9,44); ctx.lineTo(9,25); ctx.lineTo(2,22); ctx.closePath(); ctx.stroke();
    ctx.restore(); ctx.save(); ctx.translate(943,h-45); ctx.scale(.72,.72);
    for (const angle of [-.32,0,.32]) {
      ctx.save(); ctx.rotate(angle); ctx.fillStyle = style === 'cards' ? '#30203b' : '#201914'; ctx.strokeStyle = '#d8bc84'; ctx.lineWidth = 2;
      ctx.fillRect(-20,-32,40,56); ctx.strokeRect(-20,-32,40,56);
      ctx.fillStyle = '#e8c980'; ctx.beginPath(); ctx.moveTo(0,-23); ctx.lineTo(10,-8); ctx.lineTo(0,7); ctx.lineTo(-10,-8); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    ctx.restore();
  }

  function render(canvas, state, photo, logo) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas');
    const plan = layout(ctx, state, !!photo);
    canvas.width = plan.width; canvas.height = plan.height;
    const {width: w, height: h} = plan;
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, state.style === 'cards' ? '#36223e' : '#302417'); bg.addColorStop(.55, '#13110e'); bg.addColorStop(1, state.style === 'court' ? '#30203b' : '#201715');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#9a7740'; ctx.lineWidth = 2; ctx.strokeRect(30, 30, w - 60, h - 60);
    ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    ctx.fillStyle = '#edcd88'; ctx.font = font(28, 700); ctx.fillText('KHALSA DIGITAL WORLD', 76, 103);
    ctx.fillStyle = '#c5b597'; ctx.font = font(18); ctx.fillText('KDN SOCIAL STUDIO', 76, 132);
    if (logo) ctx.drawImage(logo, 914, 58, 90, 90);

    if (photo) {
      const p = plan.photo, iw = photo.naturalWidth || photo.width, ih = photo.naturalHeight || photo.height;
      const crop = cover(iw, ih, p.width, p.height, state.focusX, state.focusY);
      ctx.save(); arch(ctx, p.x, p.y, p.width, p.height, 100, state.style); ctx.clip();
      ctx.drawImage(photo, crop.sx, crop.sy, crop.sw, crop.sh, p.x, p.y, p.width, p.height); ctx.restore();
      ctx.strokeStyle = '#b68b4a'; arch(ctx, p.x, p.y, p.width, p.height, 100, state.style); ctx.stroke();
    } else {
      ctx.strokeStyle = '#705333'; ctx.lineWidth = 2;
      arch(ctx, 64, 178, 952, h - 350, 184, state.style); ctx.stroke();
      // A larger chess-and-card crest sits inside the arch, above authored text.
      ctx.save(); ctx.translate(467, 253); ctx.scale(1.25, 1.25);
      ctx.fillStyle = '#b78c4c'; ctx.beginPath(); ctx.arc(18, 9, 8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(11,21); ctx.lineTo(25,21); ctx.lineTo(29,47); ctx.lineTo(35,52); ctx.lineTo(35,58); ctx.lineTo(1,58); ctx.lineTo(1,52); ctx.lineTo(7,47); ctx.closePath(); ctx.fill();
      ctx.translate(82,32);
      for (const angle of [-.25,.2]) { ctx.save(); ctx.rotate(angle); ctx.fillStyle = '#211725'; ctx.strokeStyle = '#c59a59'; ctx.fillRect(-19,-28,38,56); ctx.strokeRect(-19,-28,38,56); ctx.fillStyle = '#d8b575'; ctx.beginPath(); ctx.moveTo(0,-15); ctx.lineTo(9,0); ctx.lineTo(0,15); ctx.lineTo(-9,0); ctx.closePath(); ctx.fill(); ctx.restore(); }
      ctx.restore();
      ctx.fillStyle = '#edcd88'; ctx.fillRect(80, plan.top - 30, 68, 4);
    }

    // Invalid layouts may be clipped in the draft preview, but cannot be exported.
    ctx.save(); ctx.beginPath(); ctx.rect(76, plan.top - 8, 928, plan.available + 12); ctx.clip();
    let y = plan.top;
    ctx.fillStyle = '#f4d69a'; ctx.font = font(plan.size, 700);
    for (const line of plan.heading) { ctx.fillText(line, 80, y + plan.size); y += plan.size * 1.5; }
    if (plan.body.length) y += 18;
    ctx.fillStyle = '#f3eadb'; ctx.font = font(plan.bodySize);
    for (const line of plan.body) { ctx.fillText(line, 80, y + plan.bodySize); y += plan.bodySize * 1.55; }
    ctx.restore();

    ctx.fillStyle = '#c5b597'; ctx.font = font(24);
    plan.credit.slice(0, 2).forEach((line, i) => ctx.fillText(line, 80, h - 125 + i * 35));
    ctx.strokeStyle = '#705333'; ctx.beginPath(); ctx.moveTo(64, h - 76); ctx.lineTo(1016, h - 76); ctx.stroke();
    ctx.textAlign = 'center'; ctx.fillStyle = '#d8bc84'; ctx.font = font(22);
    ctx.fillText('ਸਾਥ · ਸੇਵਾ · ਸਹਿਯੋਗ', w / 2, h - 43);
    ornaments(ctx, h, state.style);
    return plan;
  }

  const api = {sizes, limits, font, wrap, cover, layout, render};
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KDNPoster = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
