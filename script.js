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
const targetScore = 30; // 20 очков
let gameInterval;

// 1. Убегающая кнопка "НЕТ"
function moveButton() {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
}

noBtn.addEventListener('mouseover', moveButton);
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
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';

    gameArea.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 800);
}

// 5. Заполнение ВСЕГО экрана кляксами (100 штук!)
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

    const totalBlobs = 100; // 💥 Ровно 100 штук!

    for (let i = 0; i < totalBlobs; i++) {
        setTimeout(() => {
            const blob = document.createElement('div');
            blob.className = 'love-blob';
            blob.textContent = phrases[Math.floor(Math.random() * phrases.length)];

            blob.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            blob.style.borderRadius = blobShapes[Math.floor(Math.random() * blobShapes.length)];

            // Рандомный поворот и разброс масштаба от 0.75 до 1.35
            const rot = (Math.random() * 60 - 30) + 'deg';
            const scale = (0.75 + Math.random() * 0.6).toFixed(2);
            blob.style.setProperty('--rot', rot);
            blob.style.setProperty('--scale', scale);

            // Разбрасываем по всей ширине и высоте экрана с небольшим вылетом за края
            const posX = Math.random() * (window.innerWidth - 120);
            const posY = Math.random() * (window.innerHeight - 50);

            blob.style.left = posX + 'px';
            blob.style.top = posY + 'px';

            document.body.appendChild(blob);
        }, i * 25); // Каждые 25 миллисекунд вылетает новая клякса
    }
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

        const x = Math.random() * (window.innerWidth - 90);
        element.style.left = x + 'px';

        // Клик
        element.addEventListener('click', (e) => {
            const addedPoints = isFace ? 3 : 1;
            score += addedPoints;
            scoreElem.textContent = score;

            showScorePopup(e.clientX, e.clientY, `+${addedPoints}`, isFace);
            element.remove();

            // Победа!
            if (score >= targetScore) {
                clearInterval(gameInterval);
                gameArea.innerHTML = '';
                winMessage.classList.remove('hidden');

                // Лавина клякс
                spawnLoveBlobs();
            }
        });

        gameArea.appendChild(element);

        setTimeout(() => {
            if (element.parentNode) element.remove();
        }, 3400);

    }, 500);
}