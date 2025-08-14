const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bounceSound = new Audio('bounce.mp3');
const dieSound = new Audio('die.mp3');

// Player
const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 20,
    color: 'blue',
    speed: 25
};

// Egg
const egg = {
    x: canvas.width / 2,
    y: 50,
    radius: 15,
    color: 'white',
    dx: 2, // horizontal velocity
    dy: -5 // vertical velocity
};

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEgg() {
    ctx.beginPath();
    ctx.ellipse(egg.x, egg.y, egg.radius, egg.radius * 1.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = egg.color;
    ctx.fill();
    ctx.closePath();
}

let isGameOver = false;
let score = 0;

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

function update() {
    if (isGameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
        return;
    }
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawEgg();
    drawScore();

    // Egg movement
    egg.x += egg.dx;
    egg.y += egg.dy;

    // very basic gravity
    egg.dy += 0.1;


    // Wall collision
    if (egg.x + egg.radius > canvas.width || egg.x - egg.radius < 0) {
        egg.dx = -egg.dx;
    }

    // Player collision
    if (egg.y + egg.radius > player.y && egg.x > player.x && egg.x < player.x + player.width) {
        egg.dy = -egg.dy * 0.95; // bounce with some energy loss
        score++;
        bounceSound.play().catch(error => {
            console.error("Failed to play sound:", error);
        });
    }


    // Ground collision (game over)
    if (egg.y + egg.radius > canvas.height) {
        isGameOver = true;
        dieSound.play().catch(error => {
            console.error("Failed to play sound:", error);
        });
    }


    requestAnimationFrame(update);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (isGameOver && e.key === 'Enter') {
        document.location.reload();
    }
    if (e.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
});


update();