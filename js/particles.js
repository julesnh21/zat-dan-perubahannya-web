const canvas = document.querySelector('#particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const buttons = [...document.querySelectorAll('[data-state]')];
  const speedInput = document.querySelector('#modelSpeed');
  const speedValue = document.querySelector('#speedValue');
  const states = {
    solid: ['Padat', 'Partikel sangat berdekatan dan hanya bergetar di sekitar posisi tetap.'],
    liquid: ['Cair', 'Partikel tetap berdekatan, tetapi dapat berpindah posisi satu sama lain.'],
    gas: ['Gas', 'Partikel berjauhan dan bergerak bebas memenuhi ruang tersedia.']
  };
  const count = 45;
  let mode = 'solid', particles = [], width = 0, height = 0;
  let speed = 1, modelTime = 0, lastTime = null, accumulator = 0;
  const radius = 8;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function bounds() {
    return { left: 28, right: width - 28,
      top: mode === 'liquid' ? height * 0.66 : 28, bottom: height - 28 };
  }

  function resetParticles() {
    modelTime = 0;
    accumulator = 0;
    lastTime = null;
    const box = bounds();
    const cols = 9, rows = Math.ceil(count / cols);
    const spacing = Math.min(22, (width - 64) / (cols - 1));
    particles = Array.from({ length: count }, (_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const angle = Math.random() * Math.PI * 2;
      const velocity = mode === 'gas' ? 90 : 25;
      return {
        x: mode === 'solid' ? width / 2 + (col - 4) * spacing
          : box.left + (col + 0.25 + Math.random() * 0.5) / cols * (box.right - box.left),
        y: mode === 'solid' ? height * 0.65 + (row - 2) * spacing
          : box.top + (row + 0.25 + Math.random() * 0.5) / rows * (box.bottom - box.top),
        vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity,
        phase: Math.random() * Math.PI * 2
      };
    });
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const oldBox = bounds();
    const oldWidth = width;
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!oldWidth || mode === 'solid') resetParticles();
    else {
      const box = bounds();
      particles.forEach(p => {
        p.x = box.left + (p.x - oldBox.left) / (oldBox.right - oldBox.left) * (box.right - box.left);
        p.y = box.top + (p.y - oldBox.top) / (oldBox.bottom - oldBox.top) * (box.bottom - box.top);
      });
    }
    lastTime = null;
  }

  function contain(p, box) {
    if (p.x < box.left || p.x > box.right) {
      p.vx = p.x < box.left ? Math.abs(p.vx) : -Math.abs(p.vx);
      p.x = clamp(p.x, box.left, box.right);
    }
    if (p.y < box.top || p.y > box.bottom) {
      p.vy = p.y < box.top ? Math.abs(p.vy) : -Math.abs(p.vy);
      p.y = clamp(p.y, box.top, box.bottom);
    }
  }

  function advance(dt) {
    modelTime += dt;
    if (mode === 'solid') return;
    const box = bounds();
    particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      contain(p, box);
    });
    // Short-range separation lets the dense liquid rearrange without piling up.
    // This is a conceptual motion model, not a molecular dynamics calculation.
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= radius * 2) continue;
        const nx = distance ? dx / distance : 1;
        const ny = distance ? dy / distance : 0;
        const overlap = (radius * 2 - distance) / 2;
        a.x -= nx * overlap; a.y -= ny * overlap;
        b.x += nx * overlap; b.y += ny * overlap;
        const approach = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (approach > 0) {
          a.vx -= approach * nx; a.vy -= approach * ny;
          b.vx += approach * nx; b.vy += approach * ny;
        }
      }
    }
    particles.forEach(p => contain(p, box));
  }

  function draw(timestamp) {
    // Cap elapsed time after a background tab; substeps keep collisions stable.
    const elapsed = lastTime === null ? 0 : Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    const step = 1 / 120;
    accumulator += elapsed * speed;
    while (accumulator + 1e-10 >= step) {
      advance(step);
      accumulator = Math.max(0, accumulator - step);
    }
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(130,200,245,.28)';
    ctx.strokeRect(18, 18, width - 36, height - 36);
    particles.forEach(p => {
      const x = p.x + (mode === 'solid' ? Math.sin(modelTime * 5 + p.phase) * 1.5 : 0);
      const y = p.y + (mode === 'solid' ? Math.cos(modelTime * 6 + p.phase) * 1.5 : 0);
      const gradient = ctx.createRadialGradient(x - 3, y - 3, 1, x, y, radius);
      gradient.addColorStop(0, '#d9fbff');
      gradient.addColorStop(0.45, '#57c8e5');
      gradient.addColorStop(1, '#1769aa');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  function setMode(nextMode) {
    if (!states[nextMode]) return;
    mode = nextMode;
    buttons.forEach(button => {
      const selected = button.dataset.state === mode;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    document.querySelector('#stateTitle').textContent = states[mode][0];
    document.querySelector('#stateDesc').textContent = states[mode][1];
    resetParticles();
  }

  function updateSpeed() {
    speed = Number(speedInput.value);
    speedValue.value = `${speed.toFixed(2).replace('.', ',')}×`;
    speedInput.setAttribute('aria-valuetext', `${speedValue.value} kecepatan animasi`);
  }
  buttons.forEach(button => button.addEventListener('click', () => setMode(button.dataset.state)));
  speedInput.addEventListener('input', updateSpeed);
  document.querySelector('#resetModel').addEventListener('click', () => {
    speedInput.value = '1';
    updateSpeed();
    setMode('solid');
  });
  document.addEventListener('visibilitychange', () => { lastTime = null; });
  window.addEventListener('resize', resize);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(canvas);
  updateSpeed();
  resize();
  requestAnimationFrame(draw);
}
