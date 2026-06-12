
/* ============================================================
   CONFIGURAÇÕES — EDITE AQUI
   ============================================================ */

// TROQUE pela data real do relacionamento (formato "YYYY-MM-DD")
const START_DATE = "2024-06-12";

/* ============================================================
   CORAÇÕES DE FUNDO
   ============================================================ */
(function createBackgroundHearts() {
  const container = document.getElementById('heartsBg');
  const count = 35;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.classList.add('bg-heart');

    const size    = Math.random() * 18 + 8;   // 8px – 26px
    const left    = Math.random() * 100;
    const top     = Math.random() * 100;
    const dur     = Math.random() * 8 + 6;    // 6s – 14s
    const delay   = -(Math.random() * dur);   // iniciar em fases diferentes

    heart.style.setProperty('--size',     size + 'px');
    heart.style.setProperty('--duration', dur + 's');
    heart.style.setProperty('--delay',    delay + 's');
    heart.style.left = left + '%';
    heart.style.top  = top + '%';

    container.appendChild(heart);
  }
})();

/* Efeito ao tocar / clicar na tela */
(function heartTouchEffect() {
  const hearts = () => document.querySelectorAll('.bg-heart');

  function touchEffect(x, y) {
    hearts().forEach(h => {
      const rect = h.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const dist = Math.hypot(x - cx, y - cy);

      if (dist < 180) {
        h.classList.add('touched');
        setTimeout(() => h.classList.remove('touched'), 900);
      }
    });
  }

  document.addEventListener('click',     e => touchEffect(e.clientX, e.clientY));
  document.addEventListener('touchstart', e => {
    const t = e.touches[0];
    touchEffect(t.clientX, t.clientY);
  }, { passive: true });
})();

/* ============================================================
   BOTÃO COMEÇAR — SCROLL SUAVE
   ============================================================ */
document.getElementById('btnStart').addEventListener('click', () => {
  document.getElementById('playerSection').scrollIntoView({ behavior: 'smooth' });
});

/* ============================================================
   PLAYER DE MÚSICA
   ============================================================ */
(function initPlayer() {
  const audio        = document.getElementById('audioPlayer');
  const btnPlay      = document.getElementById('btnPlay');
  const iconPlay     = document.getElementById('iconPlay');
  const iconPause    = document.getElementById('iconPause');
  const albumImg     = document.getElementById('albumImg');
  const progressFill = document.getElementById('progressFill');
  const progressThumb= document.getElementById('progressThumb');
  const progressBar  = document.getElementById('progressBar');
  const currentTime  = document.getElementById('currentTime');
  const totalTime    = document.getElementById('totalTime');
  const playerCard   = document.getElementById('playerCard');

  let isPlaying = false;

  /* Formata segundos → m:ss */
  function fmtTime(s) {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  /* Atualiza barra de progresso */
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width  = pct + '%';
    progressThumb.style.left  = pct + '%';
    currentTime.textContent   = fmtTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    totalTime.textContent = fmtTime(audio.duration);
  });

  /* Clique na barra de progresso */
  progressBar.addEventListener('click', e => {
    const rect = progressBar.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  /* Play / Pause */
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      iconPlay.style.display  = '';
      iconPause.style.display = 'none';
      albumImg.classList.remove('spinning');
      playerCard.classList.remove('glowing');
    } else {
      audio.play().catch(() => {});
      isPlaying = true;
      iconPlay.style.display  = 'none';
      iconPause.style.display = '';
      albumImg.classList.add('spinning');
      playerCard.classList.add('glowing');
    }
  }

  btnPlay.addEventListener('click', togglePlay);

  audio.addEventListener('ended', () => {
    isPlaying = false;
    iconPlay.style.display  = '';
    iconPause.style.display = 'none';
    albumImg.classList.remove('spinning');
    playerCard.classList.remove('glowing');
    progressFill.style.width = '0%';
    progressThumb.style.left = '0%';
    currentTime.textContent  = '0:00';
  });
})();

/* ============================================================
   EFEITO DE DIGITAÇÃO — MENSAGEM DE AMOR
   ============================================================ */
(function initTypingEffect() {
  const fullText = `Desde que você entrou na minha vida, os dias ficaram mais leves, os sorrisos mais sinceros e os sonhos mais bonitos.\n\nCada momento ao seu lado se tornou uma memória que guardo com carinho.\n\nEste site é apenas uma pequena forma de mostrar o quanto você é importante para mim e o quanto sou feliz por ter você comigo.\n\nEu te amo mais do que qualquer texto seria capaz de explicar.`;

  const el     = document.getElementById('loveText');
  const cursor = document.getElementById('loveCursor');
  let started  = false;
  let idx      = 0;
  const SPEED  = 28; // ms por caractere

  function typeNext() {
    if (idx < fullText.length) {
      el.textContent += fullText[idx];
      idx++;
      setTimeout(typeNext, SPEED);
    } else {
      cursor.style.display = 'none';
    }
  }

  // Dispara quando a seção entra na tela
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        setTimeout(typeNext, 400);
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  obs.observe(document.getElementById('loveSection'));
})();

/* ============================================================
   LAZY LOADING DAS IMAGENS
   ============================================================ */
(function lazyLoadImages() {
  const imgs = document.querySelectorAll('img[data-src]');

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });

  imgs.forEach(img => obs.observe(img));
})();

/* ============================================================
   INTERSECTION OBSERVER — ANIMAÇÕES FADE-IN-UP
   ============================================================ */
(function initFadeInUp() {
  const els = document.querySelectorAll('.fade-in-up');

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Aplica delay escalonado para listas de cards
        const delay = entry.target.closest('.gallery-grid, .timeline')
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 120
          : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => obs.observe(el));
})();

/* ============================================================
   CONTADOR DE TEMPO JUNTOS
   ============================================================ */
(function initCounter() {
  const start = new Date(START_DATE + 'T00:00:00');

  function update() {
    const now   = new Date();
    const diff  = Math.max(0, now - start);
    const secs  = Math.floor(diff / 1000);
    const mins  = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);

    document.getElementById('cDays').textContent    = days;
    document.getElementById('cHours').textContent   = hours % 24;
    document.getElementById('cMinutes').textContent = mins  % 60;
    document.getElementById('cSeconds').textContent = secs  % 60;
  }

  update();
  setInterval(update, 1000);
})();

/* ============================================================
   EFEITO FINAL — CHUVA DE CORAÇÕES
   ============================================================ */
(function initFinalEffect() {
  const section    = document.getElementById('finalSection');
  const rainContainer = document.getElementById('finalHeartsRain');
  let created = false;

  function createRain() {
    if (created) return;
    created = true;

    for (let i = 0; i < 28; i++) {
      const h = document.createElement('div');
      h.classList.add('rain-heart');

      const size  = Math.random() * 16 + 8;
      const left  = Math.random() * 100;
      const dur   = Math.random() * 5 + 4;
      const delay = -(Math.random() * dur);

      h.style.setProperty('--size',  size + 'px');
      h.style.setProperty('--left',  left + '%');
      h.style.setProperty('--dur',   dur  + 's');
      h.style.setProperty('--delay', delay + 's');

      rainContainer.appendChild(h);
    }

    // Escurece o fundo levemente
    section.style.background =
      'radial-gradient(ellipse at center, rgba(193,18,31,0.18) 0%, rgba(0,0,0,0.6) 100%)';
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        createRain();
      }
    });
  }, { threshold: 0.25 });

  obs.observe(section);
})();
