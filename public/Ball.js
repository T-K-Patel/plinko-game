import { pad, unPad } from "./helper.js";

const HORIZONTAL_BOUNCE_FACTOR = 0.4;
const VERTICAL_BOUNCE_FACTOR = 0.8;
export default class Ball {
    constructor(x, y, r, gravity, ctx, e, obs = [], container = []) {
        this.start = x;
        this.x = x;
        this.y = y;
        this.r = r;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.gravity = gravity;
        this.obs = obs;
        this.container = container;
        this.ctx = ctx;
        this.markedForDeletion = false;
        this.colidedWith = null;
        this.earning = e;
    }

    show() {
        this.ctx.beginPath();
        this.ctx.arc(unPad(this.x), unPad(this.y), unPad(this.r), 0, Math.PI * 2);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
        this.ctx.closePath();
    }

    move() {
        this.ySpeed += this.gravity;
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        this.obs.forEach(obstacle => {
            const distance = Math.hypot((this.x - obstacle.x), (this.y - obstacle.y));
            if (distance < this.r + obstacle.r) {
                const contactAngle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
                const speed = Math.hypot(this.xSpeed, this.ySpeed);
                this.xSpeed = speed * Math.cos(contactAngle) * HORIZONTAL_BOUNCE_FACTOR;
                this.ySpeed = speed * Math.sin(contactAngle) * VERTICAL_BOUNCE_FACTOR;
                this.x += (this.r + obstacle.r - distance) * Math.cos(contactAngle);
                this.y += (this.r + obstacle.r - distance) * Math.sin(contactAngle);
            }
        })
        if (this.y > this.container[0].y + this.container[0].h + this.r) {
            this.markedForDeletion = true;
        }
        this.container.forEach((container, i) => {
            if (this.x > container.x && this.x < container.x + container.w && this.y > container.y && this.y < container.y + container.h) {
                this.colidedWith = i;
                this.markedForDeletion = true;
            }
        })
    }
}