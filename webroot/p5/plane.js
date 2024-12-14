class Plane {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.bulletArr = [];
    this.speed = 3;
    this.isFire = false;
    this.state = 1;
    this.curBullet = 50;
    this.creep = 0;
    this.die = false;
  }

  reset() {
    this.x = 300;
    this.y = 400;
    this.bulletArr = [];
    this.isFire = false;
    this.state = 1;
    this.curBullet = 50;
    this.creep = 0;
    this.die = false;
  }

  show() {
    // this.move();
    // this.fire();

    push();
    noFill();
    strokeWeight(2);
    stroke(color(232, 249, 233));
    // dau
    triangle(this.x - 5, this.y + 10, this.x, this.y, this.x + 5, this.y + 10);
    // than
    rect(this.x - 5, this.y + 10, 10, 20);
    // canh
    triangle(
      this.x - 10,
      this.y + 10,
      this.x - 5,
      this.y + 5,
      this.x - 5,
      this.y + 10
    );
    triangle(
      this.x + 10,
      this.y + 10,
      this.x + 5,
      this.y + 5,
      this.x + 5,
      this.y + 10
    );

    if (this.state == DOWN_ARROW) {
      triangle(
        this.x - 20,
        this.y + 25,
        this.x - 5,
        this.y + 15,
        this.x - 5,
        this.y + 20
      );
      triangle(
        this.x + 20,
        this.y + 25,
        this.x + 5,
        this.y + 15,
        this.x + 5,
        this.y + 20
      );
    } else if (this.state == UP_ARROW) {
      triangle(
        this.x - 10,
        this.y + 40,
        this.x - 5,
        this.y + 15,
        this.x - 5,
        this.y + 20
      );
      triangle(
        this.x + 10,
        this.y + 40,
        this.x + 5,
        this.y + 15,
        this.x + 5,
        this.y + 20
      );
    } else {
      triangle(
        this.x - 20,
        this.y + 30,
        this.x - 5,
        this.y + 15,
        this.x - 5,
        this.y + 20
      );
      triangle(
        this.x + 20,
        this.y + 30,
        this.x + 5,
        this.y + 15,
        this.x + 5,
        this.y + 20
      );
    }

    // gun
    triangle(
      this.x - 5,
      this.y + 30,
      this.x,
      this.y + 10,
      this.x + 5,
      this.y + 30
    );
    triangle(
      this.x - 5,
      this.y + 30,
      this.x,
      this.y + 20,
      this.x + 5,
      this.y + 30
    );
    pop();

    // bound check
    // push();
    // noFill();
    // stroke(255);
    // rect(this.x - 25, this.y, 50, 50);
    // pop();

    // lua duoi
    push();
    strokeWeight(2);
    // stroke("#ff0000");
    fill(255);
    beginShape();
    vertex(this.x - 5, this.y + 30);
    vertex(this.x - random(5), this.y + 30 + random(20));
    vertex(this.x + 5, this.y + 30);
    endShape();
    beginShape();
    vertex(this.x + random(5), this.y + 30);
    vertex(this.x + random(5), this.y + 30 + random(20));
    endShape();
    beginShape();
    vertex(this.x + 5, this.y + 30);
    vertex(this.x + random(5), this.y + 30 + random(20));
    vertex(this.x - 5, this.y + 30);
    endShape();
    pop();

    // fire
    for (let i = 0; i < this.bulletArr.length; i++) {
      this.bulletArr[i].show();
    }
  }

  move() {
    if (keyIsDown(UP_ARROW) && keyIsDown(LEFT_ARROW)) {
      // this.state = UP_ARROW;
      // if (this.y - this.speed > 0) {
      //   this.y -= this.speed;
      // }
      // if (this.x - this.speed + 1.2 > 10) {
      //   this.x -= this.speed - 1.2;
      // }
    } else if (keyIsDown(UP_ARROW) && keyIsDown(RIGHT_ARROW)) {
      // this.state = UP_ARROW;
      // if (this.y - this.speed > 0) {
      //   this.y -= this.speed;
      // }
      // if (this.x + this.speed - 1.2 < 700 - 10) {
      //   this.x += this.speed - 1.2;
      // }
    } else if (keyIsDown(DOWN_ARROW) && keyIsDown(RIGHT_ARROW)) {
      // this.state = DOWN_ARROW;
      // if (this.y + this.speed - 1.5 < 460) {
      //   this.y += this.speed - 1.5;
      // }
      // if (this.x + this.speed - 1.2 < 700 - 10) {
      //   this.x += this.speed - 1.2;
      // }
    } else if (keyIsDown(DOWN_ARROW) && keyIsDown(LEFT_ARROW)) {
      // this.state = DOWN_ARROW;
      // if (this.y + this.speed - 1.5 < 460) {
      //   this.y += this.speed - 1.5;
      // }
      // if (this.x - this.speed + 1.2 > 10) {
      //   this.x -= this.speed - 1.2;
      // }
    } else if (keyIsDown(UP_ARROW)) {
      this.state = UP_ARROW;
      if (this.y - this.speed > 0) {
        this.y -= this.speed;
      }
    } else if (keyIsDown(LEFT_ARROW)) {
      this.state = LEFT_ARROW;
      if (this.x - this.speed + 1.2 > 10) {
        this.x -= this.speed - 1.2;
      }
    } else if (keyIsDown(DOWN_ARROW)) {
      this.state = DOWN_ARROW;
      if (this.y + this.speed - 1.5 < 460) {
        this.y += this.speed - 1.5;
      }
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.state = RIGHT_ARROW;
      if (this.x + this.speed - 1.2 < 700 - 10) {
        this.x += this.speed - 1.2;
      }
    } else {
      this.state = 1;
    }
  }

  fire() {
    if (keyIsDown(SPACE)) {
      if (!this.isFire) {
        this.isFire = true;
        if (this.curBullet > 0) {
          let bullet = new Bullet(this.x, this.y + 15);
          this.bulletArr.push(bullet);
          this.curBullet--;
        }
      }
    } else {
      this.isFire = false;
    }
  }

  checkFire(rockArr) {
    for (let i = 0; i < rockArr.length; i++) {
      for (let j = 0; j < this.bulletArr.length; j++) {
        if (this.bulletArr[j].checkFireRock(rockArr[i])) {
          this.creep++;
          j = this.bulletArr.length;
        }
      }

      if (!this.die) {
        rockArr[i].isCrash(this);
      }
    }
  }

  eatItemBullet(item) {
    let x = this.x;
    let y = this.y;

    if (x > item.x - item.w / 2 && x < item.x + item.w / 2) {
      if (y > item.y && y < item.y + item.h) {
        item.y = 600;
        this.curBullet += 30;
        // if (this.curBullet > 50) {
        //   this.curBullet = 50;
        // }
      }
    }
  }
}
