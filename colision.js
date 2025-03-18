const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;

// Mejorar el fondo con un gradiente
let gradient = ctx.createLinearGradient(0, 0, window_width, window_height);
gradient.addColorStop(0, "#1e3c72"); // Azul oscuro
gradient.addColorStop(1, "#2a5298"); // Azul claro
canvas.style.background = "none";

document.body.style.background = "linear-gradient(to bottom right, #1e3c72, #2a5298)";
document.body.style.margin = "0";
document.body.style.overflow = "hidden";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.originalColor = color;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * speed;
        this.isColliding = false;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
        
        context.fillStyle = "#FFF";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "16px Arial";
        context.fillText(this.text, this.posX, this.posY);
    }

    update() {
        this.posX += this.dx;
        this.posY += this.dy;

        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }

    checkCollision(otherCircle) {
        let dx = this.posX - otherCircle.posX;
        let dy = this.posY - otherCircle.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + otherCircle.radius;
    }

    handleCollision(otherCircle) {
        if (this.checkCollision(otherCircle)) {
            this.isColliding = true;
            otherCircle.isColliding = true;
            this.color = "#0000FF";
            otherCircle.color = "#0000FF";
            
            let tempDx = this.dx;
            let tempDy = this.dy;
            this.dx = otherCircle.dx;
            this.dy = otherCircle.dy;
            otherCircle.dx = tempDx;
            otherCircle.dy = tempDy;

            setTimeout(() => {
                this.color = this.originalColor;
                otherCircle.color = otherCircle.originalColor;
                this.isColliding = false;
                otherCircle.isColliding = false;
            }, 100);
        }
    }
}

let circles = [];
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        let speed = Math.random() * 4 + 1;
        let text = `C${i + 1}`;
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window_width, window_height);

    for (let i = 0; i < circles.length; i++) {
        circles[i].update();
        circles[i].color = circles[i].originalColor;
    }

    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            circles[i].handleCollision(circles[j]);
        }
    }

    circles.forEach(circle => circle.draw(ctx));
    requestAnimationFrame(animate);
}

generateCircles(10);
animate();
