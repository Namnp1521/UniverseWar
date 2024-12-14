class Star {
  constructor(x, y, r, s) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = s;
    this.opacity = 255;
  }

  show() {
    this.fall();
    push();
    fill(color(255, 255, 255, this.opacity));
    noStroke();
    ellipse(this.x, this.y, this.r, this.r);
    pop();
  }

  fall() {
    this.y += this.speed;
  }

  init() {
    this.y = -5;
    this.x = random(700);
    this.r = random(5);
    this.speed = random(10);
  }
}