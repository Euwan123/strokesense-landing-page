const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙'; 
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


// Ripple Animation for Buttons (Enhanced)
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Translation Tool Logic (New Feature Functionality)
const translateButton = document.getElementById('translate-button');
const tagalogInput = document.getElementById('tagalog-input');
const baybayinOutput = document.getElementById('baybayin-output');

// Simple Placeholder Mapping (In a real app, this would use an API or complex logic)
const baybayinMap = {
    'a': 'ᜀ', 'e': 'ᜁ', 'i': 'ᜁ', 'o': 'ᜂ', 'u': 'ᜂ',
    'ba': 'ᜊ', 'be': 'ᜊᜒ', 'bi': 'ᜊᜒ', 'bo': 'ᜊᜓ', 'bu': 'ᜊᜓ',
    'ka': 'ᜃ', 'ke': 'ᜃᜒ', 'ki': 'ᜃᜒ', 'ko': 'ᜃᜓ', 'ku': 'ᜃᜓ',
    'da': 'ᜇ', 'ra': 'ᜇ', 'de': 'ᜇᜒ', 'di': 'ᜇᜒ', 'do': 'ᜇᜓ', 'du': 'ᜇᜓ', 'ro': 'ᜇᜓ', 'ru': 'ᜇᜓ',
    'ga': 'ᜄ', 'ge': 'ᜄᜒ', 'gi': 'ᜄᜒ', 'go': 'ᜄᜓ', 'gu': 'ᜄᜓ',
    'ha': 'ᜑ', 'he': 'ᜑᜒ', 'hi': 'ᜑᜒ', 'ho': 'ᜑᜓ', 'hu': 'ᜑᜓ',
    'la': 'ᜎ', 'le': 'ᜎᜒ', 'li': 'ᜎᜒ', 'lo': 'ᜎᜓ', 'lu': 'ᜎᜓ',
    'ma': 'ᜋ', 'me': 'ᜋᜒ', 'mi': 'ᜋᜒ', 'mo': 'ᜋᜓ', 'mu': 'ᜋᜓ',
    'na': 'ᜈ', 'ne': 'ᜈᜒ', 'ni': 'ᜈᜒ', 'no': 'ᜈᜓ', 'nu': 'ᜈᜓ',
    'nga': 'ᜅ', 'nge': 'ᜅᜒ', 'ngi': 'ᜅᜒ', 'ngo': 'ᜅᜓ', 'ngu': 'ᜅᜓ',
    'pa': 'ᜉ', 'pe': 'ᜉᜒ', 'pi': 'ᜉᜒ', 'po': 'ᜉᜓ', 'pu': 'ᜉᜓ',
    'sa': 'ᜐ', 'se': 'ᜐᜒ', 'si': 'ᜐᜒ', 'so': 'ᜐᜓ', 'su': 'ᜐᜓ',
    'ta': 'ᜆ', 'te': 'ᜆᜒ', 'ti': 'ᜆᜒ', 'to': 'ᜆᜓ', 'tu': 'ᜆᜓ',
    'wa': 'ᜏ', 'we': 'ᜏᜒ', 'wi': 'ᜏᜒ', 'wo': 'ᜏᜓ', 'wu': 'ᜏᜓ',
    'ya': 'ᜌ', 'ye': 'ᜌᜒ', 'yi': 'ᜌᜒ', 'yo': 'ᜌᜓ', 'yu': 'ᜌᜓ',
    // Final consonant marker (Virama / Pamudpod) is required for modern systems, but Baybayin traditionally uses context.
    // We will simplify this and just use the base character for ending consonants for demonstration.
    'mabuhay': 'ᜋᜊᜓᜑᜌ᜔' // Custom mapping for demo text
};

function translateToBaybayin() {
    let input = tagalogInput.value.toLowerCase().trim();
    
    if (input in baybayinMap) {
        baybayinOutput.textContent = baybayinMap[input];
    } else {
        // Simple default message for non-mapped words
        baybayinOutput.textContent = 'Translation not available. Try "Mabuhay".';
    }
}

translateButton.addEventListener('click', translateToBaybayin);
tagalogInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        translateToBaybayin();
    }
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
    
    /* Ripple Animation Styles */
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-effect 0.6s linear;
        pointer-events: none;
        z-index: 10;
    }
    
    .btn-secondary .ripple {
        background: rgba(47,168,79, 0.3); /* Primary color ripple for secondary button */
    }

    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
