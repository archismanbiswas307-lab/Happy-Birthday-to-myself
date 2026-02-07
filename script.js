// Particle System for Background
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.init();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.5 + 0.2,
                color: `hsl(${Math.random() * 60 + 240}, 100%, 50%)`
            });
        }
    }

    update() {
        for (let particle of this.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let particle of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1;
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Confetti Generator
class ConfettiGenerator {
    constructor(container) {
        this.container = container;
        this.colors = ['#FF6B9D', '#C44569', '#FFC75F', '#667eea', '#764ba2'];
    }

    createConfetti(x, y) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        const randomDelay = Math.random() * 0.2;
        const randomDuration = Math.random() * 1 + 2.5;
        const randomX = (Math.random() - 0.5) * 300;
        
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.backgroundColor = randomColor;
        confetti.style.animationDelay = randomDelay + 's';
        confetti.style.animationDuration = randomDuration + 's';
        confetti.style.transform = `translateX(${randomX}px)`;
        
        this.container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), (randomDuration + randomDelay) * 1000);
    }

    burst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createConfetti(x + (Math.random() - 0.5) * 100, y);
            }, i * 10);
        }
    }

    fullscreen(count = 200) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 3;
        
        for (let i = 0; i < count; i++) {
            const randomX = Math.random() * window.innerWidth;
            const randomY = Math.random() * window.innerHeight;
            setTimeout(() => {
                this.createConfetti(randomX, randomY);
            }, i * 20);
        }
    }
}

// Counter Animation
class CounterAnimator {
    constructor(element, target) {
        this.element = element;
        this.target = isNaN(target) ? target : parseInt(target);
        this.current = 0;
        this.isAnimating = false;
    }

    animate(duration = 2000) {
        if (this.isAnimating) return;
        if (typeof this.target === 'string') {
            this.element.textContent = this.target;
            return;
        }

        this.isAnimating = true;
        const increment = this.target / (duration / 16);
        const startTime = Date.now();

        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            this.current = Math.floor(this.target * progress);
            this.element.textContent = this.current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                this.element.textContent = this.target.toLocaleString();
                this.isAnimating = false;
            }
        };

        requestAnimationFrame(update);
    }
}

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Particle System
    const canvas = document.getElementById('particleCanvas');
    const particleSystem = new ParticleSystem(canvas);

    // Initialize Confetti Generator
    const confettiContainer = document.getElementById('confettiContainer');
    const confetti = new ConfettiGenerator(confettiContainer);

    // Confetti Button
    const confettiBtn = document.getElementById('confettiBtn');
    confettiBtn.addEventListener('click', () => {
        confetti.fullscreen(150);
        triggerVibration();
    });

    // Music Toggle Button
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    let isMusicPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicBtn.textContent = '🎵 Toggle Music';
            isMusicPlaying = false;
        } else {
            bgMusic.play().catch(err => console.log('Audio autoplay prevented'));
            musicBtn.textContent = '⏸️ Stop Music';
            isMusicPlaying = true;
        }
        addButtonAnimation(musicBtn);
    });

    // Light Mode Toggle
    const lightBtn = document.getElementById('lightBtn');
    lightBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        lightBtn.textContent = document.body.classList.contains('light-mode') ? '🌙 Dark Mode' : '💡 Light Mode';
        addButtonAnimation(lightBtn);
    });

    // Animate Stats on Scroll
    const statsCards = document.querySelectorAll('.stat-card');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) {
                    const target = statNumber.dataset.target;
                    const counter = new CounterAnimator(statNumber, target);
                    counter.animate(2000);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    statsCards.forEach(card => observer.observe(card));

    // Smooth Scroll Effect for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Mouse Movement Effect on Feature Cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-20px) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-20px) scale(1.05)';
        });
    });

    // Scroll Animation Trigger
    const sections = document.querySelectorAll('section');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0.8';
        scrollObserver.observe(section);
    });

    // Parallax Effect on Scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const gradientBg = document.querySelector('.gradient-bg');
        if (gradientBg) {
            gradientBg.style.backgroundPosition = `${scrollY * 0.5}px ${scrollY * 0.5}px`;
        }
    });

    // Easter Egg: Konami Code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                triggerBirthdayMode();
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Helper Functions
    function addButtonAnimation(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    }

    function triggerVibration() {
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }
    }

    function triggerBirthdayMode() {
        confetti.fullscreen(300);
        document.body.style.animation = 'pulse-all 0.5s ease-out';
        
        // Create pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-all {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
        `;
        document.head.appendChild(style);

        // Flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 999;
            pointer-events: none;
            animation: flashAnimation 0.5s ease-out;
        `;
        document.body.appendChild(flash);

        const flashStyle = document.createElement('style');
        flashStyle.textContent = `
            @keyframes flashAnimation {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(flashStyle);

        setTimeout(() => flash.remove(), 500);
    }

    // Auto-trigger celebration on page load (optional)
    setTimeout(() => {
        console.log('🎉 Happy 18th Birthday! Press the Celebrate button or use the Konami Code! 🎉');
    }, 1000);
});

// Handle visibility change for music
document.addEventListener('visibilitychange', () => {
    const bgMusic = document.getElementById('bgMusic');
    if (document.hidden) {
        bgMusic.pause();
    }
});
