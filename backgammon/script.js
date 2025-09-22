class BackgammonGame {
    constructor() {
        this.currentPlayer = 'white';
        this.dice = [1, 1];
        this.availableMoves = [];
        this.selectedChecker = null;
        this.gameBoard = this.initializeBoard();
        this.bearOffWhite = [];
        this.bearOffBlack = [];
        this.barWhite = [];
        this.barBlack = [];
        
        this.initializeDOM();
        this.setupEventListeners();
        this.renderBoard();
    }
    
    initializeBoard() {
        // Standard backgammon starting position
        const board = Array(25).fill(null).map(() => []);
        
        // White pieces (moving from 1 to 24)
        board[1] = Array(2).fill('white');
        board[12] = Array(5).fill('white');
        board[17] = Array(3).fill('white');
        board[19] = Array(5).fill('white');
        
        // Black pieces (moving from 24 to 1)
        board[24] = Array(2).fill('black');
        board[13] = Array(5).fill('black');
        board[8] = Array(3).fill('black');
        board[6] = Array(5).fill('black');
        
        return board;
    }
    
    initializeDOM() {
        this.rollDiceBtn = document.getElementById('rollDice');
        this.dice1Element = document.getElementById('dice1');
        this.dice2Element = document.getElementById('dice2');
        this.currentPlayerElement = document.getElementById('currentPlayer');
        this.gameMessageElement = document.getElementById('gameMessage');
        this.movesLeftElement = document.getElementById('movesLeft');
        this.endTurnBtn = document.getElementById('endTurn');
        this.newGameBtn = document.getElementById('newGame');
        this.gameBoardElement = document.getElementById('gameBoard');
        this.barElement = document.getElementById('bar');
        this.whiteBearOffElement = document.getElementById('whiteBearOff');
        this.blackBearOffElement = document.getElementById('blackBearOff');
    }
    
    setupEventListeners() {
        this.rollDiceBtn.addEventListener('click', () => this.rollDice());
        this.endTurnBtn.addEventListener('click', () => this.endTurn());
        this.newGameBtn.addEventListener('click', () => this.newGame());
        
        // Add click listeners to points and checkers
        this.gameBoardElement.addEventListener('click', (e) => {
            // Check if clicked on a checker
            if (e.target.classList.contains('checker')) {
                const pointElement = e.target.closest('.point');
                if (pointElement) {
                    const pointNumber = parseInt(pointElement.dataset.point);
                    this.handleCheckerClick(pointNumber);
                }
                return;
            }
            
            // Check if clicked on a point
            if (e.target.classList.contains('point') || e.target.closest('.point')) {
                const pointElement = e.target.classList.contains('point') ? e.target : e.target.closest('.point');
                const pointNumber = parseInt(pointElement.dataset.point);
                this.handlePointClick(pointNumber);
            }
        });
        
        // Add click listener to bar
        this.barElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('checker')) {
                this.handleBarCheckerClick();
            } else {
                this.handleBarClick();
            }
        });
    }
    
    rollDice() {
        this.dice1Element.classList.add('rolling');
        this.dice2Element.classList.add('rolling');
        
        setTimeout(() => {
            this.dice = [
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ];
            
            this.dice1Element.textContent = this.dice[0];
            this.dice2Element.textContent = this.dice[1];
            this.dice1Element.classList.remove('rolling');
            this.dice2Element.classList.remove('rolling');
            
            // If doubles, player gets 4 moves
            if (this.dice[0] === this.dice[1]) {
                this.availableMoves = [this.dice[0], this.dice[0], this.dice[0], this.dice[0]];
            } else {
                this.availableMoves = [...this.dice];
            }
            
            this.updateMovesLeft();
            this.rollDiceBtn.disabled = true;
            this.endTurnBtn.disabled = false;
            this.gameMessageElement.textContent = 'Select a checker to move!';
            
            this.highlightValidMoves();
        }, 500);
    }
    
    handleCheckerClick(pointNumber) {
        if (this.availableMoves.length === 0) {
            this.gameMessageElement.textContent = 'Roll dice first!';
            return;
        }
        
        const point = this.gameBoard[pointNumber];
        
        // Only allow selecting own checkers
        if (point.length > 0 && point[point.length - 1] === this.currentPlayer) {
            // Check if player has pieces on bar that must be moved first
            const barPieces = this.currentPlayer === 'white' ? this.barWhite : this.barBlack;
            if (barPieces.length > 0) {
                this.gameMessageElement.textContent = 'You must move pieces from the bar first!';
                return;
            }
            
            this.selectChecker(pointNumber);
        } else {
            this.gameMessageElement.textContent = 'You can only move your own pieces!';
        }
    }
    
    handlePointClick(pointNumber) {
        if (this.availableMoves.length === 0) return;
        
        if (this.selectedChecker) {
            // Try to move to this point
            this.attemptMove(this.selectedChecker.point, pointNumber);
        }
    }
    
    handleBarCheckerClick() {
        if (this.availableMoves.length === 0) {
            this.gameMessageElement.textContent = 'Roll dice first!';
            return;
        }
        
        const barPieces = this.currentPlayer === 'white' ? this.barWhite : this.barBlack;
        if (barPieces.length > 0 && barPieces[barPieces.length - 1] === this.currentPlayer) {
            this.selectChecker('bar');
        }
    }
    
    handleBarClick() {
        if (this.availableMoves.length === 0) return;
        
        const barPieces = this.currentPlayer === 'white' ? this.barWhite : this.barBlack;
        if (barPieces.length > 0) {
            this.selectChecker('bar');
        }
    }
    
    selectChecker(location) {
        this.clearSelection();
        this.selectedChecker = { point: location };
        
        // Highlight the selected checker
        if (location !== 'bar') {
            const pointElement = document.querySelector(`[data-point="${location}"]`);
            const checkers = pointElement.querySelectorAll('.checker');
            if (checkers.length > 0) {
                checkers[checkers.length - 1].classList.add('selected');
            }
        } else {
            const barCheckers = this.barElement.querySelectorAll('.checker');
            if (barCheckers.length > 0) {
                barCheckers[barCheckers.length - 1].classList.add('selected');
            }
        }
        
        this.highlightValidMoves();
        this.gameMessageElement.textContent = `Selected checker from ${location === 'bar' ? 'bar' : 'point ' + location}. Click destination!`;
    }
    
    clearSelection() {
        this.selectedChecker = null;
        document.querySelectorAll('.point').forEach(point => {
            point.classList.remove('valid-move');
        });
        document.querySelectorAll('.checker').forEach(checker => {
            checker.classList.remove('selected');
        });
    }
    
    highlightValidMoves() {
        if (!this.selectedChecker) return;
        
        const fromPoint = this.selectedChecker.point;
        
        this.availableMoves.forEach(move => {
            let targetPoint;
            
            if (fromPoint === 'bar') {
                // Moving from bar
                targetPoint = this.currentPlayer === 'white' ? move : 25 - move;
            } else {
                // Normal move
                targetPoint = this.currentPlayer === 'white' ? fromPoint + move : fromPoint - move;
            }
            
            if (this.isValidMove(fromPoint, targetPoint, move)) {
                if (targetPoint >= 1 && targetPoint <= 24) {
                    const pointElement = document.querySelector(`[data-point="${targetPoint}"]`);
                    if (pointElement) {
                        pointElement.classList.add('valid-move');
                    }
                }
            }
        });
    }
    
    isValidMove(fromPoint, toPoint, diceValue) {
        // Check if moving from bar
        if (fromPoint === 'bar') {
            const barPieces = this.currentPlayer === 'white' ? this.barWhite : this.barBlack;
            if (barPieces.length === 0) return false;
            
            if (toPoint < 1 || toPoint > 24) return false;
            
            const targetPoint = this.gameBoard[toPoint];
            return targetPoint.length === 0 || 
                   targetPoint[targetPoint.length - 1] === this.currentPlayer ||
                   (targetPoint[targetPoint.length - 1] !== this.currentPlayer && targetPoint.length === 1);
        }
        
        // Check if there are pieces on the bar that need to be moved first
        const barPieces = this.currentPlayer === 'white' ? this.barWhite : this.barBlack;
        if (barPieces.length > 0) return false;
        
        // Check if source point has player's pieces
        if (fromPoint < 1 || fromPoint > 24) return false;
        const sourcePoint = this.gameBoard[fromPoint];
        if (sourcePoint.length === 0 || sourcePoint[sourcePoint.length - 1] !== this.currentPlayer) {
            return false;
        }
        
        // Check bearing off
        if ((this.currentPlayer === 'white' && toPoint > 24) || 
            (this.currentPlayer === 'black' && toPoint < 1)) {
            return this.canBearOff() && this.isValidBearOff(fromPoint, diceValue);
        }
        
        // Check normal move
        if (toPoint < 1 || toPoint > 24) return false;
        
        const targetPoint = this.gameBoard[toPoint];
        return targetPoint.length === 0 || 
               targetPoint[targetPoint.length - 1] === this.currentPlayer ||
               (targetPoint[targetPoint.length - 1] !== this.currentPlayer && targetPoint.length === 1);
    }
    
    canBearOff() {
        const homeBoard = this.currentPlayer === 'white' ? [19, 20, 21, 22, 23, 24] : [1, 2, 3, 4, 5, 6];
        
        // Check if all pieces are in home board or already borne off
        for (let i = 1; i <= 24; i++) {
            if (this.gameBoard[i].some(piece => piece === this.currentPlayer)) {
                if (!homeBoard.includes(i)) {
                    return false;
                }
            }
        }
        
        // Check bar
        const barPieces = this.currentPlayer === 'white' ? this.barWhite : this.barBlack;
        return barPieces.length === 0;
    }
    
    isValidBearOff(fromPoint, diceValue) {
        if (this.currentPlayer === 'white') {
            const expectedPoint = fromPoint + diceValue;
            if (expectedPoint === 25) return true;
            if (expectedPoint > 25) {
                // Can bear off if no pieces on higher points
                for (let i = fromPoint + 1; i <= 24; i++) {
                    if (this.gameBoard[i].some(piece => piece === 'white')) {
                        return false;
                    }
                }
                return true;
            }
        } else {
            const expectedPoint = fromPoint - diceValue;
            if (expectedPoint === 0) return true;
            if (expectedPoint < 0) {
                // Can bear off if no pieces on higher points
                for (let i = 1; i < fromPoint; i++) {
                    if (this.gameBoard[i].some(piece => piece === 'black')) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }
    
    attemptMove(fromPoint, toPoint) {
        let diceValue;
        
        // Calculate dice value needed for this move
        if (fromPoint === 'bar') {
            diceValue = this.currentPlayer === 'white' ? toPoint : 25 - toPoint;
        } else {
            diceValue = this.currentPlayer === 'white' ? toPoint - fromPoint : fromPoint - toPoint;
        }
        
        // Handle bearing off
        if ((this.currentPlayer === 'white' && toPoint > 24) || 
            (this.currentPlayer === 'black' && toPoint < 1)) {
            if (this.canBearOff()) {
                const availableIndex = this.availableMoves.findIndex(move => {
                    return this.isValidBearOff(fromPoint, move);
                });
                
                if (availableIndex !== -1) {
                    this.executeBearOff(fromPoint, this.availableMoves[availableIndex]);
                    return;
                }
            }
            this.gameMessageElement.textContent = 'Cannot bear off yet! Move all pieces to home board first.';
            return;
        }
        
        // Find matching dice value
        const availableIndex = this.availableMoves.indexOf(diceValue);
        if (availableIndex === -1) {
            this.gameMessageElement.textContent = `No dice shows ${diceValue}! Try a different move.`;
            return;
        }
        
        if (!this.isValidMove(fromPoint, toPoint, diceValue)) {
            this.gameMessageElement.textContent = 'Invalid move! That point is blocked.';
            return;
        }
        
        this.executeMove(fromPoint, toPoint, availableIndex);
    }
    
    executeMove(fromPoint, toPoint, diceIndex) {
        // Handle moving from bar
        if (fromPoint === 'bar') {
            const barPieces = this.currentPlayer === 'white' ? this.barWhite : this.barBlack;
            barPieces.pop();
        } else {
            // Remove piece from source point
            this.gameBoard[fromPoint].pop();
        }
        
        // Handle hitting opponent's piece
        const targetPoint = this.gameBoard[toPoint];
        if (targetPoint.length === 1 && targetPoint[0] !== this.currentPlayer) {
            const hitPiece = targetPoint.pop();
            if (hitPiece === 'white') {
                this.barWhite.push(hitPiece);
            } else {
                this.barBlack.push(hitPiece);
            }
        }
        
        // Place piece on target point
        this.gameBoard[toPoint].push(this.currentPlayer);
        
        // Remove used dice
        this.availableMoves.splice(diceIndex, 1);
        
        this.clearSelection();
        this.renderBoard();
        this.updateMovesLeft();
        
        if (this.availableMoves.length === 0) {
            this.endTurn();
        } else {
            this.gameMessageElement.textContent = 'Select next checker to move!';
            this.highlightValidMoves();
        }
        
        this.checkWinCondition();
    }
    
    executeBearOff(fromPoint, diceValue) {
        // Remove piece from board
        this.gameBoard[fromPoint].pop();
        
        // Add to bear off area
        if (this.currentPlayer === 'white') {
            this.bearOffWhite.push('white');
        } else {
            this.bearOffBlack.push('black');
        }
        
        // Remove used dice
        const diceIndex = this.availableMoves.findIndex(move => {
            return this.isValidBearOff(fromPoint, move);
        });
        this.availableMoves.splice(diceIndex, 1);
        
        this.clearSelection();
        this.renderBoard();
        this.updateMovesLeft();
        
        if (this.availableMoves.length === 0) {
            this.endTurn();
        } else {
            this.gameMessageElement.textContent = 'Select next checker to move!';
        }
        
        this.checkWinCondition();
    }
    
    checkWinCondition() {
        if (this.bearOffWhite.length === 15) {
            this.showWinMessage('White wins!');
        } else if (this.bearOffBlack.length === 15) {
            this.showWinMessage('Black wins!');
        }
    }
    
    showWinMessage(message) {
        const winDiv = document.createElement('div');
        winDiv.className = 'win-message';
        winDiv.innerHTML = `
            <h2>${message}</h2>
            <button onclick="this.parentElement.remove(); window.backgammon.newGame();">New Game</button>
        `;
        document.body.appendChild(winDiv);
    }
    
    endTurn() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.currentPlayerElement.textContent = this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1);
        this.availableMoves = [];
        this.clearSelection();
        this.rollDiceBtn.disabled = false;
        this.endTurnBtn.disabled = true;
        this.gameMessageElement.textContent = 'Roll dice to start your turn!';
        this.updateMovesLeft();
    }
    
    updateMovesLeft() {
        this.movesLeftElement.textContent = this.availableMoves.length;
    }
    
    newGame() {
        this.currentPlayer = 'white';
        this.dice = [1, 1];
        this.availableMoves = [];
        this.selectedChecker = null;
        this.gameBoard = this.initializeBoard();
        this.bearOffWhite = [];
        this.bearOffBlack = [];
        this.barWhite = [];
        this.barBlack = [];
        
        this.currentPlayerElement.textContent = 'White';
        this.rollDiceBtn.disabled = false;
        this.endTurnBtn.disabled = true;
        this.gameMessageElement.textContent = 'Roll dice to start your turn!';
        this.updateMovesLeft();
        this.renderBoard();
        
        // Remove any win messages
        document.querySelectorAll('.win-message').forEach(msg => msg.remove());
    }
    
    renderBoard() {
        // Clear existing checkers
        document.querySelectorAll('.checker').forEach(checker => checker.remove());
        
        // Render checkers on points
        for (let i = 1; i <= 24; i++) {
            const point = this.gameBoard[i];
            const pointElement = document.querySelector(`[data-point="${i}"]`);
            
            point.forEach((piece, index) => {
                const checker = document.createElement('div');
                checker.className = `checker ${piece}`;
                
                // Position checkers properly based on point location
                if (i >= 13 && i <= 24) {
                    // Top half - stack from top
                    checker.style.top = `${index * 30}px`;
                } else {
                    // Bottom half - stack from bottom
                    checker.style.bottom = `${index * 30}px`;
                }
                
                checker.style.left = '50%';
                checker.style.transform = 'translateX(-50%)';
                
                // Show number only for stacks > 5
                if (index >= 5) {
                    checker.textContent = point.length;
                    checker.style.fontSize = '12px';
                    checker.style.fontWeight = 'bold';
                }
                
                pointElement.appendChild(checker);
            });
        }
        
        // Render checkers on bar
        this.barElement.innerHTML = '';
        [...this.barWhite, ...this.barBlack].forEach((piece, index) => {
            const checker = document.createElement('div');
            checker.className = `checker ${piece}`;
            checker.style.position = 'relative';
            checker.style.marginBottom = '5px';
            this.barElement.appendChild(checker);
        });
        
        // Render bear off areas
        this.whiteBearOffElement.innerHTML = '<h3>White Home</h3>';
        this.bearOffWhite.forEach((piece, index) => {
            const checker = document.createElement('div');
            checker.className = `checker ${piece}`;
            checker.style.position = 'relative';
            checker.style.margin = '2px auto';
            this.whiteBearOffElement.appendChild(checker);
        });
        
        this.blackBearOffElement.innerHTML = '<h3>Black Home</h3>';
        this.bearOffBlack.forEach((piece, index) => {
            const checker = document.createElement('div');
            checker.className = `checker ${piece}`;
            checker.style.position = 'relative';
            checker.style.margin = '2px auto';
            this.blackBearOffElement.appendChild(checker);
        });
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.backgammon = new BackgammonGame();
});