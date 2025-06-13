export default class mouseEffect {
  constructor() {
    this.canvas = document.querySelector("#projectSection");

    window.addEventListener("DOMContentLoaded", () => {
      this.showImage();
    });
  }


showImage() {
  if (!this.canvas) return;

  let intervalId = null;
  let mouseInCanvas = false;
  let lastX = 0;
  let lastY = 0;
  let imgWidth = 200;
    let imgHeight = 200;

  const randomRotation = () => {
    return Math.random() * 40 - 20; 
  };


const spawnImage = () => {
  const img = document.createElement("img"); 
  img.src = "./public/images/logo.png";
  img.style.position = "absolute";
  img.style.left = `${lastX}px`;
  img.style.top = `${lastY}px`;
  img.style.width = "200px";
  img.style.height = "200px";
  img.style.pointerEvents = "none";
  img.style.zIndex = 9999;
  img.style.transform = `rotate(${randomRotation()}deg)`;
  this.canvas.appendChild(img);

  setTimeout(() => img.remove(), 500);
};

  // Quand la souris bouge dans la zone
  this.canvas.addEventListener("mousemove", (event) => {
    const rect = this.canvas.getBoundingClientRect();
    const image = document.querySelector("img");
    lastX = event.clientX -  rect.x - imgWidth / 2;
    lastY = event.clientY -  rect.y - imgHeight / 2;
  });

  // Quand la souris entre dans la zone
  this.canvas.addEventListener("mouseenter", () => {
    mouseInCanvas = true;
    if (!intervalId) {
      intervalId = setInterval(() => {
        if (mouseInCanvas) spawnImage();
      }, 100);
    }
  });

  // Quand la souris sort de la zone
  this.canvas.addEventListener("mouseleave", () => {
    mouseInCanvas = false;
    clearInterval(intervalId);
    intervalId = null;
    lastX = 0;
    lastY = 0;
  });
}
}