var canvas, ctx, runner, controller, loop, enemies, score, highScore, gameSpeed;
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
let looping = true; // boucle tourne tant que joueur pas mort
score = 0;
highScore = 0;
let highScoreDoc = document.getElementById("highscore");
let scoredoc = document.getElementById("score");
enemies = []; // tableau d'enemies

gameSpeed = 3;

class Runner {
  // runner est un objet avec des propriétés
  constructor() {
    this.height = 32;
    this.width = 32;
    this.jumping = true;
    this.x = 10;
    this.y = 0;
    this.x_velocity = 0;
    this.y_velocity = 0;
  }
}

class Enemy {
  constructor() {
    this.height = 32;
    this.width = 32;
    this.x = 568;
    this.y = 334;
    this.color = "#89D74B";
  }
  move() {
    this.x -= gameSpeed;
  }
  show() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
runner = new Runner();
controller = {
  up: false,
  keylistener: function (event) {
    console.log(event);
    var key_state = event.type == "keydown" ? true : false;

    switch (event.keyCode) {
      case 32: // up key
        controller.up = key_state;
        break;
    }
  },
};

loop = function () {
  if (Math.random(1) < 0.006) {
    enemies.push(new Enemy());
  }
  // jumping
  if (controller.up && runner.jumping == false) {
    runner.y_velocity -= 30;
    runner.jumping = true;
  }
  runner.y_velocity += 1; //gravité
  runner.y += runner.y_velocity; //déplacement
  runner.y_velocity *= 0.9; // ralentissement
  for (let e of enemies) {
    if (runner.x + runner.width >= e.x && runner.x < e.x + e.width) {
      if (runner.y + runner.height < e.y + e.height) {
        console.log("continue");
      } else if (runner.y + runner.height >= e.y + e.height) {
        e.color = "red";
        console.log("gameOver");
        looping = false;
        enemies = [];
        if (score > highScore) {
          highScore = score;
        }
        score = 0;
        gameSpeed = 3;
        looping = true;
      }
    }
  }
  score += 1;

  if (runner.y > 400 - 32 - 32) {
    //sol
    runner.jumping = false;
    runner.y = 400 - 32 - 32;
    runner.y_velocity = 0;
  }

  //dessine
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, 600, 400);
  ctx.fillStyle = "#F66D6D";
  //ctx.beginPath();
  ctx.fillRect(runner.x, runner.y, runner.width, runner.height);
  ctx.fill();
  ctx.strokeStyle = "#202830";
  ctx.lineWidth = 4;
  //ctx.beginPath();
  ctx.moveTo(0, 368);
  ctx.lineTo(600, 368);
  ctx.stroke();

  for (let e of enemies) {
    e.move();
    e.show();
  }

  gameSpeed += 0.003;

  highScoreDoc.innerHTML = "highscore: " + highScore;
  scoredoc.innerHTML = "score: " + score;
  if (looping == true) {
    window.requestAnimationFrame(loop);
  }
};
window.addEventListener("keydown", controller.keylistener);
window.addEventListener("keyup", controller.keylistener);
window.requestAnimationFrame(loop);

function startGame() {
  console.log("ok");
  looping = true;
  window.requestAnimationFrame(loop);
}

function stopGame() {
  looping = false;
}
