const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const card = document.getElementById('question-card');
const happyScreen = document.getElementById('happy-screen');
const countdownElem = document.getElementById('countdown');
const gameScreen = document.getElementById('game-screen');
const gameArea = document.getElementById('game-area');
const scoreElem = document.getElementById('score-count');
const winMessage = document.getElementById('win-message');
const bgMusic = document.getElementById('bgMusic');

let score = 0;
const targetScore = 30; // 30 очков
let gameInterval;

// Инициализация позиции кнопки "НЕТ"
function initNoBtnPosition() {
    const rect = yesBtn.getBoundingClientRect();
    noBtn.style.left = (rect.right + 20) + 'px';
    noBtn.style.top = rect.top + 'px';
}
window.addEventListener('DOMContentLoaded', initNoBtnPosition);
window.addEventListener('resize', initNoBtnPosition);

// 1. Убегающая кнопка "НЕТ" (для мыши и тачскрина)
function moveButton(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const padding = 20;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;

    const x = Math.max(padding, Math.random() * maxX);
    const y = Math.max(padding, Math.random() * maxY);

    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
}

// Реагирует на мышь и на любое касание пальцем
noBtn.addEventListener('mouseenter', moveButton);
noBtn.addEventListener('pointerdown', moveButton);
noBtn.addEventListener('touchstart', moveButton, { passive: false });
noBtn.addEventListener('click', moveButton);

// 2. Клик на "ДА" -> Отсчет 10 секунд
yesBtn.addEventListener('click', () => {
    card.classList.add('hidden');
    noBtn.classList.add('hidden');
    happyScreen.classList.remove('hidden');

    startCountdown(10);
});

// 3. Отсчет 10 секунд
function startCountdown(seconds) {
    let timeLeft = seconds;
    countdownElem.textContent = timeLeft;

    const timer = setInterval(() => {
        timeLeft--;
        countdownElem.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            happyScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            startGame();
        }
    }, 1000);
}

// 4. Всплывающее количество очков
function showScorePopup(x, y, text, isFace) {
    const popup = document.createElement('div');
    popup.className = `popup-score ${isFace ? 'popup-face' : 'popup-heart'}`;
    popup.textContent = text;
    popup.style.left = (x - 20) + 'px';
    popup.style.top = (y - 30) + 'px';

    gameArea.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 800);
}

// 5. Заполнение экрана: 50 клякс для телефона / 150 для ПК (плавная физика)
function spawnLoveBlobs() {
    const phrases = [
        'Люблю ❤️', 'Обнял 🤗', 'Целую 💋', 
        'Моя девочка 💕', 'Ты лучшая ✨', 'Навсегда 💍', 
        'Самая красивая 🌹', 'Моё счастье 🥰', 'Обожаю 💖', 
        'Только ты 💓', 'Сладкая 🍬', 'Любимая 🌸',
        'Моя жизнь 💫', 'Самая милая 🐰', 'Крепко держу 🤍',
        'Никому не отдам 🔐', 'Моё солнышко ☀️', 'Ты космос 🌌',
        'Моя принцесса 👑', 'Вместе навсегда 🔒', 'Дышу тобой 🫀',
        'Мой мир 🌍', 'Не отпущу 💞', 'Единственная 🍓'
    ];

    const colors = [
        '#ff4d6d', '#ff758f', '#c9184a', 
        '#ff8fa3', '#e01e5a', '#ff477e',
        '#d90429', '#f72585', '#b5179e',
        '#ff5d8f', '#a4133c', '#ff0a54'
    ];

    const blobShapes = [
        '30% 70% 70% 30% / 30% 30% 70% 70%',
        '60% 40% 30% 70% / 60% 30% 70% 40%',
        '40% 60% 60% 40% / 50% 60% 40% 50%',
        '50% 50% 20% 80% / 25% 80% 20% 75%',
        '25px'
    ];

    // 📱 Проверяем ширину экрана устройства
    const isMobile = window.innerWidth < 768;
    const totalBlobs = isMobile ? 50 : 150;
    const blobs = [];

    let touchX = -9999;
    let touchY = -9999;

    let draggedBlob = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastDragX = 0;
    let lastDragY = 0;

    function updatePointer(clientX, clientY) {
        touchX = clientX;
        touchY = clientY;

        if (draggedBlob) {
            draggedBlob.x = touchX - dragOffsetX;
            draggedBlob.y = touchY - dragOffsetY;

            draggedBlob.vx = (draggedBlob.x - lastDragX) * 0.4;
            draggedBlob.vy = (draggedBlob.y - lastDragY) * 0.4;

            lastDragX = draggedBlob.x;
            lastDragY = draggedBlob.y;
        }
    }

    window.addEventListener('pointermove', (e) => updatePointer(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            updatePointer(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    function releaseBlob() {
        if (draggedBlob) {
            draggedBlob.el.classList.remove('dragging');
            const speed = Math.hypot(draggedBlob.vx, draggedBlob.vy);
            if (speed > 12) {
                draggedBlob.vx = (draggedBlob.vx / speed) * 12;
                draggedBlob.vy = (draggedBlob.vy / speed) * 12;
            }
            draggedBlob = null;
        }
    }

    window.addEventListener('pointerup', releaseBlob);
    window.addEventListener('touchend', releaseBlob);

    for (let i = 0; i < totalBlobs; i++) {
        const el = document.createElement('div');
        el.className = 'love-blob';
        el.textContent = phrases[Math.floor(Math.random() * phrases.length)];
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.borderRadius = blobShapes[Math.floor(Math.random() * blobShapes.length)];

        document.body.appendChild(el);

        const width = el.offsetWidth || 110;
        const height = el.offsetHeight || 38;

        const baseScale = isMobile ? 0.72 : 0.85;
        const scale = baseScale + Math.random() * 0.35;
        const radius = (Math.max(width, height) / 2) * scale;

        const blobData = {
            el: el,
            x: Math.random() * Math.max(10, window.innerWidth - width - 20) + 10,
            y: Math.random() * Math.max(10, window.innerHeight - height - 20) + 10,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: radius,
            width: width,
            height: height,
            scale: scale,
            rot: (Math.random() * 20 - 10)
        };

        function onBlobStart(clientX, clientY) {
            draggedBlob = blobData;
            dragOffsetX = clientX - blobData.x;
            dragOffsetY = clientY - blobData.y;
            lastDragX = blobData.x;
            lastDragY = blobData.y;
            blobData.vx = 0;
            blobData.vy = 0;
            el.classList.add('dragging');
        }

        el.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onBlobStart(e.clientX, e.clientY);
        });

        blobs.push(blobData);
    }

    function physicsLoop() {
        const repulsionRadius = isMobile ? 70 : 105;
        const touchForce = 0.6;

        for (let i = 0; i < blobs.length; i++) {
            const b = blobs[i];

            if (b !== draggedBlob) {
                // 1. Отталкивание от пальца/мыши
                const dxTouch = (b.x + b.width / 2) - touchX;
                const dyTouch = (b.y + b.height / 2) - touchY;
                const distTouch = Math.hypot(dxTouch, dyTouch);

                if (distTouch < repulsionRadius && distTouch > 0) {
                    const force = (repulsionRadius - distTouch) / repulsionRadius;
                    b.vx += (dxTouch / distTouch) * force * touchForce;
                    b.vy += (dyTouch / distTouch) * force * touchForce;
                }

                // 2. Мягкие столкновения клякс
                for (let j = i + 1; j < blobs.length; j++) {
                    const b2 = blobs[j];
                    const dx = (b2.x + b2.width / 2) - (b.x + b.width / 2);
                    const dy = (b2.y + b2.height / 2) - (b.y + b.height / 2);
                    const minDist = (b.radius + b2.radius) * 0.75;
                    const dist = Math.hypot(dx, dy);

                    if (dist < minDist && dist > 0) {
                        const overlap = minDist - dist;
                        const nx = dx / dist;
                        const ny = dy / dist;

                        const pushX = nx * overlap * 0.15;
                        const pushY = ny * overlap * 0.15;

                        b.x -= pushX;
                        b.y -= pushY;
                        b.vx -= nx * 0.05;
                        b.vy -= ny * 0.05;

                        b2.x += pushX;
                        b2.y += pushY;
                        b2.vx += nx * 0.05;
                        b2.vy += ny * 0.05;
                    }
                }

                // Затухание
                b.vx *= 0.91;
                b.vy *= 0.91;

                const speed = Math.hypot(b.vx, b.vy);
                const maxSpeed = 7;
                if (speed > maxSpeed) {
                    b.vx = (b.vx / speed) * maxSpeed;
                    b.vy = (b.vy / speed) * maxSpeed;
                }

                b.x += b.vx;
                b.y += b.vy;

                // Отскок от краев
                const edgeBounce = -0.4;
                if (b.x < 5) { b.x = 5; b.vx *= edgeBounce; }
                if (b.x > window.innerWidth - b.width - 5) { b.x = window.innerWidth - b.width - 5; b.vx *= edgeBounce; }
                if (b.y < 5) { b.y = 5; b.vy *= edgeBounce; }
                if (b.y > window.innerHeight - b.height - 5) { b.y = window.innerHeight - b.height - 5; b.vy *= edgeBounce; }
            }

            b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) scale(${b.scale}) rotate(${b.rot}deg)`;
        }

        requestAnimationFrame(physicsLoop);
    }

    requestAnimationFrame(physicsLoop);
}

// 6. Запуск игры
function startGame() {
    if (bgMusic) {
        bgMusic.volume = 0.5;
        bgMusic.play().catch(err => console.log("Музыка заблокирована браузером:", err));
    }

    const emojis = ['💖', '❤️', '💕', '🥰', '💘'];
    const myStickers = [
        'img/kiss.png',
        'img/shy.png',
        'img/funny.png'
    ];

    gameInterval = setInterval(() => {
        if (score >= targetScore) return;

        const isFace = Math.random() < 0.35;
        let element;

        if (isFace) {
            element = document.createElement('img');
            element.src = myStickers[Math.floor(Math.random() * myStickers.length)];
            element.className = 'floating-item floating-face';
        } else {
            element = document.createElement('div');
            element.className = 'floating-item floating-heart';
            element.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        }

        const maxX = Math.max(10, window.innerWidth - 80);
        const x = Math.random() * maxX;
        element.style.left = x + 'px';

        // Универсальный клик/тап для ловли сердечек
        function collectItem(e) {
            e.preventDefault();
            e.stopPropagation();

            const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
            const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);

            const addedPoints = isFace ? 3 : 1;
            score += addedPoints;
            scoreElem.textContent = score;

            showScorePopup(clientX, clientY, `+${addedPoints}`, isFace);
            element.remove();

            if (score >= targetScore) {
                clearInterval(gameInterval);
                gameArea.innerHTML = '';
                winMessage.classList.remove('hidden');
                spawnLoveBlobs();
            }
        }

        element.addEventListener('pointerdown', collectItem);
        gameArea.appendChild(element);

        setTimeout(() => {
            if (element.parentNode) element.remove();
        }, 3400);

    }, 450);
}