const TYPE = {
  SQUA: 0,
  TRI: 1,
  CIR: 2,
};

class Rock {
  constructor() {
    this.y = random(-700, 0);
    this.x = random(700);
    this.v = random(1, 3);
    this.r = random(10, 20);
    this.die = false;
    this.dieNumber = 0;
    this.orient = 0;
    this.type = floor(random(3));
    this.fill = floor(random(5)) === 0;
  }

  reset() {
    this.y = random(-700, 0);
    this.x = random(700);
    this.v = random(1, 3);
    this.r = random(10, 20);
    this.die = false;
    this.dieNumber = 0;
    this.orient = 0;
    this.type = floor(random(3));
    this.fill = floor(random(5)) === 0;
  }

  show() {
    // this.fall();

    if (!this.die) {
      push();
      rotate(this.orient);
      strokeWeight(2);
      stroke(255);
      noFill();
      switch (this.type) {
        case TYPE.SQUA:
          stroke(color(186, 241, 161));
          if (!!this.fill) {
            rect(
              this.x + this.r / 4,
              this.y + this.r / 4,
              this.r / 2,
              this.r / 2,
              2
            );
          }
          rect(this.x, this.y, this.r, this.r, 3);
          break;
        case TYPE.TRI:
          stroke(color(157, 227, 208));
          triangle(
            this.x,
            this.y,
            this.x + this.r,
            this.y,
            this.x + this.r / 2,
            this.y + (this.r * sqrt(3)) / 2
          );
          if (!!this.fill) {
            circle(this.x + this.r / 2, this.y + (this.r * sqrt(3)) / 4.5, 1);
          }
          break;
        case TYPE.CIR:
          stroke(color(246, 136, 187));
          circle(this.x + this.r / 2, this.y + this.r / 2, this.r / 2);
          if (!!this.fill) {
            circle(this.x + this.r / 2, this.y + this.r / 2, this.r / 4);
          }
          break;
        default:
          stroke(color(186, 241, 161));
          rect(this.x, this.y, this.r, this.r, 3);
          if (!!this.fill) {
            rect(
              this.x + this.r / 4,
              this.y + this.r / 4,
              this.r / 2,
              this.r / 2,
              2
            );
          }
          break;
      }
      pop();
    } else {
    }
  }

  fall() {
    this.y += this.v;

    if (this.y > 500) {
      this.dieNumber++;
      this.die = false;
      this.y = -700;
      this.x = random(700);
      this.v = this.dieNumber + random(1, 3);
      this.r = random(10, 20);
      // this.orient = PI / random(10);
      this.type = floor(random(3));
      this.fill = floor(random(5)) === 0;
    }
  }

  isCrash(plane) {
    if (this.die) return;

    let x = plane.x - 15;
    let y = plane.y + 15;
    let centerX = this.x + this.r / 2;
    let centerY = this.y + this.r / 2;

    if (centerX > x && centerX < x + 30 && centerY > y && centerY < y + 30) {
      plane.die = true;
    }
  }
}
