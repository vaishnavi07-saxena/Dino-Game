// Get the canvas element and its drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the size of the canvas
canvas.width = 1600;
canvas.height = 200;

// Load the dinosaur image
const dinoImg = new Image();
dinoImg.src = 'https://www.shutterstock.com/shutterstock/photos/2158604895/display_1500/stock-vector-dinosaur-game-pixel-logo-vector-2158604895.jpg'; // Dinosaur image URL

// Dino settings
let dino = {
    xPos: 50, // X position of the dino
    yPos: canvas.height -50, // Y position (on the ground)
    width: 50, // Width of the dino
    height: 60, // Height of the dino
    verticalSpeed: 0, // Vertical speed (for jumping)
    gravity: 0.6, // Gravity effect on dino
    jumpStrength: -12, // How high the dino can jump
    isJumping: false, // Is the dino in the air?
    groundY: canvas.height - 50, // Ground level position
};

// Array to store obstacles
let obstacles = [];
let obstacleSpeed = 6; // Speed of the obstacles
let obstacleChance = 0.02; // Chance of creating a new obstacle
let obstacleWidth = 20; // Width of each obstacle
let obstacleHeight = 50; // Height of each obstacle
let minGapBetweenObstacles = 200; // Minimum space between obstacles
let lastObstaclePosX = canvas.width; // Position of the last obstacle
let isGameOver = false; // Game state
let playerScore = 0; // Player score

// Handle jump when spacebar is pressed
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !dino.isJumping && !isGameOver) {
        dino.verticalSpeed = dino.jumpStrength;
        dino.isJumping = true;
    }
});

// Function to create a new obstacle
function createNewObstacle() {
    const newObstaclePosX = lastObstaclePosX + Math.random() * minGapBetweenObstacles + 100; // Position for new obstacle
    const newObstacle = {
        xPos: newObstaclePosX,
        yPos: dino.groundY,
        width: obstacleWidth,
        height: obstacleHeight,
        color: '#555', // Color of the obstacle
    };
    obstacles.push(newObstacle);
    lastObstaclePosX = newObstaclePosX; // Update position for next obstacle
}

// Function to check if the dino hits an obstacle
function detectCollision(obstacle) {
    return (
        dino.xPos < obstacle.xPos + obstacle.width &&
        dino.xPos + dino.width > obstacle.xPos &&
        dino.yPos < obstacle.yPos &&
        dino.yPos + dino.height > obstacle.yPos - obstacle.height
    );
}

// Function to draw the dino on the canvas
function drawDino() {
    ctx.drawImage(dinoImg, dino.xPos, dino.yPos, dino.width, dino.height);
}

// Main game loop
function gameLoop() {
    if (isGameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '32px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
        return; // Stop the game loop
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply gravity to the dino
    dino.verticalSpeed += dino.gravity;
    dino.yPos += dino.verticalSpeed;

    // Prevent the dino from falling below the ground
    if (dino.yPos + dino.height > dino.groundY) {
        dino.yPos = dino.groundY - dino.height;
        dino.verticalSpeed = 0;
        dino.isJumping = false;
    }

    // Draw the dino
    drawDino();

    // Move and check obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.xPos -= obstacleSpeed;
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.xPos, obstacle.yPos - obstacle.height, obstacle.width, obstacle.height);

        if (detectCollision(obstacle)) {
            isGameOver = true;
        }

        // Remove obstacles that are off-screen
        if (obstacle.xPos + obstacle.width < 0) {
            obstacles.splice(index, 1);
            playerScore++;
        }
    });

    // Occasionally create new obstacles
    if (Math.random() < obstacleChance) {
        createNewObstacle();
    }

    // Display the score
    ctx.fillStyle = '#333';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${playerScore}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

// Start the game once the dinosaur image is loaded
dinoImg.onload = () => {
    gameLoop();
};
