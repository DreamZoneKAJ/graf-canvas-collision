const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;

// Mejorar el fondo con un gradiente animado
let gradient = ctx.createLinearGradient(0, 0, window_width, window_height);
gradient.addColorStop(0, "#1e3c72"); // Azul oscuro
gradient.addColorStop(1, "#2a5298"); // Azul claro
canvas.style.background = "none";

document.body.style.background = "linear-gradient(to bottom right, #1e3c72, #2a5298)";
document.body.style.margin = "0";
document.body.style.overflow = "hidden";

let score = 0;
const scoreDisplay = document.createElement("div");
scoreDisplay.style.position = "absolute";
scoreDisplay.style.top = "10px";
scoreDisplay.style.right = "20px";
scoreDisplay.style.color = "white";
scoreDisplay.style.fontSize = "20px";
scoreDisplay.style.fontFamily = "Arial";
document.body.appendChild(scoreDisplay);

class Circle {
    constructor(x, y, radius, color, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.dy = speed;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
    }

    update() {
        this.posY += this.dy;
        if (this.posY - this.radius > window_height) {
            this.posY = -this.radius;
            this.posX = Math.random() * (window_width - this.radius * 2) + this.radius; // Nueva posición aleatoria en X
        }
    }
}

let circles = [];
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = -radius; // Comienzan desde arriba
        let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        let speed = Math.random() * 3 + 1;
        circles.push(new Circle(x, y, radius, color, speed));
    }
}

canvas.addEventListener("mousedown", (event) => {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    
    circles = circles.filter(circle => {
        let dx = mouseX - circle.posX;
        let dy = mouseY - circle.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > circle.radius) {
            return true;
        } else {
            score++;
            scoreDisplay.innerText = `Círculos eliminados: ${score}`;
            return false;
        }
    });
    
    // Agregar un nuevo círculo tras eliminar uno
    let radius = Math.random() * 30 + 20;
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = -radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    let speed = Math.random() * 3 + 1;
    circles.push(new Circle(x, y, radius, color, speed));
});

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window_width, window_height);
    
    circles.forEach(circle => {
        circle.update();
        circle.draw(ctx);
    });
    
    requestAnimationFrame(animate);
}

generateCircles(10);
animate();