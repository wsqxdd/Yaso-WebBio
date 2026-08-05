const wallpapers = [
    "img/wallpaper_1.png",
    "img/wallpaper_2.png"
];
let index = 0;
let isAnimating = false;

// ПРЕДЗАГРУЗКА ИЗОБРАЖЕНИЙ: 
// Загружаем все картинки в кэш браузера при старте скрипта
wallpapers.forEach(src => {
    const img = new Image();
    img.src = src;
});

// инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.bg').style.backgroundImage = `url('${wallpapers[0]}')`;
    initProjectsSlider();
    initParticles();
});

function changeWallpaper(event) {
    if (isAnimating) return;
    isAnimating = true;
    
    index = (index + 1) % wallpapers.length;
    
    const bg = document.querySelector(".bg");
    const next = document.querySelector(".bg-next");
    const x = event.clientX;
    const y = event.clientY;
    
    next.style.transition = "none";
    next.style.backgroundImage = `url('${wallpapers[index]}')`;
    
    // Добавлен -webkit- для поддержки Safari и iOS
    next.style.webkitClipPath = `circle(0% at ${x}px ${y}px)`;
    next.style.clipPath = `circle(0% at ${x}px ${y}px)`;
    
    // Принудительная перерисовка (reflow), чтобы браузер применил нулевой круг до анимации
    void next.offsetHeight;
    
    next.style.transition = "clip-path 0.9s cubic-bezier(.54, 0, .34, .99), -webkit-clip-path 0.9s cubic-bezier(.54, 0, .34, .99)";
    next.style.webkitClipPath = `circle(150% at ${x}px ${y}px)`;
    next.style.clipPath = `circle(150% at ${x}px ${y}px)`;
    
    next.addEventListener("transitionend", () => {
        bg.style.backgroundImage = `url('${wallpapers[index]}')`;
        next.style.transition = "none";
        next.style.webkitClipPath = `circle(0% at ${x}px ${y}px)`;
        next.style.clipPath = `circle(0% at ${x}px ${y}px)`;
        isAnimating = false;
    }, { once: true });
}


//

function copyText(event) {
    // Предотвращаем стандартное поведение ссылки (чтобы страница не дергалась вверх)
    event.preventDefault();

    // Твой ник в Discord, который будет скопирован
    const discordId = "pudgezzzz"; // Замени на свой актуальный ник, если нужно

    // API для копирования текста в буфер обмена
    navigator.clipboard.writeText(discordId).then(() => {
        // Находим наше уведомление по ID
        const toast = document.getElementById("copyToast");

        // Добавляем класс 'show', чтобы уведомление плавно появилось
        toast.classList.add("show");

        // Убираем класс 'show' через 2.5 секунды (2500 миллисекунд)
        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
        
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
    });
}

// Управление слайдером проектов
let currentProjectsPage = 0;

function initProjectsSlider() {
    const track = document.querySelector('.projects-track');
    const pages = document.querySelectorAll('.projects-page');
    const dotsContainer = document.querySelector('.nav-dots');
    
    if (!track || pages.length === 0) return;
    
    // Динамически настраиваем ширину трека и страниц
    track.style.width = `${pages.length * 100}%`;
    pages.forEach(page => {
        page.style.width = `${100 / pages.length}%`;
    });
    
    // Генерируем точки пагинации на основе количества страниц
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < pages.length; i++) {
            const dot = document.createElement('span');
            dot.className = `nav-dot${i === 0 ? ' active' : ''}`;
            dot.addEventListener('click', () => setProjectsPage(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    updateProjectsSlider();
}

function updateProjectsSlider() {
    const track = document.querySelector('.projects-track');
    const pages = document.querySelectorAll('.projects-page');
    const dots = document.querySelectorAll('.nav-dot');
    
    if (!track || pages.length === 0) return;
    
    const percentage = currentProjectsPage * (100 / pages.length);
    track.style.transform = `translateX(-${percentage}%)`;
    
    dots.forEach((dot, idx) => {
        if (idx === currentProjectsPage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextProjects() {
    const pages = document.querySelectorAll('.projects-page');
    if (pages.length === 0) return;
    currentProjectsPage = (currentProjectsPage + 1) % pages.length;
    updateProjectsSlider();
}

function prevProjects() {
    const pages = document.querySelectorAll('.projects-page');
    if (pages.length === 0) return;
    currentProjectsPage = (currentProjectsPage - 1 + pages.length) % pages.length;
    updateProjectsSlider();
}

function setProjectsPage(pageIndex) {
    currentProjectsPage = pageIndex;
    updateProjectsSlider();
}

// Система анимации частиц на фоновом Canvas с реакцией на мышь
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: null, y: null, radius: 130 };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    const particlesCount = 65;
    const particles = [];

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -10;
            this.radius = Math.random() * 2 + 0.6;
            this.speedY = Math.random() * 0.35 + 0.15;
            this.speedX = (Math.random() - 0.5) * 0.25;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.008;
            this.pulse = Math.random() * Math.PI * 2;
        }

        update() {
            // Обычное падение сверху вниз
            this.y += this.speedY;
            this.x += Math.sin(this.pulse) * 0.3 + this.speedX;
            this.pulse += this.pulseSpeed;

            // Реакция отталкивания от курсора мыши
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    this.x += forceDirectionX * force * 3.5;
                    this.y += forceDirectionY * force * 3.5;
                }
            }

            // Возврат наверх при выходе за границы
            if (this.y > height + 10 || this.x < -10 || this.x > width + 10) {
                this.reset(false);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            
            // Если близко к мыши - чуть усиливаем свечение
            let extraAlpha = 0;
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    extraAlpha = (1 - dist / mouse.radius) * 0.4;
                }
            }

            const currentAlpha = Math.min(1, this.alpha * (0.6 + Math.sin(this.pulse) * 0.4) + extraAlpha);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, currentAlpha)})`;
            ctx.shadowBlur = extraAlpha > 0 ? 10 : 6;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < particlesCount; i++) {
        particles.push(new Particle());
    }

    function drawLines() {
        if (mouse.x === null || mouse.y === null) return;
        
        particles.forEach(p => {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 130) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                const lineAlpha = (1 - dist / 130) * 0.35;
                ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawLines();
        requestAnimationFrame(animate);
    }

    animate();
}