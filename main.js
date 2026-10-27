const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
const root = document.documentElement;

document.getElementById('yr').textContent = new Date().getFullYear();

/* ---------- Theme colours (read from the active palette) ---------- */
function hexToRgb(hex) {
  const n = parseInt(hex.trim().replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const theme = {};
function readTheme() {
  const s = getComputedStyle(root);
  theme.accent = s.getPropertyValue('--accent-rgb').trim();
  theme.ink = hexToRgb(s.getPropertyValue('--text')).join(',');
  theme.bg = hexToRgb(s.getPropertyValue('--bg'));
  theme.c1 = hexToRgb(s.getPropertyValue('--c1'));
  theme.c2 = hexToRgb(s.getPropertyValue('--c2'));
  theme.c3 = hexToRgb(s.getPropertyValue('--c3'));
}
readTheme();

/* ---------- Palette picker (temporary) ---------- */
const paletteBtns = document.querySelectorAll('[data-palette]');
function setPalette(name) {
  root.dataset.theme = name;
  paletteBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.palette === name)));
  try { localStorage.setItem('palette', name); } catch (e) {}
  readTheme();
}
paletteBtns.forEach(b => b.addEventListener('click', () => setPalette(b.dataset.palette)));
setPalette(root.dataset.theme || 'aurora');

/* ---------- Smooth scroll ---------- */
let lenis = null;
if (!reduceMotion && typeof Lenis !== 'undefined') {
  lenis = new Lenis({ lerp: 0.1 });
  if (hasGSAP) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else if (target === 0) window.scrollTo({ top: 0 });
    else target.scrollIntoView();
  });
});

/* ---------- Nav: hide on scroll down, show on scroll up ---------- */
const nav = document.getElementById('nav');
const bar = document.querySelector('.progress span');
let lastY = 0;
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 20);
  nav.classList.toggle('hide', y > lastY && y > 400);
  lastY = y;
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Copy email ---------- */
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = 'Copied ✓';
    } catch {
      btn.textContent = btn.dataset.copy;
    }
    setTimeout(() => (btn.textContent = 'Copy email'), 2000);
  });
});

/* ---------- Card spotlight (services + skills) ---------- */
document.querySelectorAll('.svc, .bx').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ---------- Magnetic buttons ---------- */
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
      el.style.transform = '';
      setTimeout(() => (el.style.transition = ''), 600);
    });
  });
}

/* ---------- Work preview: follows the mouse while hovering a project (desktop) ---------- */
const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });

if (finePointer && !reduceMotion) {
  const preview = document.querySelector('.w-preview');
  const stack = preview.querySelector('.w-preview-stack');
  const p = { x: pointer.x, y: pointer.y };

  // the preview shows the same little screen that sits inside each project row
  document.querySelectorAll('.w-row .w-vis').forEach(v => stack.appendChild(v.cloneNode(true)));

  (function loop() {
    p.x += (pointer.x - p.x) * 0.12;
    p.y += (pointer.y - p.y) * 0.12;
    const tilt = Math.max(-8, Math.min(8, (pointer.x - p.x) * 0.15));
    // sit to the right of the cursor so the project title stays readable
    preview.style.translate = `${Math.min(p.x + 280, innerWidth - 240)}px ${p.y}px`;
    preview.style.rotate = `${tilt}deg`;
    requestAnimationFrame(loop);
  })();

  const list = document.querySelector('.w-list');
  list.querySelectorAll('.w-row').forEach((row, i) => {
    row.addEventListener('pointerenter', () => {
      stack.style.transform = `translateY(${-i * 100}%)`;
      preview.classList.add('show');
    });
  });
  list.addEventListener('pointerleave', () => preview.classList.remove('show'));
}

/* ---------- Work: expand / collapse rows ---------- */
document.querySelectorAll('.w-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const row = btn.closest('.w-row');
    const open = !row.classList.contains('open');
    document.querySelectorAll('.w-row.open').forEach(r => {
      r.classList.remove('open');
      r.querySelector('.w-btn').setAttribute('aria-expanded', 'false');
    });
    row.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    // page height changed, so scroll-linked positions need recalculating
    if (hasGSAP) setTimeout(() => ScrollTrigger.refresh(), 650);
  });
});

/* ---------- Hero: rotating word ---------- */
(function rotator() {
  const box = document.querySelector('.rot');
  const words = ['workflows', 'operations', 'Zoho', 'CRM', 'business'];
  const word = box.querySelector('.rot-w');
  let i = words.length - 1;
  const fit = () => (box.style.width = `${word.offsetWidth}px`);
  // wait for the web font, otherwise the first width is measured with the fallback font
  document.fonts.ready.then(fit);
  addEventListener('resize', fit);
  if (reduceMotion) return;
  const ease = 'cubic-bezier(.16, 1, .3, 1)';
  const shown = { transform: 'translateY(0)', opacity: 1, filter: 'blur(0px)' };
  setInterval(async () => {
    if (document.hidden) return;
    i = (i + 1) % words.length;
    word.getAnimations().forEach(a => a.cancel());
    // 1) current word blurs up and out
    try {
      await word.animate([shown, { transform: 'translateY(-70%)', opacity: 0, filter: 'blur(8px)' }],
        { duration: 420, easing: ease, fill: 'forwards' }).finished;
    } catch {
      return; // interrupted (e.g. the tab was hidden); the next tick starts cleanly
    }
    // 2) swap the text while hidden and resize the slot to the new word
    word.textContent = words[i];
    fit();
    // 3) new word blurs up into place
    word.animate([{ transform: 'translateY(70%)', opacity: 0, filter: 'blur(8px)' }, shown],
      { duration: 520, easing: ease, fill: 'forwards' }).finished.catch(() => {}); // cancelled by the next swap
  }, 2600);
})();

/* ---------- Hero: light that follows the cursor ---------- */
(function spotlight() {
  const hero = document.querySelector('.hero');
  const spot = hero.querySelector('.spot');
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    spot.style.setProperty('--sx', `${e.clientX - r.left}px`);
    spot.style.setProperty('--sy', `${e.clientY - r.top}px`);
  });
})();

/* ---------- Hero: flowing particles + neural network, assembling on load ---------- */
(function heroFx() {
  const hero = document.querySelector('.hero');
  const flowCanvas = document.getElementById('fx');
  const netCanvas = document.getElementById('brain');
  const fctx = flowCanvas.getContext('2d');
  const nctx = netCanvas.getContext('2d');
  const mouse = { x: -9999, y: -9999 };
  const rgba = (c, a) => `rgba(${Array.isArray(c) ? c.join(',') : c},${a})`;
  const inputs = ['Zoho CRM', 'Creator', 'Books', 'Deluge', 'Python', 'SQL', 'n8n'];
  const outputs = ['Automation', 'AI Agents', 'RAG', 'Dashboards', 'Integrations'];
  let w, h, small, particles, layers, pulses = [], lastSpawn = 0, running = true, raf;
  const start = performance.now();

  function size(canvas, ctx) {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ---- flow: particles ride invisible currents and leave silky trails; the cursor stirs a vortex ---- */
  function spawn(p) {
    p.x = p.px = Math.random() * w;
    p.y = p.py = Math.random() * h;
    p.age = 0;
    p.life = 120 + Math.random() * 220;
    p.c = Math.floor(Math.random() * 3);
    return p;
  }
  function drawFlow(t) {
    // fade old trails toward transparent so the colour glows behind stay visible
    fctx.globalCompositeOperation = 'destination-out';
    fctx.fillStyle = 'rgba(0,0,0,0.075)';
    fctx.fillRect(0, 0, w, h);
    fctx.globalCompositeOperation = 'lighter';
    const T = t * 0.00012, R = 170;
    const colors = [theme.c2, theme.c3, theme.accent];
    // for the first moments every particle is pulled onto a network node, so the network forms out of the flow
    const pull = Math.max(0, 1 - (t - start) / 2600);
    const nodes = pull > 0 ? layers.flat() : null;
    fctx.lineWidth = 1.1;
    for (let c = 0; c < 3; c++) {
      fctx.strokeStyle = rgba(colors[c], 0.45);
      fctx.beginPath();
      for (const p of particles) {
        if (p.c !== c) continue;
        const a = (Math.sin(p.x * 0.0028 + T * 3) + Math.cos(p.y * 0.0034 - T * 2) + Math.sin((p.x - p.y) * 0.0016 + T)) * 1.6;
        let vx = Math.cos(a) * 1.4, vy = Math.sin(a) * 1.4;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < R) { const f = (1 - d / R) * 3.2; vx += (-dy / (d + 1)) * f; vy += (dx / (d + 1)) * f; }
        if (pull > 0) {
          const n = nodes[p.target % nodes.length];
          vx = vx * (1 - pull) + (n.x - p.x) * 0.06 * pull;
          vy = vy * (1 - pull) + (n.y - p.y) * 0.06 * pull;
        }
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy;
        if (pull <= 0 && (++p.age > p.life || p.x < 0 || p.x > w || p.y < 0 || p.y > h)) { spawn(p); continue; }
        fctx.moveTo(p.px, p.py);
        fctx.lineTo(p.x, p.y);
      }
      fctx.stroke();
    }
    fctx.globalCompositeOperation = 'source-over';
  }

  /* ---- flat network: skills on the left, hidden layers, outcomes on the right ---- */
  function buildNet() {
    const edge = small ? w * 0.08 : Math.max(120, w * 0.1);
    const col = (xs, labels, n, y0, y1) => Array.from({ length: n }, (_, i) => ({
      x: xs, y: y0 + (y1 - y0) * (n === 1 ? 0.5 : i / (n - 1)), label: labels ? labels[i] : null, glow: 0,
    }));
    layers = [
      col(edge, small ? null : inputs, small ? 5 : inputs.length, h * 0.2, h * 0.86),
      col(w * 0.32, null, 6, h * 0.3, h * 0.78),
      col(w * 0.68, null, 6, h * 0.3, h * 0.78),
      col(w - edge, small ? null : outputs, small ? 4 : outputs.length, h * 0.26, h * 0.8),
    ];
  }
  // a signal hops from layer to layer along a random path, lighting each node it reaches
  function firePulse(from = 0, start = null) {
    const path = layers.map(l => Math.floor(Math.random() * l.length));
    if (start !== null) path[from] = start;
    pulses.push({ path, seg: from, t: 0, speed: 0.022 + Math.random() * 0.014 });
  }
  function drawFlat(t, alpha) {
    const A = theme.accent, I = theme.ink;
    nctx.globalAlpha = alpha;
    nctx.lineWidth = 1;
    nctx.strokeStyle = rgba(I, small ? 0.05 : 0.07);
    nctx.beginPath();
    for (let l = 0; l < layers.length - 1; l++)
      for (const a of layers[l]) for (const b of layers[l + 1]) { nctx.moveTo(a.x, a.y); nctx.lineTo(b.x, b.y); }
    nctx.stroke();

    if (!reduceMotion && alpha > 0.5) {
      if (t - lastSpawn > (small ? 260 : 150)) { firePulse(); lastSpawn = t; }

      pulses = pulses.filter(p => p.seg < layers.length - 1);
      for (const p of pulses) {
        const a = layers[p.seg][p.path[p.seg]], b = layers[p.seg + 1][p.path[p.seg + 1]];
        p.t += p.speed;
        if (p.t <= p.speed) a.glow = 1;
        const k = Math.min(p.t, 1), tk = Math.max(0, k - 0.18);
        const x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k;
        const tx = a.x + (b.x - a.x) * tk, ty = a.y + (b.y - a.y) * tk;
        const g = nctx.createLinearGradient(tx, ty, x, y);
        g.addColorStop(0, rgba(A, 0));
        g.addColorStop(1, rgba(A, 0.9));
        nctx.strokeStyle = g;
        nctx.lineWidth = 1.6;
        nctx.beginPath(); nctx.moveTo(tx, ty); nctx.lineTo(x, y); nctx.stroke();
        nctx.fillStyle = 'rgba(255,255,255,.95)';
        nctx.beginPath(); nctx.arc(x, y, 1.8, 0, Math.PI * 2); nctx.fill();
        if (p.t >= 1) { b.glow = 1; p.seg++; p.t = 0; }
      }
    }

    nctx.font = '500 11px "Geist Mono", monospace';
    nctx.textBaseline = 'middle';
    layers.forEach((layer, l) => {
      for (const n of layer) {
        if (Math.hypot(n.x - mouse.x, n.y - mouse.y) < 70) n.glow = 1;
        const gl = n.glow;
        n.glow *= 0.94;
        const r = (n.label ? 3.2 : 2.4) + gl * 3;
        if (gl > 0.05) {
          nctx.fillStyle = rgba(A, gl * 0.25);
          nctx.beginPath(); nctx.arc(n.x, n.y, r + 8 * gl, 0, Math.PI * 2); nctx.fill();
        }
        nctx.fillStyle = gl > 0.3 ? '#fff' : rgba(I, 0.55);
        nctx.beginPath(); nctx.arc(n.x, n.y, r, 0, Math.PI * 2); nctx.fill();
        if (n.label) {
          nctx.fillStyle = gl > 0.3 ? rgba(A, 1) : rgba(I, 0.5);
          nctx.textAlign = l === 0 ? 'right' : 'left';
          nctx.fillText(n.label, n.x + (l === 0 ? -12 : 12), n.y);
        }
      }
    });
    nctx.globalAlpha = 1;
  }

  function drawNet(t) {
    nctx.clearRect(0, 0, w, h);
    // the lines and nodes fade in once the particles have gathered
    drawFlat(t, reduceMotion ? 1 : Math.min(1, Math.max(0, (t - start - 1300) / 1300)));
  }

  function resize() {
    w = hero.clientWidth;
    h = hero.clientHeight;
    small = w < 760;
    size(flowCanvas, fctx);
    size(netCanvas, nctx);
    particles = Array.from({ length: small ? 400 : 1100 }, (_, i) => Object.assign(spawn({}), { target: i }));
    pulses = [];
    buildNet();
  }
  function frame(t) {
    drawFlow(t);
    drawNet(t);
    if (running && !reduceMotion) raf = requestAnimationFrame(frame);
  }

  resize();
  raf = requestAnimationFrame(frame);

  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });

  const resume = () => { if (!running && !reduceMotion) { running = true; raf = requestAnimationFrame(frame); } };
  const pause = () => { running = false; cancelAnimationFrame(raf); };
  new IntersectionObserver(([e]) => (e.isIntersecting ? resume() : pause())).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden ? pause() : resume()));
})();

/* ---------- Hero: the example workflow runs itself, step by step ---------- */
(function demo() {
  const nodes = [...document.querySelectorAll('.flow .node')];
  const conns = [...document.querySelectorAll('.flow .conn')];
  const toast = document.querySelector('.toast');
  const runs = document.querySelector('.runs');
  const runsLabel = document.querySelector('.runs-l');
  const messages = ['Enquiry received', 'Lead added to Zoho CRM', 'AI reply sent to customer', 'Quote emailed with PDF', 'Dashboard refreshed'];

  if (reduceMotion) {
    nodes.forEach(n => n.classList.add('done'));
    conns.forEach(c => c.classList.add('on'));
    return;
  }

  let visible = true, count = 0;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(document.querySelector('.demo'));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const ready = async () => { while (!visible || document.hidden) await wait(500); };

  function say(text) {
    toast.classList.remove('show');
    setTimeout(() => { toast.textContent = text; toast.classList.add('show'); }, 180);
  }

  (async function loop() {
    await wait(1400); // let the page load in first
    for (;;) {
      for (let i = 0; i < nodes.length; i++) {
        await ready();
        nodes[i].classList.add('run');
        await wait(850);
        nodes[i].classList.replace('run', 'done');
        say(messages[i]);
        if (conns[i]) { conns[i].classList.add('on'); await wait(650); }
      }
      runs.textContent = ++count;
      runsLabel.textContent = count === 1 ? 'run' : 'runs';
      await wait(2600);
      nodes.forEach(n => n.classList.remove('done'));
      conns.forEach(c => c.classList.remove('on'));
      toast.classList.remove('show');
      await wait(700);
    }
  })();
})();

/* ---------- Scroll animations (GSAP) ---------- */
if (hasGSAP && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);

  // Fade-up reveals, batched so siblings stagger
  gsap.set('[data-reveal]', { opacity: 0, y: 40 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  // Intro statement: words light up as you scroll through it
  const stmt = document.querySelector('.stmt');
  const wrapWords = text => text.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  // split every word into its own span, keeping highlighted parts (like "I'm Akhil") styled
  stmt.innerHTML = [...stmt.childNodes].map(n =>
    n.nodeType === 3 ? wrapWords(n.textContent) : `<span class="${n.className}">${wrapWords(n.textContent)}</span>`
  ).join(' ');
  gsap.fromTo(stmt.querySelectorAll('.w'), { opacity: 0.16 }, {
    opacity: 1, stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: stmt, start: 'top 80%', end: 'bottom 45%', scrub: true },
  });

  // Stats count up
  document.querySelectorAll('[data-count]').forEach(el => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: +el.dataset.count, duration: 1.8, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: () => (el.textContent = Math.round(obj.v)),
    });
  });

  // Section headings: slight parallax on the serif word
  gsap.utils.toArray('h2 em').forEach(el => {
    gsap.fromTo(el, { yPercent: 10 }, {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // Process: line fills, current step lights up, big counter follows
  gsap.fromTo('.p-line span', { scaleY: 0 }, {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.p-steps', start: 'top 60%', end: 'bottom 60%', scrub: true },
  });
  // the active step is read from where the steps actually are on screen,
  // so it stays right even after the page above changes height
  const steps = gsap.utils.toArray('.p-step');
  const cur = document.querySelector('.p-cur');
  let active = 0, ticking = false;
  function updateStep() {
    ticking = false;
    const line = innerHeight * 0.62;
    let idx = 0;
    steps.forEach((s, i) => { if (s.getBoundingClientRect().top < line) idx = i; });
    if (idx === active) return;
    active = idx;
    steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    cur.textContent = String(idx + 1).padStart(2, '0');
    gsap.fromTo(cur, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: 'expo.out', overwrite: true });
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateStep); } }, { passive: true });
  updateStep();

  // keep every scroll animation in sync when the page height changes (expanded projects, images loading)
  let rt;
  new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 200); }).observe(document.body);

  // Big contact headline slides up line by line
  gsap.from('.contact-title .line > span', {
    yPercent: 105, duration: 1.3, ease: 'expo.out', stagger: 0.1,
    scrollTrigger: { trigger: '.contact-title', start: 'top 85%' },
  });

  // Hero demo starts tilted back and straightens up as you scroll toward it
  gsap.fromTo('.demo', { rotateX: 24, scale: 0.92 }, {
    rotateX: 0, scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.demo-wrap', start: 'top bottom', end: 'top 20%', scrub: true },
  });

  // Recalculate once fonts and logos have loaded
  addEventListener('load', () => ScrollTrigger.refresh());
} else {
  // without scroll animation every process step stays fully visible
  document.querySelectorAll('.p-step').forEach(s => s.classList.add('is-active'));
}
