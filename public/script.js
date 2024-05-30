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
let currAmount = 0;
let finalAmount = 0;

const OBSTRACLES = [];
const CONTAINER = [];
let balls = [];
const MULTIPLIER = [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16]


const canvas = document.getElementById('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
const ctx = canvas.getContext('2d');
const addBallBtn = document.getElementById('addBall');
const currAmountContainer = document.getElementById('currAmount');
currAmountContainer.innerHTML = currAmount.toFixed(2);
let ballAdded = false;


/**
 * check the url if it doesnt have username, then take username from pompt
 */
const url = new URL(window.location.href);
let username = url.searchParams.get('username');

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

const fetchCurrBalance = () => fetch(`/${username}/balance`).then(res => res.json()).then(data => {
    currAmount = data.balance;
    currAmountContainer.innerHTML = currAmount.toFixed(2);
    finalAmount = currAmount
}).catch(err => console.log(err));

function draw() {
    document.getElementById("ballCount").innerHTML = balls.length
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
            if (Math.round(ball.earning * 100) != Math.round((MULTIPLIER[ball.colidedWith] - 1) * 100 * 100)) {
                alert("Some Error Occured")
            };
            currAmount += ball.earning;
            return false;
        }
        return true;
    });
    currAmountContainer.innerHTML = currAmount.toFixed(2);
    if (balls.length == 0 && ballAdded) {
        ballAdded = false;
        fetchCurrBalance();
    }
    requestAnimationFrame(draw);

}

async function addBall(username) {
    if (balls.length + 1 > (currAmount / 50)) {
        return alert("Wait till some balls gets to the sink")
    }
    const resp = await fetch("/" + username + '/bet')
    if (resp.status != 200 && resp.status != 400) {
        console.log(resp)
        return alert("Something went wrong")
    }
    ballAdded = true;
    const data = await resp.json();

    if (!data.point) { return alert(data.error) }
    const point = data.point;
    const x = point;
    const y = pad(SPACING);
    const r = pad(OBS_RADIUS * 1.6);
    finalAmount = data.updatedBalance;
    const ball = new Ball(x, y, r, GRAVITY, ctx, data.earn, OBSTRACLES, CONTAINER);
    balls.push(ball);
    // const x = pad(WIDTH / 2 + Math.random() * 2 * SPACING - SPACING);
    // const y = pad(SPACING);
    // const r = pad(OBS_RADIUS * 1.6);
    // const ball = new Ball(x, y, r, GRAVITY, ctx, OBSTRACLES, CONTAINER);
    // balls.push(ball);
}

draw()

while (!username) {
    username = prompt('Enter your username');
    if (username) {
        url.searchParams.set('username', username);
        window.location.href = url.toString();
        break;
    }
}

fetchCurrBalance();

const addBallForm = document.getElementById('addBallForm');
addBallForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    addBallBtn.disabled = true;
    await addBall(username);
    addBallBtn.disabled = false
})