/* Ambient falcons: local behaviour AI, multi-view raster poses, not a rigged 3D model. */
(function mountAmbientFalcons() {
  'use strict';
  if (document.querySelector('.falcon-sky')) return;
  const root = document.createElement('div');
  root.className = 'falcon-sky';
  root.setAttribute('aria-hidden', 'true');
  document.body.append(root);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const random = (low, high) => low + Math.random() * (high - low);
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const overlap = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  const nodeIds = new WeakMap();
  let serial = 0, raf = null, previous = 0, elapsed = 0, lastPaint = -1;
  let lastScroll = -100, lastInteraction = -100, environmentAt = -1;
  let viewport, perches = [], obstacles = [], protectedArt = [];
    document.querySelectorAll('[data-falcon-perch]').forEach(node=>{const r=node.getBoundingClientRect();if(r.width)protectedArt.push({left:r.left,right:r.right,top:r.top,bottom:r.top+r.height*.145})});
  const pointer = {x: -1000, y: -1000};

  // Visible flights alternate with short perching stops.
  function restDuration() { return random(5, 12);
  }
  const birds = ['silver', 'golden'].map((name, index) => {
    const element = document.createElement('span');
    element.className = 'falcon-flight';
    element.dataset.falcon = name;
    const canvas = document.createElement('canvas');
    element.append(canvas); root.append(element);
    element.hidden = true;
    const bird = {index, element, canvas, ctx: canvas.getContext('2d'), assets: {},
      ready: false, state: 'loading', direction: index ? -1 : 1, point: {x: 0, y: 0},
      target: null, history: [], lastDrawing: '', wing: index * .4, headPose: 0,
      lookUntil: 0, nextLook: random(8, 20), restUntil: 0, restStarted: 0};
    for (const kind of ['flight', 'poses']) {
      const img = new Image();
      bird.assets[kind] = img;
      img.onload = () => {
        if (Object.values(bird.assets).every(asset => asset.complete && asset.naturalWidth)) {
          bird.ready = true; resizeCanvas(bird); wake();
        }
      };
      img.onerror = () => { bird.ready = false; element.hidden = true; };
      img.src = new URL(`./world/falcon-${name}-${kind === 'flight' ? 'flight-v29' : 'poses-v30'}.webp`, document.currentScript.src).href;
    }
    return bird;
  });

  function measure() {
    const width = document.documentElement.clientWidth || innerWidth;
    const height = window.visualViewport?.height || innerHeight;
    const top = Math.max(0, document.querySelector('.hud')?.getBoundingClientRect().bottom || 0);
    const size = clamp(width * .25, 92, 150);
    viewport = {width, height, top, size, halfPerch: size * .28, perchHeight: size * .40};
    birds.forEach(bird => { if (bird.ready) resizeCanvas(bird); });
    environmentAt = -1;
  }
  function resizeCanvas(bird) {
    if (!viewport) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    bird.canvas.width = Math.round(viewport.size * dpr);
    bird.canvas.height = Math.round(viewport.size * dpr);
    bird.canvas.style.width = viewport.size + 'px';
    bird.canvas.style.height = viewport.size + 'px';
    bird.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bird.lastDrawing = '';
  }
  function perchBox(point) {
    const {halfPerch, perchHeight} = viewport;
    return {left: point.x - halfPerch, right: point.x + halfPerch,
      top: point.y - perchHeight, bottom: point.y + 6};
  }
  function flightBox(point) {
    const size = viewport.size;
    // Include raised wings, turning poses, zoom and the small drop shadow.
    return {left: point.x - size * .55, right: point.x + size * .55,
      top: point.y - size * .66, bottom: point.y + size * .45};
  }
  function coversKhanda(box) { return protectedArt.some(r => overlap(box, r)); }
  function protectHeroArtwork() {
    protectedArt = [];
    document.querySelectorAll('.cinematic-hero').forEach(node => {
      const r = node.getBoundingClientRect();
      if (!r.width || !r.height || r.bottom < 0 || r.top > viewport.height) return;
      // The master art is 864 x 1536, rendered cover / center top inside the border.
      // Reserve its entire crown/flag-emblem band: the three Khandas stay uncovered.
      const styles = getComputedStyle(node);
      const leftBorder = parseFloat(styles.borderLeftWidth) || 0;
      const rightBorder = parseFloat(styles.borderRightWidth) || 0;
      const topBorder = parseFloat(styles.borderTopWidth) || 0;
      const bottomBorder = parseFloat(styles.borderBottomWidth) || 0;
      const width = r.width - leftBorder - rightBorder;
      const height = r.height - topBorder - bottomBorder;
      const scale = Math.max(width / 864, height / 1536);
      protectedArt.push({left: r.left, right: r.right, top: r.top,
        bottom: Math.min(r.bottom, r.top + topBorder + 340 * scale + 10)});
    });
  }
  function clearSpot(point) {
    const b = perchBox(point), v = viewport;
    const approach = flightBox({x: point.x, y: point.y - v.perchHeight * .52});
    return b.left >= 3 && b.right <= v.width - 3 && b.top >= v.top + 8 &&
      b.bottom <= v.height - 10 && !obstacles.some(r => overlap(b, r)) &&
      !coversKhanda(b) && !coversKhanda(approach);
  }
  function refreshEnvironment() {
    if (elapsed - environmentAt < .6) return;
    environmentAt = elapsed;
    const {width, height, top} = viewport;
    protectHeroArtwork();
    obstacles = [...document.querySelectorAll('input,textarea,select,button,summary,a,.hero-badges,.tv-story,.tv-brand,.tv-ticker,.brand h1,.mantra,.update-orb,.menu-panel')]
      .filter(node => !node.hidden && !node.closest('[hidden],dialog'))
      .map(node => node.getBoundingClientRect())
      .filter(r => r.width > 0 && r.height > 0 && r.bottom > top && r.top < height);
    perches = [];
    function add(node, slot, x, y, kind) {
      if (!nodeIds.has(node)) nodeIds.set(node, ++serial);
      const candidate = {key: nodeIds.get(node) + ':' + slot, node, x, y, kind};
      if (clearSpot(candidate)) perches.push(candidate);
    }
    document.querySelectorAll('.cinematic-hero,.phone,.origin-story,[data-falcon-perch],.heritage-banner').forEach(node => {
      const r = node.getBoundingClientRect();
      if (!r.width || !r.height || r.bottom < top || r.top > height) return;
      if (node.classList.contains('cinematic-hero')) {
        // Perch below the flag emblems, with room for a complete takeoff wingbeat.
        const crownBottom = protectedArt.find(zone => zone.left === r.left)?.bottom || r.top;
        const perchY = Math.max(r.top + r.height * .63, crownBottom + viewport.size * .88 + 12);
        add(node, 'arch-left', Math.max(viewport.halfPerch + 5, r.left + r.width * .075), perchY, 'arch');
        add(node, 'arch-right', Math.min(width - viewport.halfPerch - 5, r.right - r.width * .075), perchY, 'arch');
      }
      for (const side of ['left', 'right']) {
        const x = side === 'left' ? Math.max(viewport.halfPerch + 4, r.left + 14) :
          Math.min(width - viewport.halfPerch - 4, r.right - 14);
        for (const [slot, y] of [['rim', r.top - 7], ['lower-rim', r.bottom - 18],
          ['side-a', r.top + r.height * .40], ['side-b', r.top + r.height * .72]]) {
          add(node, side + slot, x, y, 'rim');
        }
      }
    });
    // Safe edge docking also works on views with no currently visible flag.
    for (const side of [0, 1]) {
      const x = side ? width - viewport.halfPerch - 5 : viewport.halfPerch + 5;
      for (const part of [.23, .5, .77]) {
        const p = {key: `edge:${side}:${part}`, node: null, kind: 'edge', x,
          y: top + viewport.perchHeight + 15 + (height - top - viewport.perchHeight - 45) * part};
        if (clearSpot(p)) perches.push(p);
      }
    }
  }
  function choosePerch(bird, initial = false) {
    const other = birds[1 - bird.index];
    const choices = perches.filter(p => p.key !== bird.target?.key &&
      (!other.target || (p.key !== other.target.key && distance(p, other.target) > viewport.halfPerch * 3)));
    return choices.map(p => ({...p, score: random(0, 3) + (p.kind === 'arch' ? (initial ? 8 : 1) : 0) +
      ((bird.index ? p.x > viewport.width / 2 : p.x < viewport.width / 2) ? .7 : 0) -
      (bird.history.includes(p.key) ? 4 : 0) - (p.kind === 'edge' ? .6 : 0)}))
      .sort((a, b) => b.score - a.score)[0] || null;
  }
  function settle(bird, target, direction = target.x < viewport.width / 2 ? 1 : -1) {
    bird.state = 'resting'; bird.target = target;
    bird.point = {x: target.x, y: target.y};
    bird.direction = direction;
    bird.restStarted = elapsed; bird.restUntil = elapsed + restDuration();
    bird.history = [...bird.history.slice(-2), target.key];
    bird.headPose = 0; bird.nextLook = elapsed + random(10, 28);
    bird.element.dataset.restSeconds = String(Math.round(bird.restUntil - elapsed));
    bird.lastDrawing = '';
  }
  function occupiedFlight() { return birds.some(b => b.state === 'flying'); }
  function readingInteraction() {
    return elapsed - lastScroll < 1.2 || elapsed - lastInteraction < 2 ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '') ||
      document.activeElement?.isContentEditable;
  }
  function beginFlight(bird, destination) {
    if (!destination || occupiedFlight() || reduced.matches || readingInteraction()) return false;
    const from = {x: bird.point.x, y: bird.point.y - viewport.perchHeight * .52};
    const to = {x: destination.x, y: destination.y - viewport.perchHeight * .52};
    const laneY = safeFlightLane(from, to);
    if (laneY === null) return false;
    const nextDirection = to.x >= from.x ? 1 : -1;
    bird.flight = {from, to, laneY, destination, started: elapsed,
      duration: clamp(1.7 + distance(from, to) / 180, 2.1, 4.5),
      oldDirection: bird.direction, nextDirection, turn: nextDirection !== bird.direction};
    bird.state = 'flying'; bird.lastDrawing = '';
    return true;
  }
  function bezier(a, b, c, d, t) {
    const u = 1 - t;
    return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
  }
  function safeFlightLane(from, to) {
    const low = viewport.top + viewport.size * .66;
    const high = Math.max(low, viewport.height - viewport.size * .45);
    const normal = clamp(Math.min(from.y, to.y) - 50, low, high);
    const lanes = [normal, ...protectedArt.map(r => clamp(r.bottom + viewport.size * .66 + 12, low, high)), high];
    for (const lane of lanes) {
      let clear = true;
      for (let step = 0; step <= 64; step++) {
        const t = step / 64;
        const point = {x: bezier(from.x, from.x, to.x, to.x, t),
          y: bezier(from.y, lane, lane, to.y, t)};
        if (coversKhanda(flightBox(point))) { clear = false; break; }
      }
      if (clear) return lane;
    }
    return null;
  }
  function paintImage(bird, kind, frame, direction, pitch = 0) {
    const key = [kind, frame, direction, Math.round(pitch * 24)].join(':');
    if (key === bird.lastDrawing) return;
    bird.lastDrawing = key;
    const ctx = bird.ctx, size = viewport.size, sheet = bird.assets[kind];
    const cw = sheet.naturalWidth / 4, ch = sheet.naturalHeight / 2;
    let sx = frame % 4 * cw, sy = Math.floor(frame / 4) * ch, sw = cw, sh = ch;
    let scale, ax, ay;
    if (kind === 'flight') {
      if (bird.index && frame === 2) { sx -= 14; sw += 14; }
      if (bird.index && frame === 3) sh += 11;
      if (bird.index && frame === 7) { sy += 13; sh -= 13; }
      ax = frame % 4 * cw + 192;
      ay = Math.floor(frame / 4) * ch + (bird.index ? (frame >= 4 ? 319 : 333) : 360);
      scale = size / 600;
    } else {
      scale = size * (frame < 4 ? .46 : .76) / cw;
      ax = sx + cw * (frame < 4 ? (bird.index ? .60 : .65) : .5);
      ay = sy + ch * (frame < 4 ? .946 : .68);
    }
    ctx.clearRect(0, 0, size, size);
    ctx.save(); ctx.translate(size / 2, size * .6); ctx.rotate(pitch);
    // Full width in every view: never animate scaleX through zero.
    ctx.scale(direction, 1);
    ctx.drawImage(sheet, sx, sy, sw, sh, (sx - ax) * scale, (sy - ay) * scale, sw * scale, sh * scale);
    ctx.restore();
    bird.element.dataset.pose = kind + ':' + frame;
    bird.element.dataset.facing = String(direction);
  }
  function renderBird(bird, delta) {
    if (!bird.ready) return;
    if (bird.state === 'loading') {
      const target = choosePerch(bird, true);
      if (!target) return;
      settle(bird, target);
    }
    let depth = 1, pitch = 0;
    if (bird.state === 'resting') {
      const anchor = perches.find(p => p.key === bird.target.key);
      if (anchor) { bird.target = anchor; bird.point = {x: anchor.x, y: anchor.y}; }
      const due = elapsed >= bird.restUntil;
      if (reduced.matches && !anchor) {
        const replacement = choosePerch(bird);
        if (replacement) settle(bird, replacement);
      }
      if ((!anchor || due) && !readingInteraction() && !occupiedFlight()) {
        const next = choosePerch(bird);
        if (!anchor && !clearSpot(bird.point) && next) {
          // A scroll or door change can leave the old perch inside protected art.
          // Recover onto a clear perch, then resume visible flights.
          settle(bird, next); bird.restUntil = elapsed + 1.5;
        } else if (reduced.matches && next && !anchor) settle(bird, next);
        else if (next) {
          const alternatives = [next, ...perches.filter(p => p.key !== next.key && p.key !== bird.target?.key && (!birds[1-bird.index].target || distance(p,birds[1-bird.index].target) > viewport.halfPerch*3))];
          if (alternatives.some(p => beginFlight(bird,p))) return renderBird(bird,delta);
          if (due) bird.restUntil = elapsed + 2;
        }
        else if (due) bird.restUntil = elapsed + 8;
      }
      if (!reduced.matches && elapsed >= bird.nextLook) {
        bird.headPose = Math.random() < .2 ? 3 : Math.random() < .5 ? 1 : 2;
        bird.lookUntil = elapsed + random(1.3, 2.8);
        bird.nextLook = elapsed + random(12, 35);
      }
      const nearby = Math.hypot(pointer.x - bird.point.x, pointer.y - bird.point.y) < 90;
      const head = reduced.matches ? 0 : nearby ? 1 : elapsed < bird.lookUntil ? bird.headPose : 0;
      paintImage(bird, 'poses', head, bird.direction);
      // Gentle breathing while the feet stay fixed on the perch.
      depth = reduced.matches ? 1 : 1 + Math.sin(elapsed * 1.7 + bird.index) * .004;
    } else {
      const f = bird.flight, age = elapsed - f.started;
      const progress = clamp(age / f.duration, 0, 1);
      const anchor = perches.find(p => p.key === f.destination.key);
      if (anchor) {
        f.destination = anchor;
        f.to = {x: anchor.x, y: anchor.y - viewport.perchHeight * .52};
        if (distance(f.to, f.previousTo || f.to) > 1) {
          const safeLane = safeFlightLane(f.from, f.to);
          if (safeLane !== null) f.laneY = safeLane;
        }
        f.previousTo = {...f.to};
      }
      const ease = progress * progress * (3 - 2 * progress);
      const laneY = f.laneY;
      bird.point = {x: bezier(f.from.x, f.from.x, f.to.x, f.to.x, ease),
        y: bezier(f.from.y, laneY, laneY, f.to.y, ease)};
      bird.wing += delta * (progress > .83 ? 1.2 : 1.7);
      if (f.turn && age < .64) {
        paintImage(bird, 'poses', 4 + Math.min(3, Math.floor(age / .16)), f.oldDirection);
      } else {
        bird.direction = f.nextDirection;
        pitch = Math.sin(progress * Math.PI * 2) * .09;
        paintImage(bird, 'flight', Math.floor(bird.wing * 8) % 8, bird.direction, pitch);
      }
      depth = 1 + Math.sin(progress * Math.PI) * .045;
      if (progress >= 1) { settle(bird, f.destination, bird.direction); paintImage(bird, 'poses', 0, bird.direction); depth = 1; }
    }
    // Final per-frame guard covers scroll/resize while a flight is already underway.
    bird.element.hidden = bird.state === 'resting' ? !clearSpot(bird.point) : coversKhanda(flightBox(bird.point));
    bird.element.style.transform = `translate3d(${bird.point.x}px,${bird.point.y}px,0)`;
    bird.canvas.style.transform = `translate(-50%,-60%) scale(${depth})`;
    bird.element.dataset.state = bird.state;
    bird.element.dataset.perch = bird.target?.key || '';
    bird.element.dataset.x = bird.point.x.toFixed(1);
    bird.element.dataset.y = bird.point.y.toFixed(1);
  }
  function tick(stamp) {
    raf = null;
    if (document.hidden) {root.hidden=true;return;}
    if (document.body.classList.contains('motion-off')) {root.hidden=false;return;}
    const delta = Math.min(.1, Math.max(0, (stamp - previous) / 1000)); previous = stamp;
    if (!document.querySelector('dialog[open]') && !document.documentElement.classList.contains('q-paused67')) elapsed += delta;
    root.hidden = !!document.querySelector('dialog[open]') || !!document.querySelector('#boot:not([hidden])');
    refreshEnvironment();
    const moving = occupiedFlight();
    if (moving || elapsed - lastPaint >= .08 || reduced.matches) {
      const animationDelta = Math.min(.15, elapsed - lastPaint);
      lastPaint = elapsed;
      birds.forEach(bird => renderBird(bird, animationDelta));
    }
    if (!reduced.matches) raf = requestAnimationFrame(tick);
  }
  function pause() { if (raf !== null) cancelAnimationFrame(raf); raf = null; }
  function wake() {
    if (document.hidden || raf !== null) return;
    previous = performance.now(); raf = requestAnimationFrame(tick);
  }
  function invalidate() { environmentAt = -1; lastPaint = -1; wake(); }
  function onScroll() { lastScroll = elapsed; invalidate(); }
  function resize() { measure(); invalidate(); }
  document.addEventListener('visibilitychange', () => document.hidden ? pause() : wake());
  document.addEventListener('scroll', onScroll, {passive: true});
  document.addEventListener('pointerdown', () => { lastInteraction = elapsed; invalidate(); }, {passive: true});
  document.addEventListener('pointermove', event => { pointer.x = event.clientX; pointer.y = event.clientY; }, {passive: true});
  document.addEventListener('focusin', () => { lastInteraction = elapsed; wake(); });
  window.addEventListener('resize', resize, {passive: true});
  window.visualViewport?.addEventListener('resize', resize, {passive: true});
  window.addEventListener('pagehide', pause); window.addEventListener('pageshow', wake);
  reduced.addEventListener('change', () => {
    pause();
    birds.forEach(bird => { if (bird.state === 'flying') settle(bird, bird.flight.destination); });
    invalidate();
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('close', invalidate);
    new MutationObserver(invalidate).observe(dialog, {attributes: true, attributeFilter: ['open']});
  });
  new MutationObserver(invalidate).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class']});
  window.addEventListener('hashchange',invalidate);
  measure(); wake();
})();
