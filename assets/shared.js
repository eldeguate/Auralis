// AURALIS — shared JS: nav, footer, wave mark, scroll reveal

const WAVE_MARK = `
<svg class="wave-mark mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
  <rect x="1.5" y="1.5" width="37" height="37" rx="7" stroke="currentColor" stroke-width="1.6" fill="none"/>
  <path d="M8 15 Q14 11 20 15 T32 15" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M8 21 Q14 17 20 21 T32 21" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <path d="M8 27 Q14 23 20 27 T32 27" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>
</svg>`;

function renderNav(active) {
  const pages = [
    { href: 'story.html', label: 'Our Story', key: 'story' },
    { href: 'wood.html', label: 'The Wood', key: 'wood' },
    { href: 'collection.html', label: 'Collection', key: 'collection' },
    { href: 'contact.html', label: 'Contact', key: 'contact' },
  ];
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML = `
    <a href="index.html" class="nav-brand" style="color: var(--teal-deep);">
      ${WAVE_MARK}
      <span class="name" style="color: var(--slate);">AURALIS</span>
    </a>
    <button class="nav-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
    <div class="nav-links">
      ${pages.map(p => `<a href="${p.href}" class="${active===p.key?'active':''}">${p.label}</a>`).join('')}
      <a href="consultation.html" class="nav-cta ${active==='consult'?'active':''}">Find Your Sound</a>
    </div>
  `;
  document.body.prepend(nav);

  const toggle = nav.querySelector('.nav-toggle');
  toggle.addEventListener('click', () => nav.classList.toggle('open'));

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand" style="color: var(--teal);">
        ${WAVE_MARK.replace('class="wave-mark mark"','class="wave-mark mark" style="color: var(--teal);"')}
        <div class="name">AURALIS</div>
        <p>Handcrafted in Antigua Guatemala. Shipped worldwide. Each pair built to order over six to eight weeks.</p>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <ul>
          <li><a href="story.html">Our Story</a></li>
          <li><a href="wood.html">The Wood</a></li>
          <li><a href="collection.html">Collection</a></li>
          <li><a href="consultation.html">Find Your Sound</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Connect</h4>
        <ul>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="contact.html#visit">Workshop visit</a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">YouTube</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Studio</h4>
        <ul>
          <li>5a Avenida Norte 12</li>
          <li>Antigua Guatemala</li>
          <li>hola@auralis.gt</li>
          <li>+502 7832 0000</li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 AURALIS BESPOKE HI-FI SPEAKERS</span>
      <span>EACH PAIR BUILT TO ORDER · MADE IN GUATEMALA</span>
    </div>
  `;
  document.body.appendChild(footer);
}

function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  // Immediately reveal anything already in viewport on load
  const inView = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  };
  els.forEach(el => { if (inView(el)) el.classList.add('in'); });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => { if (!el.classList.contains('in')) io.observe(el); });

  // Fallback: anything still unrevealed after 1.2s gets revealed
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
  }, 1200);
}

function initPage(active) {
  renderNav(active);
  renderFooter();
  setupReveal();
}

window.AURALIS = { WAVE_MARK, initPage };
