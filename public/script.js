/**
 * Constants
 */
import Ball from "./Ball.js";
import { pad, unPad } from "./helper.js";
const WIDTH = 800;
const HEIGHT = 800;
const SPACING = 40;
const OBS_RADIUS = 4;
const OBS_COLOR = 'white';
const GRAVITY = pad(0.2);
const CONTAINER_COUNT = 16;

const bet = 100;
let currAmount = 1000;

const OBSTRACLES = [];
const CONTAINER = [];
let balls = [];
const MULTIPLIER = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]
const POINTS = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [], 13: [], 14: [], 15: [], 16: [] }


const canvas = document.getElementById('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext('2d');
const addBallBtn = document.getElementById('addBall');
const currAmountContainer = document.getElementById('currAmount');
currAmountContainer.innerHTML = currAmount.toFixed(2);

for (let i = 2; i < CONTAINER_COUNT + 2; i++) {
    for (let j = 0; j < i + 1; j++) {
        OBSTRACLES.push({
            x: pad(WIDTH / 2 + SPACING * (i / 2 - j)),
            y: pad(i * SPACING),
            r: pad(OBS_RADIUS)
        });
    }
}

for (let i = 0; i < CONTAINER_COUNT + 1; i++) {
    CONTAINER.push({
        x: pad(WIDTH / 2 - SPACING * ((CONTAINER_COUNT + 1) / 2 - i) + SPACING * 0.2),
        y: pad(CONTAINER_COUNT * SPACING + 3 * SPACING / 2),
        w: pad(SPACING / 1.3),
        h: pad(SPACING)
    });
}


function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    OBSTRACLES.forEach(obstacle => {
        ctx.beginPath();
        ctx.arc(unPad(obstacle.x), unPad(obstacle.y), unPad(obstacle.r), 0, Math.PI * 2);
        ctx.fillStyle = OBS_COLOR;
        ctx.fill();
        ctx.closePath();
    });
    CONTAINER.forEach((container, i) => {
        ctx.beginPath();
        ctx.rect(unPad(container.x), unPad(container.y), unPad(container.w), unPad(container.h));
        ctx.fillStyle = OBS_COLOR;
        ctx.fill();
        ctx.font = "12px Arial";
        ctx.fillStyle = 'black';
        ctx.fillText(MULTIPLIER[i] + 'x', unPad(container.x) + unPad(container.w) / 2 - 12, unPad(container.y + container.h / 2 + 5));
        ctx.closePath();
    });
    if (bet < 0.01) {
        alert('Game Over');
        bet = 100;
        return;
    }
    if (bet > 1000000) {
        alert('You won!');
        bet = 100;
        return;
    }
    balls.forEach(ball => {
        ball.show();
        ball.move();
    });

    balls = balls.filter(ball => {
        if (ball.markedForDeletion) {
            if (ball.colidedWith !== null) {
                POINTS[ball.colidedWith].push(Math.round(ball.start * 1e4) / 1e4);
                currAmount += bet * MULTIPLIER[ball.colidedWith];
                currAmountContainer.innerHTML = currAmount.toFixed(2);
            }
            return false;
        }
        return true;
    });
    requestAnimationFrame(draw);
}

async function addBall() {
    if (currAmount < bet) {
        alert('Out of funds');
        return;
    }
    fetch('/bet').then(res => res.json()).then(data => {
        currAmount -= bet;
        currAmountContainer.innerHTML = currAmount.toFixed(2);
        const point = data.point;
        const x = point;
        const y = pad(SPACING);
        const r = pad(OBS_RADIUS * 1.6);
        const ball = new Ball(x, y, r, GRAVITY, ctx, OBSTRACLES, CONTAINER);
        balls.push(ball);
    }).catch((err) => {
        console.log(err);
    })
    // const x = pad(WIDTH / 2 + Math.random() * 2 * SPACING - SPACING);
    // const y = pad(SPACING);
    // const r = pad(OBS_RADIUS * 1.6);
    // const ball = new Ball(x, y, r, GRAVITY, ctx, OBSTRACLES, CONTAINER);
    // balls.push(ball);
}

draw()

addBallBtn.addEventListener('click', addBall)