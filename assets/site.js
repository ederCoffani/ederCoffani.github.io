// Menu do celular, seletor de idioma que mantém a seção, galeria de telas e ampliação.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // tema claro/escuro
  const tema = $('.tema');
  if (tema) tema.addEventListener('click', () => {
    const novo = document.documentElement.getAttribute('data-tema') === 'escuro' ? 'claro' : 'escuro';
    document.documentElement.setAttribute('data-tema', novo);
    try { localStorage.setItem('tema', novo); } catch (e) { /* sem armazenamento: vale só nesta visita */ }
  });

  // menu
  const bt = $('.abre-menu'), menu = $('#menu');
  if (bt && menu) {
    bt.addEventListener('click', () => {
      const aberto = menu.classList.toggle('aberto');
      bt.setAttribute('aria-expanded', aberto);
    });
    $$('a', menu).forEach(a => a.addEventListener('click', () => { menu.classList.remove('aberto'); bt.setAttribute('aria-expanded', 'false'); }));
  }

  // seção visível (para o menu e para trocar de idioma no mesmo lugar)
  const secoes = $$('main section[id], article.projeto[id]');
  let atual = location.hash.slice(1) || '';
  const marca = () => {
    const y = window.scrollY + window.innerHeight * 0.3;
    let id = '';
    for (const s of secoes) if (s.getBoundingClientRect().top + window.scrollY <= y) id = s.id;
    atual = id === 'inicio' ? '' : id;
    const sec = atual && document.getElementById(atual);
    const raiz = sec && sec.closest('section[id]');
    $$('.menu a').forEach(a => a.classList.toggle('ativo', !!raiz && a.getAttribute('href') === '#' + raiz.id));
  };
  window.addEventListener('scroll', () => requestAnimationFrame(marca), { passive: true });
  marca();
  $$('[data-idioma]').forEach(a => a.addEventListener('click', ev => {
    try { localStorage.setItem('idioma', a.getAttribute('href').replace(/\//g, '')); } catch (e) { /* sem armazenamento: tudo bem */ }
    if (a.classList.contains('atual')) { ev.preventDefault(); return; }
    if (atual) { ev.preventDefault(); location.href = a.getAttribute('href') + '#' + atual; }
  }));

  // galeria
  $$('.galeria').forEach(g => {
    const img = $('.tela img', g);
    $$('.mini', g).forEach(m => m.addEventListener('click', () => {
      $$('.mini', g).forEach(x => x.classList.remove('ativa'));
      m.classList.add('ativa');
      img.style.opacity = 0;
      const nova = new Image();
      nova.onload = () => { img.src = m.dataset.src; img.alt = m.dataset.alt; img.style.opacity = 1; };
      nova.src = m.dataset.src;
    }));
  });

  // ampliar
  const lupa = $('#lupa');
  if (lupa && lupa.showModal) {
    const foto = $('img', lupa);
    $$('.tela').forEach(t => t.addEventListener('click', () => {
      const i = $('img', t); foto.src = i.src; foto.alt = i.alt; lupa.showModal();
    }));
    $('.fecha', lupa).addEventListener('click', () => lupa.close());
    lupa.addEventListener('click', ev => { if (ev.target === lupa) lupa.close(); });
  }
})();
