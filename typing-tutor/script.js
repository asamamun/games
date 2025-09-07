class TypingTutor {
    constructor() {
        this.score = 0;
        this.misses = 0;
        this.gameOver = false;
        this.startTime = Date.now();
        this.totalCharacters = 0;
        this.gameArea = document.getElementById('gameArea');
        this.scoreElement = document.getElementById('score');
        this.wpmElement = document.getElementById('wpm');
        this.missesElement = document.getElementById('misses');
        this.wordInput = document.getElementById('wordInput');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        this.finalWPMElement = document.getElementById('finalWPM');
        this.bubbles = [];
        this.gameSpeed = 3000; // Initial bubble spawn rate (ms)
        this.bubbleSpeed = 12; // Seconds for bubble to cross screen
        this.spawnInterval = null;
        this.difficultyInterval = null;
        
        // Use the comprehensive 2000-word list from words-2000.js
        this.words = words2000;
        
        this.init();
    }
    
    init() {
        this.startGame();
        this.setupInputListener();
        this.updateWPM();
    }
    
    startGame() {
        // Focus on input
        this.wordInput.focus();
        
        // Start spawning bubbles
        this.spawnBubble();
        this.spawnInterval = setInterval(() => {
            if (!this.gameOver) {
                this.spawnBubble();
            }
        }, this.gameSpeed);
        
        // Gradually increase difficulty
        this.difficultyInterval = setInterval(() => {
            if (this.gameSpeed > 1500 && !this.gameOver) {
                this.gameSpeed -= 100;
                this.updateSpawnRate();
            }
        }, 15000);
        
        // Update WPM every second
        setInterval(() => {
            if (!this.gameOver) {
                this.updateWPM();
            }
        }, 1000);
    }
    
    spawnBubble() {
        const bubble = document.createElement('div');
        const word = this.getRandomWord();
        const colorClass = `color-${Math.floor(Math.random() * 5) + 1}`;
        
        bubble.className = `bubble ${colorClass}`;
        bubble.textContent = word;
        bubble.dataset.word = word;
        
        // Random horizontal position
        const maxX = this.gameArea.clientWidth - 200;
        const x = Math.random() * maxX;
        bubble.style.left = x + 'px';
        
        // Set animation duration
        bubble.style.animationDuration = this.bubbleSpeed + 's';
        
        this.gameArea.appendChild(bubble);
        this.bubbles.push(bubble);
        
        // Store timeout ID on the bubble element
        bubble.timeoutId = setTimeout(() => {
            this.removeBubble(bubble, true); // true indicates it was missed
        }, this.bubbleSpeed * 1000);
    }
    
    getRandomWord() {
        console.log(this.words.length)
        return this.words[Math.floor(Math.random() * this.words.length)];
    }
    
    setupInputListener() {
        this.wordInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !this.gameOver) {
                this.checkWordMatch();
            }
        });
        
        // Prevent losing focus
        this.wordInput.addEventListener('blur', () => {
            if (!this.gameOver) {
                setTimeout(() => this.wordInput.focus(), 10);
            }
        });
    }
    
    checkWordMatch() {
        const typedWord = this.wordInput.value.trim().toLowerCase();
        if (!typedWord) return;
        
        // Find matching bubble (prioritize the lowest one)
        let targetBubble = null;
        let lowestPosition = -1;
        
        this.bubbles.forEach(bubble => {
            if (bubble.dataset.word.toLowerCase() === typedWord) {
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
            this.wordInput.value = '';
        } else {
            // Show incorrect feedback
            this.showIncorrectFeedback();
        }
    }
    
    showIncorrectFeedback() {
        this.wordInput.style.borderColor = '#e74c3c';
        this.wordInput.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
        
        setTimeout(() => {
            this.wordInput.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            this.wordInput.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        }, 300);
        
        this.wordInput.value = '';
    }
    
    popBubble(bubble) {
        // Clear the timeout to prevent it from counting as a miss
        if (bubble.timeoutId) {
            clearTimeout(bubble.timeoutId);
        }
        
        bubble.classList.add('pop');
        this.updateScore(bubble.dataset.word.length);
        
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
        }, 400);
    }
    
    removeBubble(bubble, missed = false) {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
        
        const index = this.bubbles.indexOf(bubble);
        if (index > -1) {
            this.bubbles.splice(index, 1);
        }
        
        // If bubble was missed (not typed by user)
        if (missed && !this.gameOver) {
            this.updateMisses();
        }
    }
    
    updateScore(wordLength) {
        this.score++;
        this.totalCharacters += wordLength;
        this.scoreElement.textContent = this.score;
        
        // Check for speed increases at score milestones
        if (this.score === 20) {
            this.bubbleSpeed = 10;
            this.gameSpeed = Math.max(2000, this.gameSpeed - 500);
            this.updateSpawnRate();
        } else if (this.score === 40) {
            this.bubbleSpeed = 8;
            this.gameSpeed = Math.max(1500, this.gameSpeed - 500);
            this.updateSpawnRate();
        }
        
        // Add visual feedback
        this.scoreElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.scoreElement.style.transform = 'scale(1)';
        }, 200);
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
    
    updateWPM() {
        const timeElapsed = (Date.now() - this.startTime) / 60000; // minutes
        const wpm = timeElapsed > 0 ? Math.round((this.totalCharacters / 5) / timeElapsed) : 0;
        this.wpmElement.textContent = wpm;
    }
    
    updateSpawnRate() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        this.spawnInterval = setInterval(() => {
            if (!this.gameOver) {
                this.spawnBubble();
            }
        }, this.gameSpeed);
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
        
        // Calculate final WPM
        const timeElapsed = (Date.now() - this.startTime) / 60000;
        const finalWPM = timeElapsed > 0 ? Math.round((this.totalCharacters / 5) / timeElapsed) : 0;
        
        // Show game over screen
        this.finalScoreElement.textContent = this.score;
        this.finalWPMElement.textContent = finalWPM;
        this.gameOverElement.style.display = 'flex';
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new TypingTutor();
});