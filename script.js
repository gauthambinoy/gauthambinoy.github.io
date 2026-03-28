/* ============================================
   PRELOADER
   ============================================ */
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('hidden');
        // Trigger hero reveals
        document.querySelectorAll('.hero .reveal').forEach((el, i) => {
            setTimeout(() => el.classList.add('active'), i * 120);
        });
    }, 1800);
});

/* ============================================
   PARTICLE SYSTEM
   ============================================ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: 0, y: 0 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            const force = (120 - dist) / 120;
            this.x += (dx / dist) * force * 2;
            this.y += (dy / dist) * force * 2;
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        const theme = document.documentElement.getAttribute('data-theme');
        const color = theme === 'light' ? '0,102,255' : '0,240,255';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function drawConnections() {
    const theme = document.documentElement.getAttribute('data-theme');
    const color = theme === 'light' ? '0,102,255' : '0,240,255';

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${color},${0.06 * (1 - dist / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

const hoverTargets = document.querySelectorAll('a, button, .skill-tag, .project-card, .stat-item, .timeline-content, .contact-link-item');
hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ============================================
   THEME TOGGLE
   ============================================ */
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

/* ============================================
   BACK TO TOP
   ============================================ */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   NAVIGATION
   ============================================ */
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

/* ============================================
   TYPING EFFECT
   ============================================ */
const typingEl = document.getElementById('typing-text');
const phrases = [
    'Full Stack Developer',
    'AI / ML Engineer',
    'Cloud & Security Enthusiast',
    'Open Source Contributor',
    'Building the future, one commit at a time.'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 60;

function typeEffect() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 30;
    } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 60;
    }

    if (!isDeleting && charIndex === current.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
}

setTimeout(typeEffect, 2200);

/* ============================================
   REVEAL ON SCROLL
   ============================================ */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

reveals.forEach(el => revealObserver.observe(el));

/* ============================================
   STATS COUNTER ANIMATION
   ============================================ */
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'));
            animateCounter(el, target);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
    let current = 0;
    const duration = 1500;
    const stepTime = Math.max(Math.floor(duration / target), 30);

    const timer = setInterval(() => {
        current++;
        el.textContent = current;
        if (current >= target) clearInterval(timer);
    }, stepTime);
}

/* ============================================
   ACTIVE NAV LINK HIGHLIGHT
   ============================================ */
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => sectionObserver.observe(section));

/* ============================================
   MAGNETIC BUTTON EFFECT
   ============================================ */
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/* ============================================
   TILT EFFECT ON PROJECT CARDS
   ============================================ */
document.querySelectorAll('.project-preview').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ============================================
   PARALLAX ON HERO ORBS
   ============================================ */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.querySelectorAll('.hero-orb').forEach((orb, i) => {
        const speed = (i + 1) * 0.08;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

/* ============================================
   FORM HANDLING
   ============================================ */
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-btn span');
    const originalText = btn.textContent;
    btn.textContent = 'Sent!';
    form.reset();
    setTimeout(() => { btn.textContent = originalText; }, 2500);
});

/* ============================================
   SKILL TAG SCRAMBLE EFFECT
   ============================================ */
document.querySelectorAll('.skill-tag').forEach(tag => {
    const original = tag.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

    tag.addEventListener('mouseenter', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            tag.textContent = original.split('').map((char, i) => {
                if (i < iterations) return original[i];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            iterations += 0.5;
            if (iterations >= original.length) {
                tag.textContent = original;
                clearInterval(interval);
            }
        }, 25);
    });
});

/* ============================================
   TIMELINE LINE FILL ON SCROLL
   ============================================ */
const timelineLine = document.querySelector('.timeline-line');
if (timelineLine) {
    const timeline = document.querySelector('.timeline');
    window.addEventListener('scroll', () => {
        const rect = timeline.getBoundingClientRect();
        let progress = (window.innerHeight - rect.top) / (rect.height + window.innerHeight);
        progress = Math.max(0, Math.min(1, progress));
        timelineLine.style.background = `linear-gradient(to bottom, var(--accent) ${progress * 100}%, var(--border) ${progress * 100}%)`;
    });
}

/* ============================================
   VIDEO BACKGROUND CYCLE
   ============================================ */
const heroVideo = document.getElementById('hero-video');
const videoSources = ['assets/aurora1.mp4', 'assets/aurora3.mp4', 'assets/aurora2.mp4'];
let currentVideoIndex = 0;

heroVideo.addEventListener('ended', () => {
    currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
    heroVideo.style.opacity = '0';
    setTimeout(() => {
        heroVideo.src = videoSources[currentVideoIndex];
        heroVideo.load();
        heroVideo.play();
        heroVideo.style.opacity = '1';
    }, 500);
});

// Add smooth transition for video opacity
heroVideo.style.transition = 'opacity 0.8s ease';

/* ============================================
   GLASS CARD SPOTLIGHT EFFECT
   ============================================ */
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--spotlight-x', x + 'px');
        card.style.setProperty('--spotlight-y', y + 'px');
        card.style.background = `radial-gradient(300px circle at var(--spotlight-x) var(--spotlight-y), rgba(0,240,255,0.04), transparent 60%), var(--glass)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
});
