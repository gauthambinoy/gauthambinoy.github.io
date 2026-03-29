/* ===================================================
   SPLITTING.JS — Initialize text splitting
   =================================================== */
Splitting();

/* ===================================================
   LENIS — Smooth scroll
   =================================================== */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ===================================================
   PRELOADER — Count up then clip away
   =================================================== */
const preloaderEl = document.getElementById('preloader');
const counterEl = document.getElementById('preloader-counter');
let count = 0;

const preloadInterval = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 2;
    if (count >= 100) {
        count = 100;
        clearInterval(preloadInterval);
        counterEl.textContent = 100;
        setTimeout(() => {
            preloaderEl.classList.add('done');
            // Animate hero text in after preloader
            setTimeout(triggerHeroReveal, 600);
        }, 400);
    }
    counterEl.textContent = count;
}, 40);

function triggerHeroReveal() {
    document.querySelectorAll('.hero [data-splitting]').forEach((el, i) => {
        setTimeout(() => el.classList.add('is-visible'), i * 150);
    });
}

/* ===================================================
   CURSOR — Mind-blowing edition
   =================================================== */
const dot = document.getElementById('cursor-dot');
const circle = document.getElementById('cursor-circle');
const cursorLabel = document.getElementById('cursor-label');
const spotlight = document.getElementById('cursor-spotlight');
const trailCanvas = document.getElementById('cursor-trail');
const trailCtx = trailCanvas.getContext('2d');

let mx = 0, my = 0;       // actual mouse
let dx = 0, dy = 0;       // dot (lerped)
let cx = 0, cy = 0;       // circle (slower lerp)
let lx = 0, ly = 0;       // label
let prevMx = 0, prevMy = 0;
let velocity = 0;

// Trail history — 60 points for comet tail
const trail = [];
const TRAIL_LENGTH = 60;

function resizeTrail() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
}
resizeTrail();
window.addEventListener('resize', resizeTrail);

document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;

    // Spotlight follows mouse
    spotlight.style.background = `radial-gradient(600px circle at ${mx}px ${my}px, rgba(200,255,0,0.03), transparent 60%)`;
    if (document.documentElement.getAttribute('data-theme') === 'light') {
        spotlight.style.background = `radial-gradient(600px circle at ${mx}px ${my}px, rgba(68,0,255,0.025), transparent 60%)`;
    }
});

// Click burst particles
document.addEventListener('click', (e) => {
    for (let i = 0; i < 8; i++) {
        const burst = document.createElement('div');
        burst.className = 'click-burst';
        burst.style.left = e.clientX + 'px';
        burst.style.top = e.clientY + 'px';
        // Random direction offset
        const angle = (Math.PI * 2 / 8) * i;
        const dist = 20 + Math.random() * 30;
        burst.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
        burst.style.setProperty('--by', Math.sin(angle) * dist + 'px');
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 600);
    }
});

function animateCursor() {
    // Calculate velocity
    const dvx = mx - prevMx;
    const dvy = my - prevMy;
    velocity = Math.sqrt(dvx * dvx + dvy * dvy);
    prevMx = mx;
    prevMy = my;

    // Dot follows with fast lerp
    dx += (mx - dx) * 0.2;
    dy += (my - dy) * 0.2;

    // Velocity-based stretch — skew the dot based on movement direction
    const angle = Math.atan2(dvy, dvx) * (180 / Math.PI);
    const stretch = Math.min(velocity * 0.5, 20);
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';
    dot.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scaleX(${1 + stretch * 0.02}) scaleY(${1 - stretch * 0.01})`;

    // Circle follows slower
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    circle.style.left = cx + 'px';
    circle.style.top = cy + 'px';

    // Label follows even slower for nice lag
    lx += (mx - lx) * 0.12;
    ly += (my - ly) * 0.12;
    cursorLabel.style.left = lx + 'px';
    cursorLabel.style.top = (ly - 45) + 'px';

    // Push to trail
    trail.push({ x: dx, y: dy, vx: dvx, vy: dvy });
    if (trail.length > TRAIL_LENGTH) trail.shift();

    // Draw comet trail
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    const theme = document.documentElement.getAttribute('data-theme');

    if (trail.length > 2) {
        // Main gradient trail
        for (let i = 1; i < trail.length; i++) {
            const p = trail[i];
            const prev = trail[i - 1];
            const t = i / trail.length; // 0 to 1

            // Color shifts along trail: accent -> accent2
            let r, g, b;
            if (theme === 'light') {
                r = Math.round(68 + (0 - 68) * t);
                g = Math.round(0 + (102 - 0) * t);
                b = Math.round(255 + (255 - 255) * t);
            } else {
                r = Math.round(0 + (200 - 0) * t);
                g = Math.round(240 + (255 - 240) * t);
                b = Math.round(255 + (0 - 255) * t);
            }

            const alpha = t * 0.4;
            const width = t * 5 + 0.5;

            trailCtx.beginPath();
            trailCtx.moveTo(prev.x, prev.y);
            trailCtx.lineTo(p.x, p.y);
            trailCtx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            trailCtx.lineWidth = width;
            trailCtx.lineCap = 'round';
            trailCtx.stroke();
        }

        // Glow particles along trail
        for (let i = 0; i < trail.length; i += 3) {
            const p = trail[i];
            const t = i / trail.length;
            const rgb = theme === 'light' ? '68,0,255' : '200,255,0';
            const size = t * 3;
            const alpha = t * 0.25;

            trailCtx.beginPath();
            trailCtx.arc(p.x, p.y, size, 0, Math.PI * 2);
            trailCtx.fillStyle = `rgba(${rgb},${alpha})`;
            trailCtx.fill();

            // Outer glow
            trailCtx.beginPath();
            trailCtx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
            trailCtx.fillStyle = `rgba(${rgb},${alpha * 0.15})`;
            trailCtx.fill();
        }
    }

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Activate spotlight
spotlight.classList.add('active');

// Hover states — with smart labels
const hoverTargets = document.querySelectorAll('a, button, .skill-pill, .project-panel, .contact-pill, .project-img-inner');
hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-active');
        const label = el.getAttribute('data-cursor') || el.closest('[data-cursor]')?.getAttribute('data-cursor');
        if (label) {
            cursorLabel.textContent = label;
            cursorLabel.classList.add('visible');
        }
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
        cursorLabel.classList.remove('visible');
    });
});

/* ===================================================
   THEME
   =================================================== */
const themeBtn = document.getElementById('theme-btn');
document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');

themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

/* ===================================================
   NAV
   =================================================== */
const burger = document.getElementById('nav-burger');
const menuOverlay = document.getElementById('menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menuOverlay.classList.toggle('open');
    if (menuOverlay.classList.contains('open')) {
        lenis.stop();
    } else {
        lenis.start();
    }
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        menuOverlay.classList.remove('open');
        lenis.start();
    });
});

/* Smooth scroll for anchors */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: -80 });
    });
});

/* ===================================================
   GSAP + ScrollTrigger — Scroll animations
   =================================================== */
gsap.registerPlugin(ScrollTrigger);

// Fade-up elements
document.querySelectorAll('.fade-up').forEach(el => {
    gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
});

// Split text reveals on scroll
document.querySelectorAll('.section [data-splitting]').forEach(el => {
    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => el.classList.add('is-visible'),
    });
});

/* ===================================================
   HORIZONTAL SCROLL — Projects
   =================================================== */
const workTrack = document.getElementById('work-track');
if (workTrack) {
    const totalScroll = workTrack.scrollWidth - window.innerWidth;

    gsap.to(workTrack, {
        x: () => -totalScroll,
        ease: 'none',
        scrollTrigger: {
            trigger: '.work-horizontal',
            start: 'top top',
            end: () => `+=${totalScroll}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
        }
    });
}

/* ===================================================
   MARQUEE — Scroll-velocity driven
   =================================================== */
const marqueeTrack = document.getElementById('marquee-1');
let marqueeX = 0;
let scrollVelocity = 0;

lenis.on('scroll', ({ velocity }) => { scrollVelocity = velocity; });

gsap.ticker.add(() => {
    const speed = 0.5 + Math.abs(scrollVelocity) * 0.15;
    marqueeX -= speed;
    if (marqueeX < -(marqueeTrack.scrollWidth / 2)) marqueeX = 0;
    gsap.set(marqueeTrack, { x: marqueeX });
});

/* ===================================================
   STAT COUNTERS
   =================================================== */
document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
            gsap.to({ val: 0 }, {
                val: target, duration: 1.5, ease: 'power2.out',
                onUpdate: function () { el.textContent = Math.round(this.targets()[0].val); }
            });
        }
    });
});

/* ===================================================
   MAGNETIC ELEMENTS
   =================================================== */
document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    });
});

/* ===================================================
   SKILL PILL SCRAMBLE
   =================================================== */
document.querySelectorAll('.skill-pill').forEach(pill => {
    const original = pill.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567@#';
    pill.addEventListener('mouseenter', () => {
        let iter = 0;
        const iv = setInterval(() => {
            pill.textContent = original.split('').map((c, i) =>
                i < iter ? original[i] : chars[Math.floor(Math.random() * chars.length)]
            ).join('');
            iter += 0.5;
            if (iter >= original.length) { pill.textContent = original; clearInterval(iv); }
        }, 25);
    });
});

/* ===================================================
   3D TILT — Project images
   =================================================== */
document.querySelectorAll('.project-img').forEach(img => {
    img.addEventListener('mousemove', (e) => {
        const rect = img.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(img, {
            rotateY: x * 15, rotateX: -y * 15, scale: 1.02,
            duration: 0.4, ease: 'power2.out',
            transformPerspective: 800,
        });
    });
    img.addEventListener('mouseleave', () => {
        gsap.to(img, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: 'power2.out' });
    });
});

/* ===================================================
   VIDEO BG — Cycle aurora clips
   =================================================== */
const bgVideo = document.getElementById('bg-video');
const videos = ['assets/aurora1.mp4', 'assets/aurora_dawn.mp4', 'assets/aurora3.mp4', 'assets/aurora_timelapse.mp4', 'assets/aurora2.mp4'];
let vidIdx = 0;

bgVideo.addEventListener('ended', () => {
    vidIdx = (vidIdx + 1) % videos.length;
    bgVideo.style.opacity = '0';
    setTimeout(() => {
        bgVideo.src = videos[vidIdx];
        bgVideo.load();
        bgVideo.play();
        bgVideo.style.opacity = '1';
    }, 500);
});
bgVideo.style.transition = 'opacity 0.8s ease';
