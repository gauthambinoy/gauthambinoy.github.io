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
   CURSOR
   =================================================== */
const dot = document.getElementById('cursor-dot');
const circle = document.getElementById('cursor-circle');
const trailCanvas = document.getElementById('cursor-trail');
const trailCtx = trailCanvas.getContext('2d');

let mx = 0, my = 0, cx = 0, cy = 0;
const trail = [];

function resizeTrail() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
}
resizeTrail();
window.addEventListener('resize', resizeTrail);

document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    trail.push({ x: mx, y: my, life: 1 });
    if (trail.length > 40) trail.shift();
});

function animateCursor() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    circle.style.left = cx + 'px';
    circle.style.top = cy + 'px';

    // Trail
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    const theme = document.documentElement.getAttribute('data-theme');
    const rgb = theme === 'light' ? '68,0,255' : '200,255,0';

    trail.forEach((p) => {
        p.life -= 0.025;
        if (p.life <= 0) return;
        trailCtx.beginPath();
        trailCtx.arc(p.x, p.y, p.life * 6, 0, Math.PI * 2);
        trailCtx.fillStyle = `rgba(${rgb},${p.life * 0.3})`;
        trailCtx.fill();
    });
    while (trail.length && trail[0].life <= 0) trail.shift();

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover states
document.querySelectorAll('a, button, .skill-pill, .project-panel, .contact-pill').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
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
