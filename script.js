const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️'; 
} else {
    themeToggle.textContent = '🌙';
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

// --------------------------------------
// Baybayin Translation Tool Logic (Accurate and Working)
// --------------------------------------

const translateButton = document.getElementById('translate-button');
const tagalogInput = document.getElementById('tagalog-input');
const baybayinOutput = document.getElementById('baybayin-output');

// Baybayin Mapping with Virama (Pamudpod) Support
const baseMap = {
    'a': 'ᜀ', 'i': 'ᜁ', 'e': 'ᜁ', 'u': 'ᜂ', 'o': 'ᜂ',
    'b': 'ᜊ', 'k': 'ᜃ', 'd': 'ᜇ', 'g': 'ᜄ', 'h': 'ᜑ',
    'l': 'ᜎ', 'm': 'ᜋ', 'n': 'ᜈ', 'ng': 'ᜅ', 'p': 'ᜉ',
    's': 'ᜐ', 't': 'ᜆ', 'w': 'ᜏ', 'y': 'ᜌ', 'r': 'ᜇ', // R is mapped to D/RA
};

const vowelModifier = {
    'i': 'ᜒ', 'e': 'ᜒ', 'u': 'ᜓ', 'o': 'ᜓ'
};

const virama = '᜔'; // Pamudpod / Cross Mark for final consonant

function syllabify(text) {
    // 1. Normalize and clean the input
    let cleanText = text.toLowerCase().replace(/[^a-zñ\s]/g, '').trim();
    if (!cleanText) return [];

    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    let syllables = [];

    const vowels = ['a', 'e', 'i', 'o', 'u'];
    
    const consonants = Object.keys(baseMap).filter(c => c.length === 1 && !vowels.includes(c));
    const longConsonants = ['ng'];

    for (let word of words) {
        if (!word) continue;
        let i = 0;
        let wordSyllables = [];

        while (i < word.length) {
            let foundSyllable = false;

            // Check for NGA + Vowel (e.g., ngi)
            if (i + 2 <= word.length && word.substring(i, i + 2) === 'ng' && (i + 2 < word.length && vowels.includes(word[i+2]))) {
                wordSyllables.push(word.substring(i, i + 3)); // ng-vowel
                i += 3;
                foundSyllable = true;
            } 
            // Check for NGA as base or final consonant
            else if (i + 2 <= word.length && word.substring(i, i + 2) === 'ng' && (i + 2 === word.length || !vowels.includes(word[i+2]))) {
                wordSyllables.push('ng');
                i += 2;
                foundSyllable = true;
            }
            
            // Check for Vowel (A, E, I, O, U)
            if (!foundSyllable && vowels.includes(word[i])) {
                wordSyllables.push(word[i]);
                i += 1;
                foundSyllable = true;
            }

            // Check for Consonant-Vowel (CV)
            if (!foundSyllable && consonants.includes(word[i])) {
                if (i + 1 < word.length && vowels.includes(word[i+1])) {
                    // Found CV
                    wordSyllables.push(word.substring(i, i + 2));
                    i += 2;
                    foundSyllable = true;
                } else {
                    // Found a standalone Consonant (C)
                    wordSyllables.push(word[i]);
                    i += 1;
                    foundSyllable = true;
                }
            }
            
            // Fallback (e.g. for 'ñ' which is not in our map but we try to clean it out)
            if (!foundSyllable) {
                i += 1; 
            }
        }
        syllables.push(wordSyllables);
    }
    return syllables;
}

function translateToBaybayin() {
    let input = tagalogInput.value;
    if (!input.trim()) {
        // Set the output to the sample translation when empty
        baybayinOutput.textContent = 'ᜋᜄᜈ᜔ᜇᜅ᜔ ᜂᜋᜄ ᜉᜒᜎᜒᜉᜒᜈᜐ᜔';
        return;
    }

    const wordsSyllables = syllabify(input);
    let baybayinResult = [];

    for (const wordSyllables of wordsSyllables) {
        let wordBaybayin = '';
        
        for (const syllable of wordSyllables) {
            
            // 1. Vowels (A, I, E, U, O) - syllable.length === 1
            if (syllable.length === 1 && 'aeiou'.includes(syllable)) {
                wordBaybayin += baseMap[syllable];
                continue;
            }

            // 2. Consonant-Vowel (CV, including NGA-V) - syllable.length >= 2
            if ('aeiou'.includes(syllable.slice(-1))) {
                const vowel = syllable.slice(-1);
                let consonant = syllable.substring(0, syllable.length - 1);

                if (consonant === 'r') { consonant = 'd'; } 

                if (baseMap[consonant]) {
                    wordBaybayin += baseMap[consonant];
                    // Apply Kudlit if vowel is I/E or U/O
                    if (vowel !== 'a') {
                        wordBaybayin += vowelModifier[vowel];
                    }
                }
                continue;
            }

            // 3. Standalone Consonant (C or NG)
            if (syllable.length === 1 && !'aeiou'.includes(syllable)) {
                const char = syllable;
                let baseConsonant = char;
                if (char === 'r') { baseConsonant = 'd'; } 

                // Use the inherent A vowel for the base consonant, then add Virama
                if (baseMap[baseConsonant]) {
                    wordBaybayin += baseMap[baseConsonant] + virama;
                }
                continue;
            }
            
            // 4. Final 'ng'
            if (syllable === 'ng') {
                wordBaybayin += baseMap['ng'] + virama;
            }
        }
        baybayinResult.push(wordBaybayin);
    }

    baybayinOutput.textContent = baybayinResult.join(' ');
}

// Initial translation for the placeholder text
translateToBaybayin(); 
translateButton.addEventListener('click', translateToBaybayin);
tagalogInput.addEventListener('input', translateToBaybayin); 
tagalogInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Prevents default behavior (newline) when Enter is pressed alone
        e.preventDefault();
        translateToBaybayin();
    }
});

// --------------------------------------
// Sliding Sidebar Logic (New Feature)
// --------------------------------------

const sidebar = document.getElementById('creator-sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const navLinksContainer = document.querySelector('.nav-links');


sidebarToggle.addEventListener('click', () => {
    const isActive = sidebar.classList.toggle('active');
    
    // Close mobile menu if open
    if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
    }

    // Toggle body class to add padding-right on large screens, preventing content jump
    if (window.innerWidth > 1024) {
        body.classList.toggle('sidebar-open', isActive);
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
