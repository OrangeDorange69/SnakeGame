const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;

let snake = [{ x: 200, y: 200 }];
let food = { x: 300, y: 300 };
let speed = { x: gridSize, y: 0 };
let score = 0;
let isPaused = false;

document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    if (event.key === 'ArrowUp' && speed.y === 0) {
        speed = { x: 0, y: -gridSize };
    } else if (event.key === 'ArrowDown' && speed.y === 0) {
        speed = { x: 0, y: gridSize };
    } else if (event.key === 'ArrowLeft' && speed.x === 0) {
        speed = { x: -gridSize, y: 0 };
    } else if (event.key === 'ArrowRight' && speed.x === 0) {
        speed = { x: gridSize, y: 0 };
    } else if (event.key === ' ' && !isPaused) {
        isPaused = true;
    } else if (event.key === ' ' && isPaused) {
        isPaused = false;
        gameLoop();
    }
}

function gameLoop() {
    if (!isPaused) {
        updateSnake();
        drawGame();
        setTimeout(gameLoop, 100);
    }
}

function updateSnake() {
    const head = { x: snake[0].x + speed.x, y: snake[0].y + speed.y };

    if (head.x === food.x && head.y === food.y) {
        createFood();
        score++;
    } else {
        snake.pop();
    }

    snake.unshift(head);

    checkCollision();
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    speed = { x: gridSize, y: 0 };
    score = 0;
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };

    let isFoodOnSnake = true;

    while (isFoodOnSnake) {
        isFoodOnSnake = false;

        for (const segment of snake) {
            if (food.x === segment.x && food.y === segment.y) {
                isFoodOnSnake = true;
                break;
            }
        }

        if (isFoodOnSnake) {
            food = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
                y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
            };
        }
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawScore();
}

function drawSnake() {
    for (const segment of snake) {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, 30);
}

createFood();
gameLoop();