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
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Hover effect on interactive elements
const hoverTargets = document.querySelectorAll('a, button, .skill-tag, .project-card, .stat-item, .timeline-content');
hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ============================================
   NAVIGATION
   ============================================ */
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Scrolled nav
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
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
   REVEAL ON SCROLL (Intersection Observer)
   ============================================ */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

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
                link.style.color = link.getAttribute('href') === `#${id}`
                    ? 'var(--text)' : '';
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
        card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
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
    const orbs = document.querySelectorAll('.hero-orb');
    orbs.forEach((orb, i) => {
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

    setTimeout(() => {
        btn.textContent = originalText;
    }, 2500);
});

/* ============================================
   HERO TEXT ANIMATION ON LOAD
   ============================================ */
window.addEventListener('load', () => {
    // Trigger hero reveals immediately
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('active'), i * 120);
    });
});

/* ============================================
   SKILL TAG SCRAMBLE EFFECT ON HOVER
   ============================================ */
document.querySelectorAll('.skill-tag').forEach(tag => {
    const original = tag.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    tag.addEventListener('mouseenter', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            tag.textContent = original
                .split('')
                .map((char, i) => {
                    if (i < iterations) return original[i];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            iterations += 1 / 2;
            if (iterations >= original.length) {
                tag.textContent = original;
                clearInterval(interval);
            }
        }, 30);
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
        const timelineTop = rect.top;
        const timelineHeight = rect.height;
        const windowHeight = window.innerHeight;

        let progress = (windowHeight - timelineTop) / (timelineHeight + windowHeight);
        progress = Math.max(0, Math.min(1, progress));

        timelineLine.style.background = `linear-gradient(to bottom, var(--accent) ${progress * 100}%, var(--border) ${progress * 100}%)`;
    });
}
