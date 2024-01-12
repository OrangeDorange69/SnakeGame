
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const gridSize = 20;
        const headSize = 30;
        const foodSize = 30; 

        let snake = [{ x: 200, y: 200 }];
        let food = { x: 300, y: 300 };
        let speed = { x: gridSize, y: 0 };
        let score = 0;
        let isPaused = false;
        let isGameOver = false;

        const snakeHeadImage = new Image();
        snakeHeadImage.src = 'snakehead.png'; 

        const foodTexture = new Image();
        foodTexture.src = 'food.png';

        document.addEventListener('keydown', handleKeyPress);

        function handleKeyPress(event) {
            if (isGameOver && event.key === ' ') {
                restartGame();
            } else if (!isPaused && !isGameOver) {
                if (event.key === 'ArrowUp' && speed.y === 0) {
                    speed = { x: 0, y: -gridSize };
                } else if (event.key === 'ArrowDown' && speed.y === 0) {
                    speed = { x: 0, y: gridSize };
                } else if (event.key === 'ArrowLeft' && speed.x === 0) {
                    speed = { x: -gridSize, y: 0 };
                } else if (event.key === 'ArrowRight' && speed.x === 0) {
                    speed = { x: gridSize, y: 0 };
                } else if (event.key === ' ') {
                    isPaused = true;
                }
            } else if (isPaused && event.key === ' ') {
                isPaused = false;
                gameLoop();
            }
        }

        function gameLoop() {
            if (!isPaused && !isGameOver) {
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
                gameOver();
            }

            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    gameOver();
                }
            }
        }

        function restartGame() {
            isGameOver = false;
            isPaused = false;
            snake = [{ x: 200, y: 200 }];
            speed = { x: gridSize, y: 0 };
            score = 0;
            createFood();
            gameLoop();
            hideGameOverScreen();
        }

        function gameOver() {
            isGameOver = true;
            isPaused = false;
            showGameOverScreen();
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
            for (let i = 0; i < snake.length; i++) {
                if (i === 0) {
                    ctx.drawImage(snakeHeadImage, snake[i].x, snake[i].y, headSize, headSize);
                } else {
                    drawSnakeBodySegment(snake[i].x, snake[i].y, i);
                }
            }
        }

        function drawSnakeBodySegment(x, y, index) {
            const gradient = ctx.createLinearGradient(x, y, x + gridSize, y + gridSize);
            gradient.addColorStop(0, '#4CAF50');
            gradient.addColorStop(1, '#45a049');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, gridSize, gridSize);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(x, y, gridSize, gridSize);
        }

        function drawFood() {
            ctx.drawImage(foodTexture, food.x, food.y, foodSize, foodSize);
        }

        function drawScore() {
            ctx.font = '20px Arial';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, 30);
        }

        function showGameOverScreen() {
            document.getElementById('gameOverScreen').style.display = 'flex';
            document.getElementById('scoreText').textContent = `Your Score: ${score}`;
        }

        function hideGameOverScreen() {
            document.getElementById('gameOverScreen').style.display = 'none';
        }

        createFood();
        gameLoop();