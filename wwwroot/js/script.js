// Game Variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = 'right';
let gameInterval;
let lastSpeedIncreaseLength = 0;
let score = 0;
let highScore = 0;

document.getElementById('startButton').addEventListener('click', startGame);


// Create game map, snake and food
function createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const gridElement = document.createElement('div');
            gridElement.classList.add('gridElement');
            gameBoard.appendChild(gridElement);
        }
    }
}


// Create Snake
function renderSnake() {
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.classList.add('snakeSegment');
        gameBoard.appendChild(snakeElement);
    })
}


// Create Food
function renderFood() {
    const foodElement = document.createElement('div');
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.gridRowStart = food.y;
    foodElement.classList.add('foodItem');
    gameBoard.appendChild(foodElement);
}

// Collision
function checkCollision() {
    // Grid
    if (snake[0].x < 1 || snake[0].x > gridSize || snake[0].y < 1 || snake[0].y > gridSize) {
        return true;
    }
    // Snake    
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    return false;
}


// Generate Food
function generateFood() {
    let potentialPositions = [];
    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {
            if (!snake.some(segment => segment.x === i && segment.y === j)) {
                potentialPositions.push({ x: i, y: j });
            }
        }
    }

    if (potentialPositions.length > 0) {
        let randomIndex = Math.floor(Math.random() * potentialPositions.length);
        food = potentialPositions[randomIndex];
    }
}


// Move Snake
function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };
    switch (direction) {
        case 'right':
            head.x += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
    }
        
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        generateFood();
        updateScore(score + 1);
    } else {
        snake.pop();
    }
}


document.addEventListener('keydown', e => {
    const oppositeDirection = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };

    if (e.key.startsWith('Arrow')) {
        const newDirection = e.key.replace('Arrow', '').toLowerCase();
        if (direction !== oppositeDirection[newDirection]) {
            direction = newDirection;
        }
    }
});

// Update Score
function updateScore(newScore) {
    score = newScore;
    document.getElementById('score').innerText = score;
    if (score > highScore) {
        highScore = score;
        document.getElementById('highScore').innerText = highScore;
    }
}

// Reset Score
function resetScore() {
    updateScore(0);
}




// Start Game
function startGame() {
    
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };
    direction = 'right';
    resetScore();
    createGameBoard();
    renderSnake();
    renderFood();
    
    if (gameInterval) clearInterval(gameInterval); 
    gameInterval = setInterval(gameLoop, 200); 
}

// Stop Game
function stopGame() {
    if (gameInterval) clearInterval(gameInterval);
    alert("Game Over! Press OK to restart.");
    startGame();
}


// Game loop
function gameLoop() {
    if (checkCollision()) {
        stopGame();
        return;
    }
    moveSnake();
    createGameBoard();
    renderSnake();
    renderFood();

    if (snake.length % 5 === 0 && snake.length !== lastSpeedIncreaseLength) {
        clearInterval(gameInterval);
        lastSpeedIncreaseLength = snake.length;
        let newInterval = Math.max(100, 200 - Math.floor(snake.length / 5) * 10);
        gameInterval = setInterval(gameLoop, newInterval);
    }
}