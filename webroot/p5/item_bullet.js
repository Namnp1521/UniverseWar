class ItemBullet {
  constructor() {
    this.x = random(300);
    this.y = -20;
    this.v = 2;
    this.w = 30;
    this.h = 20;
  }

  show() {
    this.fall();

    push();
    fill(color(252, 186, 3));
    noStroke();
    arc(this.x - 11, this.y, 6, 6, PI, 0);
    rect(this.x - 3 - 11, this.y, 6, 10);
    rect(this.x - 5 - 11, this.y + 10, 10, 2);

    arc(this.x, this.y, 6, 6, PI, 0);
    rect(this.x - 3, this.y, 6, 10);
    rect(this.x - 5, this.y + 10, 10, 2);

    arc(this.x + 11, this.y, 6, 6, PI, 0);
    rect(this.x - 3 + 11, this.y, 6, 10);
    rect(this.x - 5 + 11, this.y + 10, 10, 2);
    pop();

  }

  fall() {
    this.y += this.v;

    if (second() % 20 == 0 && this.y > 500) {
      this.x = random(300);
      this.y = -20;
      this.v = 2;
    }
  }
}