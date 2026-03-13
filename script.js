document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Prevent scrolling during preload
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            preloader.classList.add('done');
            document.body.style.overflow = '';
        }, 2200); // Logo fade (0.2+0.6) + line fill (0.6+1.2) ≈ 2.2s
    }

    // Live Clock (IST)
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
        function updateClock() {
            const now = new Date();
            const ist = new Intl.DateTimeFormat('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).format(now);
            clockEl.textContent = 'IST ' + ist;
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // Desktop Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarEl = document.getElementById('sidebar');
    const scrollProgress = document.querySelector('.scroll-progress');

    if (sidebarToggle && sidebarEl) {
        sidebarToggle.addEventListener('click', () => {
            sidebarEl.classList.toggle('collapsed');
            sidebarToggle.classList.toggle('collapsed');
            // Also shift the scroll progress bar
            if (scrollProgress) {
                if (sidebarEl.classList.contains('collapsed')) {
                    scrollProgress.style.left = '0';
                } else {
                    scrollProgress.style.left = '';
                }
            }
        });
    }

    // Mobile Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger && sidebar && overlay) {
        hamburger.addEventListener('click', () => {
            const isOpen = sidebar.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                hamburger.classList.add('active');
                sidebar.classList.add('open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        overlay.addEventListener('click', closeMobileMenu);

        // Close menu when a nav link is clicked
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });
    }

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    
    // Only init cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0;
        let circleX = 0, circleY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth cursor follow with requestAnimationFrame
        function animateCursor() {
            const speed = 0.15;
            circleX += (mouseX - circleX) * speed;
            circleY += (mouseY - circleY) * speed;
            cursorCircle.style.transform = `translate(${circleX - 15}px, ${circleY - 15}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects for cursor
        const hoverableElements = document.querySelectorAll('a, button, .project-card, .tech-item, .stat-card');
        hoverableElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorCircle.style.width = '50px';
                cursorCircle.style.height = '50px';
                cursorCircle.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                cursorCircle.style.borderColor = 'var(--accent)';
                cursorDot.style.transform = 'scale(2)';
            });
            el.addEventListener('mouseleave', () => {
                cursorCircle.style.width = '30px';
                cursorCircle.style.height = '30px';
                cursorCircle.style.backgroundColor = 'transparent';
                cursorCircle.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                cursorDot.style.transform = 'scale(1)';
            });
        });
    }

    // Scroll Progress Bar
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Scroll Spy (Active Nav Link)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding link
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Reveal animations on scroll (staggered)
    const revealElements = document.querySelectorAll('.project-card, .project-featured, .timeline-item, .stat-card');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered delay based on sibling index
                const siblings = entry.target.parentElement.children;
                const siblingIndex = Array.from(siblings).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, siblingIndex * 120);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        revealObserver.observe(el);
    });

    // Project Filter Tabs
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card, .project-featured');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Smooth nav scroll with offset
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Contact Form Logic
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const button = form.querySelector('.submit-btn');
            const btnText = button.querySelector('.submit-btn-text');
            const btnIcon = button.querySelector('.submit-btn-icon');
            const originalText = btnText.textContent;
            const originalIcon = btnIcon.innerHTML;
            
            // Show sending state
            button.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>';
            button.style.background = 'linear-gradient(135deg, #4b5563 0%, #374151 100%)';

            // Actually submit to Formspree
            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    btnText.textContent = 'Message Sent!';
                    btnIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    form.reset();
                } else {
                    btnText.textContent = 'Failed to Send';
                    button.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                }
                setTimeout(() => {
                    button.disabled = false;
                    btnText.textContent = originalText;
                    btnIcon.innerHTML = originalIcon;
                    button.style.background = '';
                }, 3000);
            }).catch(() => {
                btnText.textContent = 'Failed to Send';
                button.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                setTimeout(() => {
                    button.disabled = false;
                    btnText.textContent = originalText;
                    btnIcon.innerHTML = originalIcon;
                    button.style.background = '';
                }, 3000);
            });
        });
    }
});