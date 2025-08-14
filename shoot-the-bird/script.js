const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let birdsHit = 0;
let bulletsSpent = 0;
let timeLeft = 60;
let gameOver = false;

const crowImage = new Image();
crowImage.src = 'crow.png';

let birds = [];
const numBirds = 5;

function createBird() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 2),
        width: 50,
        height: 40,
        dx: (Math.random() - 0.5) * 4 + 1 // Ensure birds move
    };
}

for (let i = 0; i < numBirds; i++) {
    birds.push(createBird());
}

const gun = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 60,
    speed: 0,
    dx: 5
};

let bullets = [];

function drawBirds() {
    birds.forEach(bird => {
        ctx.drawImage(crowImage, bird.x, bird.y, bird.width, bird.height);
    });
}

function drawGun() {
    ctx.fillStyle = 'brown';
    ctx.fillRect(gun.x, gun.y, gun.width, gun.height);
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    let ratio = bulletsSpent > 0 ? (birdsHit / bulletsSpent) * 100 : 0;
    ctx.fillText('Score: ' + birdsHit + ' / ' + bulletsSpent + ' (' + ratio.toFixed(2) + '%)', 10, 20);
}

function drawTimer() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Time: ' + timeLeft, canvas.width - 100, 20);
}

function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function update() {
    if (gameOver) {
        return;
    }

    // Move gun
    gun.x += gun.speed;

    // Gun boundaries
    if (gun.x < 0) {
        gun.x = 0;
    }
    if (gun.x + gun.width > canvas.width) {
        gun.x = canvas.width - gun.width;
    }

    // Move birds
    birds.forEach(bird => {
        bird.x += bird.dx;
        if (bird.x + bird.width < 0) {
            bird.x = canvas.width;
        }
        if (bird.x > canvas.width) {
            bird.x = -bird.width;
        }
    });


    // Move bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.dy;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });

    // Check for collision
    bullets.forEach((bullet, bulletIndex) => {
        birds.forEach((bird, birdIndex) => {
            if (
                bullet.x < bird.x + bird.width &&
                bullet.x + bullet.width > bird.x &&
                bullet.y < bird.y + bird.height &&
                bullet.y + bullet.height > bird.y
            ) {
                bullets.splice(bulletIndex, 1);
                birds.splice(birdIndex, 1);
                birds.push(createBird());
                birdsHit++;
            }
        });
    });


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBirds();
    drawGun();
    drawBullets();
    drawScore();
    drawTimer();

    requestAnimationFrame(update);
}

function keyDown(e) {
    if (gameOver) {
        return;
    }
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        gun.speed = gun.dx;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        gun.speed = -gun.dx;
    } else if (e.code === 'Space') {
        bullets.push({
            x: gun.x + gun.width / 2 - 2.5,
            y: gun.y,
            width: 5,
            height: 10,
            dy: 5
        });
        bulletsSpent++;
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left'
    ) {
        gun.speed = 0;
    }
}

function endGame() {
    gameOver = true;
    ctx.fillStyle = 'black';
    ctx.font = '50px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart';
    restartButton.style.position = 'absolute';
    restartButton.style.left = (canvas.offsetLeft + canvas.width / 2 - 50) + 'px';
    restartButton.style.top = (canvas.offsetTop + canvas.height / 2 + 20) + 'px';
    restartButton.onclick = function() {
        window.location.reload();
    };
    document.body.appendChild(restartButton);
}

const timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame();
    }
}, 1000);

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

crowImage.onload = function() {
    update();
};