// Premium JS Features for Nandhakumar P Portfolio

document.addEventListener('DOMContentLoaded', () => {
    initCanvasParticles();
    initTypingAnimation();
    initScrollInteractions();
    initSkillsAnimation();
    initContactForm();
    initGuestbook();
});

// 1. Futuristic Canvas Background
function initCanvasParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });
    
    const particles = [];
    const maxParticles = 60;
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            // Either binary text or small node
            this.isBinary = Math.random() > 0.85;
            this.char = Math.random() > 0.5 ? '0' : '1';
        }
        
        draw() {
            ctx.beginPath();
            if (this.isBinary) {
                ctx.font = '10px Fira Code';
                ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
                ctx.fillText(this.char, this.x, this.y);
            } else {
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
                ctx.fill();
            }
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
    }
    
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw links between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// 2. Typing Animation
function initTypingAnimation() {
    const subtitleEl = document.getElementById('typing-text');
    if (!subtitleEl) return;
    
    const words = [
        "B.Tech in Artificial Intelligence & Data Science",
        "Python Full Stack Developer",
        "Computer Vision & Deep Learning Specialist",
        "Django Developer"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            subtitleEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            subtitleEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = 80;
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 500);
}

// 3. Scroll Interactions (sticky header & section highlighting)
function initScrollInteractions() {
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        // Sticky Header border adjustment
        if (window.scrollY > 50) {
            header.style.background = 'rgba(7, 8, 13, 0.9)';
            header.style.borderBottomColor = 'rgba(0, 240, 255, 0.1)';
        } else {
            header.style.background = 'rgba(7, 8, 13, 0.7)';
            header.style.borderBottomColor = 'rgba(255, 255, 255, 0.07)';
        }
        
        // Active Link Highlighting
        let currentSec = '';
        sections.forEach((sec) => {
            const sectionTop = sec.offsetTop;
            const sectionHeight = sec.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                currentSec = sec.getAttribute('id');
            }
        });
        
        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSec}`) {
                link.classList.add('active');
            }
        });
    });
}

// 4. Skills Progress Fills
function initSkillsAnimation() {
    const skillsSec = document.getElementById('skills');
    const fillBars = document.querySelectorAll('.skill-fill');
    if (!skillsSec || fillBars.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                fillBars.forEach((bar) => {
                    const pct = bar.getAttribute('data-percentage');
                    bar.style.width = `${pct}%`;
                });
                observer.unobserve(skillsSec);
            }
        });
    }, { threshold: 0.15 });
    
    observer.observe(skillsSec);
}

// 5. Toast Notifications helper
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    if (isError) {
        toast.classList.add('error');
    } else {
        toast.classList.remove('error');
    }
    
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);
}

// 6. Contact Form Submission
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();
        
        if (!name || !email || !message) {
            showToast('Please fill out all required fields.', true);
            return;
        }
        
        const payload = { name, email, subject, message };
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            const response = await fetch('/api/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (response.ok && result.status === 'success') {
                showToast(result.message);
                form.reset();
            } else {
                showToast(result.message || 'Failed to send message.', true);
            }
        } catch (err) {
            showToast('Network error occurred. Please try again.', true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
        }
    });
}

// 7. Guestbook Actions
function initGuestbook() {
    const feed = document.getElementById('guestbook-feed');
    const form = document.getElementById('guestbook-form');
    if (!feed) return;
    
    // Load approved comments
    async function loadEntries() {
        try {
            const response = await fetch('/api/guestbook/');
            const result = await response.json();
            
            if (response.ok && result.status === 'success') {
                const entries = result.entries;
                if (entries.length === 0) {
                    feed.innerHTML = '<div class="no-comments">No approved notes yet. Be the first to leave a greeting!</div>';
                    return;
                }
                
                feed.innerHTML = entries.map((e) => {
                    let tagClass = 'tag-visitor';
                    let categoryLabel = 'Visitor';
                    if (e.category === 'Recruiter') {
                        tagClass = 'tag-recruiter';
                        categoryLabel = 'Recruiter';
                    } else if (e.category === 'Peer') {
                        tagClass = 'tag-peer';
                        categoryLabel = 'Developer / Peer';
                    }
                    
                    return `
                        <div class="comment-card glass-panel">
                            <div class="comment-header">
                                <div class="commenter-name">${escapeHtml(e.name)}</div>
                                <div class="comment-meta">
                                    <span class="comment-tag ${tagClass}">${categoryLabel}</span>
                                    <span class="comment-date">${e.created_at}</span>
                                </div>
                            </div>
                            <div class="comment-text">${escapeHtml(e.message)}</div>
                        </div>
                    `;
                }).join('');
            } else {
                feed.innerHTML = '<div class="no-comments">Failed to load entries.</div>';
            }
        } catch (err) {
            feed.innerHTML = '<div class="no-comments">Failed to fetch guestbook comments.</div>';
        }
    }
    
    // Initial Load
    loadEntries();
    
    // Submit comment
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('guestbook-name').value.trim();
            const category = document.getElementById('guestbook-category').value;
            const message = document.getElementById('guestbook-message').value.trim();
            
            if (!name || !message) {
                showToast('Name and message are required.', true);
                return;
            }
            
            const payload = { name, category, message };
            const submitBtn = form.querySelector('button[type="submit"]');
            const origText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            try {
                const response = await fetch('/api/guestbook/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                
                const result = await response.json();
                
                if (response.ok && result.status === 'success') {
                    showToast(result.message);
                    form.reset();
                    // Don't reload immediately since comments need moderation approval first
                } else {
                    showToast(result.message || 'Failed to submit comment.', true);
                }
            } catch (err) {
                showToast('Network error occurred.', true);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = origText;
            }
        });
    }
}

// Utility function to escape HTML to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
