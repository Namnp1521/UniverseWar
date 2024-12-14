const LEFT_ARROW = 65;
const RIGHT_ARROW = 68;
const DOWN_ARROW = 83;
const UP_ARROW = 87;
const SPACE = 32;

let comfortaa_light_font;

let widthScreen = 730;
let plane;
let starArr = [];
let rockAr = [];
let xGuide = 30;
let yGuide = 455;
let curKeyBoard = 0;
let itemBullet;
let stopButton;
let user = "";
let best = 0;

function setup() {
  // When the Devvit app sends a message with `context.ui.webView.postMessage`, this will be triggered
  window.addEventListener("message", (ev) => {
    const { type, data } = ev.data;

    // Reserved type for messages sent via `context.ui.webView.postMessage`
    if (type === "devvit-message") {
      const { message } = data;

      // // Always output full message
      // output.replaceChildren(JSON.stringify(message, undefined, 2));

      // Load initial data
      if (message.type === "initialData") {
        const { username, bestScore } = message.data;
        user = username;
        best = bestScore;
      }

      // Update counter
      if (message.type === "updateScore") {
        const { bestScore } = message.data;
        best = bestScore;
      }
    }
  });

  createCanvas(widthScreen, 500);

  plane = new Plane(300, 400);

  for (let i = 0; i < 100; i++) {
    let star = new Star(
      random(widthScreen),
      random(500),
      random(5),
      random(10)
    );
    starArr.push(star);
  }

  for (let i = 0; i < 20; i++) {
    let rock = new Rock();
    rockAr.push(rock);
  }

  itemBullet = new ItemBullet();

  stopButton = createButton("Press to restart!");
  stopButton.position(widthScreen / 2 - 150, -260);
  stopButton.size(300, 20);
  stopButton.mousePressed(() => {
    plane.reset();

    for (let i = 0; i < rockAr.length; i++) {
      rockAr[i].reset();
    }

    stopButton.position(widthScreen / 2 - 150, -260);
    loop();
  });
}

function draw() {
  background(0);
  frameRate(60);

  // bullet
  push();
  fill(color(252, 186, 3));
  noStroke();
  arc(150 - 11, 475, 6, 6, PI, 0);
  rect(150 - 3 - 11, 475, 6, 10);
  rect(150 - 5 - 11, 475 + 10, 10, 2);
  fill(255);
  textSize(16);
  textStyle(NORMAL);
  textAlign(LEFT);
  text(plane.curBullet, 155, 485);
  pop();

  // creep
  push();
  noFill();
  strokeWeight(2.5);
  stroke(color(186, 241, 161));
  rect(190, 472, 15, 15, 3);
  fill(255);
  noStroke();
  textSize(16);
  textStyle(NORMAL);
  textAlign(LEFT);
  text(plane.creep, 215, 485);
  pop();

  // guide
  push();
  noFill();
  strokeWeight(2);
  stroke(255);
  switch (curKeyBoard) {
    case UP_ARROW:
      push();
      fill(255);
      rect(xGuide, yGuide, 15, 15, 3);
      pop();
      break;
    case DOWN_ARROW:
      push();
      fill(255);
      rect(xGuide, yGuide + 18, 15, 15, 3);
      pop();
      break;
    case LEFT_ARROW:
      push();
      fill(255);
      rect(xGuide - 18, yGuide + 18, 15, 15, 3);
      pop();
      break;
    case RIGHT_ARROW:
      push();
      fill(255);
      rect(xGuide + 18, yGuide + 18, 15, 15, 3);
      pop();
      break;
    case SPACE:
      push();
      fill(255);
      rect(xGuide + 36, yGuide + 18, 35, 15, 3);
      pop();
      break;
    //     case ENTER:
    //       if (plane.die) {
    //         for (let i = 0; i < 100; i++) {
    //           let star = new Star(
    //             random(widthScreen),
    //             random(500),
    //             random(5),
    //             random(10)
    //           );
    //           starArr.push(star);
    //         }

    //         for (let i = 0; i < 20; i++) {
    //           let rock = new Rock();
    //           rockAr.push(rock);
    //         }

    //         itemBullet = new ItemBullet();
    //         plane = new Plane(300, 400);
    //       }
    //       break;
    default:
      break;
  }
  rect(xGuide, yGuide, 15, 15, 3);
  rect(xGuide, yGuide + 18, 15, 15, 3);
  rect(xGuide - 18, yGuide + 18, 15, 15, 3);
  rect(xGuide + 18, yGuide + 18, 15, 15, 3);
  rect(xGuide + 36, yGuide + 18, 35, 15, 3);
  pop();

  // game
  plane.move();
  plane.fire();
  plane.show();

  for (let i = 0; i < starArr.length; i++) {
    let star = starArr[i];
    if (star.y > 500) {
      star.init();
    } else {
      star.show();
    }
  }

  for (let i = 0; i < rockAr.length; i++) {
    rockAr[i].fall();
    rockAr[i].show();
  }

  plane.checkFire(rockAr);

  plane.eatItemBullet(itemBullet);

  itemBullet.show();

  if (plane.die) {
    // end game
    // Sends a message to the Devvit app
    if (plane.creep > best) {
      window.parent?.postMessage(
        { type: "setScore", data: { newScore: Number(plane.creep || 0) } },
        "*"
      );
      // best = plane.creep;
    }

    fill(255);
    textAlign(CENTER);
    textSize(30);
    textStyle(BOLD);
    text("GAME OVER", widthScreen / 2, 250);
    // textSize(14);
    // textStyle(NORMAL);
    // text("Press Enter to restart!", widthScreen / 2, 275);
    textSize(16);
    textStyle(BOLD);
    textAlign(LEFT);
    fill(color(246, 136, 187));
    text("Player: ", widthScreen / 2 - 100, 330);
    textAlign(RIGHT);
    text(user, widthScreen / 2 + 100, 330);
    textAlign(LEFT);
    fill(color(186, 241, 161));
    text("Score: ", widthScreen / 2 - 100, 360);
    textAlign(RIGHT);
    text(plane.creep, widthScreen / 2 + 100, 360);
    textAlign(LEFT);
    fill(color(157, 227, 208));
    text("Your best: ", widthScreen / 2 - 100, 390);
    textAlign(RIGHT);
    text(best, widthScreen / 2 + 100, 390);

    stopButton.position(widthScreen / 2 - 150, 260);
    noLoop();
  }
}

function keyPressed() {
  curKeyBoard = keyCode;
}
