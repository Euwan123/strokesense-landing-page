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
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
        }
    });
});

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-md)';
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

const watchDemoBtn = document.getElementById('watch-demo-btn');
const videoModal = document.getElementById('video-modal');
const videoClose = document.querySelector('.video-close');
const youtubeIframe = document.getElementById('youtube-iframe');

watchDemoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    videoModal.style.display = 'flex';
    videoModal.classList.add('active'); 
    youtubeIframe.src = 'https://www.youtube.com/embed/NE7mwkPdV04?autoplay=1';
    document.body.style.overflow = 'hidden';
});

videoClose.addEventListener('click', () => {
    videoModal.style.display = 'none';
    videoModal.classList.remove('active');
    youtubeIframe.src = '';
    document.body.style.overflow = 'auto';
});

videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        videoModal.style.display = 'none';
        videoModal.classList.remove('active');
        youtubeIframe.src = '';
        document.body.style.overflow = 'auto';
    }
});

const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clear-canvas');
const guideBtn = document.getElementById('show-guide');
let isDrawing = false;
let showGuide = true;

canvas.width = 200;
canvas.height = 200;

function drawGuide() {
    if (!showGuide) return;
    ctx.strokeStyle = 'rgba(47, 168, 79, 0.3)';
    ctx.lineWidth = 3;
    ctx.font = '120px serif';
    ctx.fillStyle = 'rgba(47, 168, 79, 0.15)';
    ctx.fillText('ᜋ', 40, 150);
}

function initCanvas() {
    ctx.fillStyle = body.classList.contains('dark-mode') ? '#1a1a1a' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGuide();
}

initCanvas();

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
});
canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    canvas.dispatchEvent(mouseEvent);
});

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.strokeStyle = body.classList.contains('dark-mode') ?
    '#4dc46f' : '#2fa84f';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

clearBtn.addEventListener('click', () => {
    initCanvas();
});

guideBtn.addEventListener('click', () => {
    showGuide = !showGuide;
    guideBtn.textContent = showGuide ? 'Guide' : 'Hide Guide';
    initCanvas();
});

themeToggle.addEventListener('click', () => {
    setTimeout(() => {
        initCanvas();
    }, 50);
});

const translateButton = document.getElementById('translate-button');
const tagalogInput = document.getElementById('tagalog-input');
const baybayinOutput = document.getElementById('baybayin-output');

const baseMap = {
    'a': 'ᜀ', 'i': 'ᜁ', 'e': 'ᜁ', 'u': 'ᜂ', 'o': 'ᜂ',
    'b': 'ᜊ', 'k': 'ᜃ', 'd': 'ᜇ', 'g': 'ᜄ', 'h': 'ᜑ',
    'l': 'ᜎ', 'm': 'ᜋ', 'n': 'ᜈ', 'ng': 'ᜅ', 'p': 'ᜉ',
    's': 'ᜐ', 't': 'ᜆ', 'w': 'ᜏ', 'y': 'ᜌ', 'r': 'ᜇ',
};
const vowelModifier = {
    'i': 'ᜒ', 'e': 'ᜒ', 'u': 'ᜓ', 'o': 'ᜓ'
};

const virama = '᜔';
function syllabify(text) {
    let cleanText = text.toLowerCase().replace(/[^a-zñ\s]/g, '').trim();
    if (!cleanText) return [];
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    let syllables = [];

    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const consonants = Object.keys(baseMap).filter(c => c.length === 1 && !vowels.includes(c));
    for (let word of words) {
        if (!word) continue;
        let i = 0;
        let wordSyllables = [];

        while (i < word.length) {
            let foundSyllable = false;
            if (i + 2 <= word.length && word.substring(i, i + 2) === 'ng' && (i + 2 < word.length && vowels.includes(word[i+2]))) {
                wordSyllables.push(word.substring(i, i + 3));
                i += 3;
                foundSyllable = true;
            } 
            else if (i + 2 <= word.length && word.substring(i, i + 2) === 'ng' && (i + 2 === word.length || !vowels.includes(word[i+2]))) {
                wordSyllables.push('ng');
                i += 2;
                foundSyllable = true;
            }
            
            if (!foundSyllable && vowels.includes(word[i])) {
                wordSyllables.push(word[i]);
                i += 1;
                foundSyllable = true;
            }

            if (!foundSyllable && consonants.includes(word[i])) {
                if (i + 1 < word.length && vowels.includes(word[i+1])) {
                    wordSyllables.push(word.substring(i, i + 2));
                    i += 2;
                    foundSyllable = true;
                } else {
                    wordSyllables.push(word[i]);
                    i += 1;
                    foundSyllable = true;
                }
            }
            
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
        baybayinOutput.textContent = 'ᜋᜄᜈ᜔ᜇᜅ᜔ ᜂᜋᜄ ᜉᜒᜎᜒᜉᜒᜈᜐ᜔';
        return;
    }

    const wordsSyllables = syllabify(input);
    let baybayinResult = [];
    for (const wordSyllables of wordsSyllables) {
        let wordBaybayin = '';
        for (const syllable of wordSyllables) {
            
            if (syllable.length === 1 && 'aeiou'.includes(syllable)) {
                wordBaybayin += baseMap[syllable];
                continue;
            }

            if ('aeiou'.includes(syllable.slice(-1))) {
                const vowel = syllable.slice(-1);
                let consonant = syllable.substring(0, syllable.length - 1);

                if (consonant === 'r') { consonant = 'd'; } 

                if (baseMap[consonant]) {
                    wordBaybayin += baseMap[consonant];
                    if (vowel !== 'a') {
                        wordBaybayin += vowelModifier[vowel];
                    }
                }
                continue;
            }

            if (syllable.length === 1 && !'aeiou'.includes(syllable)) {
                const char = syllable;
                let baseConsonant = char;
                if (char === 'r') { baseConsonant = 'd'; } 

                if (baseMap[baseConsonant]) {
                    wordBaybayin += baseMap[baseConsonant] + virama;
                }
                continue;
            }
            
            if (syllable === 'ng') {
                wordBaybayin += baseMap['ng'] + virama;
            }
        }
        baybayinResult.push(wordBaybayin);
    }

    baybayinOutput.textContent = baybayinResult.join(' ');
}

translateToBaybayin(); 
translateButton.addEventListener('click', translateToBaybayin);
tagalogInput.addEventListener('input', translateToBaybayin);
tagalogInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault();
        translateToBaybayin();
    }
});
