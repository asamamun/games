class BubbleGame {
    constructor() {
        this.score = 0;
        this.misses = 0;
        this.gameOver = false;
        this.gameArea = document.getElementById('gameArea');
        this.scoreElement = document.getElementById('score');
        this.missesElement = document.getElementById('misses');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        this.bubbles = [];
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.gameSpeed = 2000; // Initial bubble spawn rate (ms)
        this.bubbleSpeed = 8; // Seconds for bubble to cross screen
        this.spawnInterval = null;
        this.difficultyInterval = null;
        
        this.init();
    }
    
    init() {
        this.startGame();
        this.setupKeyboardListener();
    }
    
    startGame() {
        // Start spawning bubbles
        this.spawnBubble();
        this.spawnInterval = setInterval(() => {
            if (!this.gameOver) {
                this.spawnBubble();
            }
        }, this.gameSpeed);
        
        // Gradually increase difficulty
        this.difficultyInterval = setInterval(() => {
            if (this.gameSpeed > 800 && !this.gameOver) {
                this.gameSpeed -= 50;
                clearInterval(this.spawnInterval);
                this.spawnInterval = setInterval(() => {
                    if (!this.gameOver) {
                        this.spawnBubble();
                    }
                }, this.gameSpeed);
            }
        }, 10000);
    }
    
    spawnBubble() {
        const bubble = document.createElement('div');
        const character = this.getRandomCharacter();
        const colorClass = `color-${Math.floor(Math.random() * 5) + 1}`;
        
        bubble.className = `bubble ${colorClass}`;
        bubble.textContent = character;
        bubble.dataset.character = character;
        
        // Random horizontal position
        const maxX = this.gameArea.clientWidth - 80;
        const x = Math.random() * maxX;
        bubble.style.left = x + 'px';
        
        // Set animation duration
        bubble.style.animationDuration = this.bubbleSpeed + 's';
        
        this.gameArea.appendChild(bubble);
        this.bubbles.push(bubble);
        
        // Store timeout ID on the bubble element so we can clear it if popped
        bubble.timeoutId = setTimeout(() => {
            this.removeBubble(bubble, true); // true indicates it was missed
        }, this.bubbleSpeed * 1000);
    }
    
    getRandomCharacter() {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    }
    
    setupKeyboardListener() {
        document.addEventListener('keydown', (event) => {
            if (!this.gameOver) {
                const pressedKey = event.key.toUpperCase();
                this.checkBubbleHit(pressedKey);
            }
        });
    }
    
    checkBubbleHit(key) {
        // Find the lowest bubble with matching character
        let targetBubble = null;
        let lowestPosition = -1;
        
        this.bubbles.forEach(bubble => {
            if (bubble.dataset.character === key) {
                const rect = bubble.getBoundingClientRect();
                const position = rect.top;
                
                if (position > lowestPosition) {
                    lowestPosition = position;
                    targetBubble = bubble;
                }
            }
        });
        
        if (targetBubble) {
            this.popBubble(targetBubble);
        }
    }
    
    popBubble(bubble) {
        // Clear the timeout to prevent it from counting as a miss
        if (bubble.timeoutId) {
            clearTimeout(bubble.timeoutId);
        }
        
        bubble.classList.add('pop');
        this.updateScore();
        
        // Remove from bubbles array
        const index = this.bubbles.indexOf(bubble);
        if (index > -1) {
            this.bubbles.splice(index, 1);
        }
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 300);
    }
    
    removeBubble(bubble, missed = false) {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
        
        const index = this.bubbles.indexOf(bubble);
        if (index > -1) {
            this.bubbles.splice(index, 1);
        }
        
        // If bubble was missed (not popped by user)
        if (missed && !this.gameOver) {
            this.updateMisses();
        }
    }
    
    updateMisses() {
        this.misses++;
        this.missesElement.textContent = this.misses;
        
        // Add visual feedback for miss
        this.missesElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.missesElement.style.transform = 'scale(1)';
        }, 200);
        
        // Check for game over
        if (this.misses >= 5) {
            this.endGame();
        }
    }
    
    endGame() {
        this.gameOver = true;
        
        // Stop spawning new bubbles
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        if (this.difficultyInterval) {
            clearInterval(this.difficultyInterval);
        }
        
        // Remove all existing bubbles
        this.bubbles.forEach(bubble => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        });
        this.bubbles = [];
        
        // Show game over screen
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'flex';
    }
    
    updateScore() {
        this.score++;
        this.scoreElement.textContent = this.score;
        
        // Check for speed increases at score milestones
        if (this.score === 30) {
            this.bubbleSpeed = 6; // Faster bubble movement
            this.gameSpeed = Math.max(1200, this.gameSpeed - 300); // More frequent spawning
            this.updateSpawnRate();
        } else if (this.score === 50) {
            this.bubbleSpeed = 4; // Even faster bubble movement
            this.gameSpeed = Math.max(800, this.gameSpeed - 400); // Even more frequent spawning
            this.updateSpawnRate();
        }
        
        // Add some visual feedback
        this.scoreElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.scoreElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateSpawnRate() {
        // Restart spawn interval with new speed
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        this.spawnInterval = setInterval(() => {
            if (!this.gameOver) {
                this.spawnBubble();
            }
        }, this.gameSpeed);
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new BubbleGame();
});