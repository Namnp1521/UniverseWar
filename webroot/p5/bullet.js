class Bullet {
  constructor(x, y, rock) {
    this.x = x;
    this.y = y;
    this.r = 3;
    this.speed = 5;
    this.die = false;
  }

  show() {
    this.move();

    if (!this.die) {
      push();
      noFill();
      stroke(255);
      strokeWeight(2);
      ellipse(this.x, this.y, this.r, this.r);
      pop();
    }
  }

  move() {
    this.y -= this.speed;

    if (this.y < 0) {
      this.y = 600;
      this.speed = 0;
      this.die = true;
    }
  }

  checkFireRock(rock) {
    let x = this.x;
    let y = this.y;

    if (!rock.die && x > rock.x && x < rock.x + rock.r && y < rock.y + rock.r) {
      rock.die = true;
      return true;
    }

    return false;
  }
}