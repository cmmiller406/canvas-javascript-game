"use strict";

//Storing reference to the canvas element to the canvas variable
const canvas = document.getElementById("myCanvas");
//Creating ctx variable to store the 2D rendering context
const ctx = canvas.getContext("2d");

//Defining starting point at the bottom center part of Canvas in variables x and y & using them to define position of circle
let x = canvas.width / 2;
let y = canvas.height - 30;

//Updates our x and y variables on every frame so the ball moves
let dx = 2;
let dy = -2;

//Defines radius of our ball
let ballRadius = 10;

//Defines height and width of our paddle and its starting point on canvas
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

//Defining and initializing pressed buttons with boolean variables
let rightPressed = false;
let leftPressed = false;

//Defining number of rows and columns of bricks
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

//Defining variable to track score & player lives
let score = 0;
let lives = 3;


//Loop through the rows and columns and create new bricks
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//Function that create the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "teal";
    ctx.fill();
    ctx.closePath();
}

//Function to create the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "purple";
    ctx.fill();
    ctx.closePath();
}

//Function to loop through all the bricks in the array and draw them on the screen
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1){
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "navy";
                ctx.fill();
                ctx.closePath();
            }
           
        }
    }
}

//Function that clears the ball every frame so it appears to move
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    x += dx;
    y += dy;

    //Checks on every frame if the ball is touching top edge of canvas or bottom edge of canvas and reverses the y axis movement
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if(!lives){
                alert("Game Over");
                document.location.reload();
                clearInterval(interval);
            } else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    //Checks if the ball is touching left or right edge and reverses x axis movement
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    //Moves paddle left or right 7 pixels on the screen
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

}


//Event listeners that listen for key presses and mouse and will run functions
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//Function takes an event as a parameter. Key holds the information about the key that was pressed and changes boolean to either true or false
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

//Function so that the paddle will follow the position of the mouse cursor
function mouseMoveHandler(e){
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
}


//Function to detect collision by looping through all the bricks and comparing every single brick's position with the ball's coordinates
function collisionDetection(){
    for (let c = 0; c < brickColumnCount; c++){
        for (let r = 0; r < brickRowCount; r++){
            let b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount*brickColumnCount){
                        alert("You Win!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
           
        }
    }
}

//Function to create and update the score display
function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "purple";
    ctx.fillText("Score: "+score, 8, 20);
}

//Function to create and update player lives
function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "teal";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

//Calling draw function every 10 milliseconds
let interval = setInterval(draw, 10);




//How to create a rectangle
/*ctx.beginPath();
ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();

//How to create a circle
ctx.beginPath();
ctx.arc(240, 160, 20 , 0, Math.PI*2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

//How to create an empty rectangle
ctx.beginPath();
ctx.rect(160, 10, 100, 40);
ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
ctx.stroke();
ctx.closePath();*/