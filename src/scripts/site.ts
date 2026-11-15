// Comportamiento global: animaciones de scroll, parallax, cursor, header,
// carruseles, galerías, barra de reservas y contador del carrito.
import { addItem, count } from './cart';

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

/* ---------- titulares por líneas ---------- */
function splitLines() {
  $$('[data-lines]:not([data-split])').forEach((el) => {
    el.setAttribute('data-split', '');
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map((p, i) => `<span class="ln" style="--i:${i}"><span>${p.trim()}</span></span>`).join('');
  });
}

/* ---------- aparición al hacer scroll ---------- */
let io: IntersectionObserver | undefined;
function reveals() {
  io?.disconnect();
  const els = $$('[data-reveal], [data-lines]');
  if (reduce() || !('IntersectionObserver' in window)) {
    els.forEach((e) => e.classList.add('is-in'));
    return;
  }
  io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io!.unobserve(en.target);
      }
    }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((e) => io!.observe(e));
}

/* ---------- parallax + header ---------- */
let parEls: HTMLElement[] = [];
let header: HTMLElement | null = null;
let lastY = 0;
let ticking = false;

function frame() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  if (header) {
    header.classList.toggle('is-solid', y > 40 || header.hasAttribute('data-solid'));
    const down = y > lastY && y > vh * 0.6;
    header.classList.toggle('is-hidden', down && !document.documentElement.classList.contains('menu-open'));
  }
  lastY = y;
  if (!reduce() && window.innerWidth > 720) {
    for (const el of parEls) {
      const host = el.parentElement!;
      const r = host.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      const speed = parseFloat(el.dataset.parallax || '0.12');
      const offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    }
  }
}
function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(frame);
  }
}

/* ---------- cursor ---------- */
let cursorReady = false;
let cursorStarted = false;
function cursor() {
  if (cursorReady || !fine()) return;
  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  const ring = document.querySelector<HTMLElement>('.cursor-ring');
  if (!dot || !ring) return;
  cursorReady = true;
  const root = document.documentElement;
  let mx = -100, my = -100, rx = -100, ry = -100, started = false;
  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
    requestAnimationFrame(loop);
  };
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!started) {
      started = true;
      cursorStarted = true;
      rx = mx; ry = my;
      root.classList.add('has-cursor');
      loop();
    }
    const t = e.target as Element | null;
    root.classList.toggle('cursor-hover', !!t?.closest?.('a, button, [role="button"], label, select, input, textarea, .carousel__track'));
    // sobre el mapa embebido el cursor propio no puede seguir al puntero
    root.classList.toggle('cursor-out', !!t?.closest?.('iframe'));
  }, { passive: true });
  window.addEventListener('mousedown', () => root.classList.add('cursor-down'));
  window.addEventListener('mouseup', () => root.classList.remove('cursor-down'));
  document.addEventListener('mouseleave', () => root.classList.add('cursor-out'));
  document.addEventListener('mouseenter', () => root.classList.remove('cursor-out'));
}

/* ---------- menú móvil ---------- */
function menu() {
  const root = document.documentElement;
  root.classList.remove('menu-open');
  const b = document.querySelector<HTMLButtonElement>('.burger');
  if (!b || b.dataset.on) return;
  b.dataset.on = '1';
  b.addEventListener('click', () => {
    const open = root.classList.toggle('menu-open');
    b.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && root.classList.remove('menu-open'));
}

/* ---------- carrusel ---------- */
function carousels() {
  $$('[data-carousel]').forEach((c) => {
    const track = c.querySelector<HTMLElement>('.carousel__track');
    if (!track || track.dataset.on) return;
    track.dataset.on = '1';
    const prev = c.querySelector<HTMLButtonElement>('[data-prev]');
    const next = c.querySelector<HTMLButtonElement>('[data-next]');
    const bar = c.querySelector<HTMLElement>('.carousel__bar i');
    const cnt = c.querySelector<HTMLElement>('.carousel__count');
    const cards = $$('.xcard', track);
    const step = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth);
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 1;
      if (bar) bar.style.transform = `scaleX(${Math.max(0.12, Math.min(1, track.clientWidth / track.scrollWidth + p * (1 - track.clientWidth / track.scrollWidth)))})`;
      if (prev) prev.disabled = track.scrollLeft < 8;
      if (next) next.disabled = track.scrollLeft > max - 8;
      if (cnt) {
        const i = Math.min(cards.length, Math.round(track.scrollLeft / step()) + 1);
        cnt.textContent = `${String(i).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
      }
    };
    prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    // arrastre con mouse
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
    window.addEventListener('pointerup', () => { if (down) { down = false; track.style.scrollSnapType = ''; } });
    track.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 6) { moved = true; track.style.scrollSnapType = 'none'; track.scrollLeft = sl - dx; }
    });
    track.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    track.addEventListener('dragstart', (e) => e.preventDefault());
    update();
  });
}

/* ---------- galerías ---------- */
function galleries() {
  $$('[data-gallery]').forEach((g) => {
    if (g.dataset.on) return;
    g.dataset.on = '1';
    const slides = $$('.gal__s', g);
    const thumbs = $$('.thumbs button', g);
    const cnt = g.querySelector<HTMLElement>('.gal__ui span');
    let i = 0;
    const go = (n: number) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-on', k === i));
      thumbs.forEach((t, k) => t.classList.toggle('is-on', k === i));
      if (cnt) cnt.textContent = `${String(i + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    };
    g.querySelector('[data-prev]')?.addEventListener('click', () => go(i - 1));
    g.querySelector('[data-next]')?.addEventListener('click', () => go(i + 1));
    thumbs.forEach((t, k) => t.addEventListener('click', () => go(k)));
    let tx = 0;
    g.addEventListener('touchstart', (e) => (tx = e.touches[0].clientX), { passive: true });
    g.addEventListener('touchend', (e) => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 40) go(i + (d < 0 ? 1 : -1)); }, { passive: true });
    go(0);
  });
}

/* ---------- barra de reservas del hotel ---------- */
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const nice = (s: string) => { const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };
function booking() {
  $$<HTMLFormElement>('form[data-booking]').forEach((f) => {
    if (f.dataset.on) return;
    f.dataset.on = '1';
    const cin = f.querySelector<HTMLInputElement>('[name=checkin]')!;
    const cout = f.querySelector<HTMLInputElement>('[name=checkout]')!;
    const msg = f.querySelector<HTMLElement>('.booking__msg')!;
    const today = new Date();
    cin.min = iso(today);
    cout.min = iso(new Date(today.getTime() + 864e5));
    cin.addEventListener('change', () => {
      if (!cin.value) return;
      const next = iso(new Date(new Date(cin.value + 'T12:00').getTime() + 864e5));
      cout.min = next;
      if (!cout.value || cout.value <= cin.value) cout.value = next;
    });
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const say = (html: string) => { msg.innerHTML = html; msg.classList.add('is-open'); };
      if (!cin.value || !cout.value) return say('Elegí las fechas de check-in y check-out para buscar disponibilidad.');
      if (cout.value <= cin.value) return say('La fecha de check-out debe ser posterior al check-in.');
      const adults = (f.querySelector<HTMLSelectElement>('[name=adults]')!).value;
      const rooms = (f.querySelector<HTMLSelectElement>('[name=rooms]')!).value;
      const engine = f.dataset.engine || '';
      if (engine) {
        // Parámetros genéricos: se ajustan al formato del motor que se integre.
        const url = new URL(engine);
        url.searchParams.set('checkin', cin.value);
        url.searchParams.set('checkout', cout.value);
        url.searchParams.set('adults', adults);
        url.searchParams.set('rooms', rooms);
        window.location.href = url.toString();
        return;
      }
      const text = `Hola, quiero consultar disponibilidad en Blank Hotel Recoleta.\nCheck-in: ${nice(cin.value)}\nCheck-out: ${nice(cout.value)}\nHuéspedes: ${adults}\nHabitaciones: ${rooms}`;
      say(`La reserva online estará disponible próximamente. Mientras tanto, <a href="https://wa.me/${f.dataset.wa}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">consultá estas fechas por WhatsApp</a>.`);
    });
  });
  // los botones "Reservar" llevan a la barra de búsqueda
}

/* ---------- añadir al carrito ---------- */
let toastTimer = 0;
function toast(text: string) {
  const t = document.querySelector<HTMLElement>('.toast');
  if (!t) return;
  t.querySelector('span')!.textContent = text;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.remove('is-on'), 4200);
}
document.addEventListener('click', (e) => {
  const b = (e.target as Element).closest<HTMLElement>('[data-add]');
  if (!b) return;
  e.preventDefault();
  const d = b.dataset;
  addItem({ slug: d.add!, variantId: d.variant || undefined, qty: Number(d.qty || 1), date: d.date || undefined, people: d.people ? Number(d.people) : undefined });
  toast(`${d.name} se añadió al carrito.`);
});

/* ---------- carrito (contador) ---------- */
function cartBadge() {
  const n = count();
  $$('[data-cart-count]').forEach((e) => (e.textContent = String(n)));
}

function init() {
  document.documentElement.classList.add('js');
  header = document.querySelector('.header');
  splitLines();
  reveals();
  parEls = $$('[data-parallax]');
  menu();
  carousels();
  galleries();
  booking();
  cartBadge();
  cursor();
  if (cursorStarted) document.documentElement.classList.add('has-cursor');
  lastY = window.scrollY;
  frame();
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
document.addEventListener('cart:change', cartBadge);
document.addEventListener('astro:page-load', init);
