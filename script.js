const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    const isDarkMode = body.classList.contains('dark-mode');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isActive = navLinks.classList.contains('active');
    mobileMenuToggle.textContent = isActive ? '✕' : '☰';
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
    });
});

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    } else {
        navbar.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
    }
    
    lastScroll = currentScroll;
});

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(stat => {
    observer.observe(stat);
});
document.querySelectorAll('.feature-card, .step-item, .gallery-item, .testimonial-card').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

const style = document.createElement('style');
style.textContent = `
    .feature-card,
    .step-item,
    .gallery-item,
    .testimonial-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .feature-card.animate-in,
    .step-item.animate-in,
    .gallery-item.animate-in,
    .testimonial-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            right: -100%;
            background: var(--card-bg);
            flex-direction: column;
            width: 250px;
            padding: 2rem;
            box-shadow: var(--shadow-lg);
            border-radius: 0 0 0 16px;
            transition: right 0.3s ease;
            gap: 1.5rem;
        }
        
        .nav-links.active {
            right: 0;
        }
        
        .nav-links a {
            font-size: 1.1rem;
        }
    }
`;
document.head.appendChild(style);
