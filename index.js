
const keypress = require('keypress');
keypress(process.stdin);

const width = 30;
const height = 15;
let snake, food;
let toDraw = [];
let fps = 10;
let c;

function draw() {
  console.clear();

  for(let i = 0; i < height; i++) {
    let l = '';

    for(let i2 = 0; i2 < width; i2++) {
      if(isArrayItemExists(toDraw, [i2, i])) {
	    l += '#';
      } else {
         l += '.';
      }
    }

    console.log(l);
  }

  console.log(`${toDraw.length - 5} points`);
  console.log('r - restart');
}

function update() {
  toDraw = [];
  snake.update();
  food.update();
  draw();
}

function start() {
  snake = new Snake();
  food = new Food();
  
  if(c)
  	clearInterval(c);

  c = setInterval(update, 1000 / fps);
}

class Snake {
  constructor() {
    this.body = [[10, 10], [10, 11], [10, 12], [10, 13]];
    this.direction = [1, 0];
  }

 update() {
    const { body } = this;
    let { direction } = this;

    let nextPos = [body[0][0] + direction[0], body[0][1] + direction[1]];

    if(nextPos[1] >= height)
      nextPos[1] = 0;

    if(nextPos[1] < 0)
      nextPos[1] = height;

    if(nextPos[0] >= width)
      nextPos[0] = 0;

    if(nextPos[0] < 0)
      nextPos[0] = width;

    if(nextPos[0] === body[1][0] && nextPos[1] === body[1][1]) {
      body.reverse();
      nextPos = [body[0][0] + direction[0], body[0][1] + direction[1]];
    }

    if(isArrayItemExists(body, nextPos)) {
      start();
      return;
    }

    if(nextPos[0] === food.position[0] && nextPos[1] === food.position[1]) {
      this.grow();
      food.onCapture();
    }

    this.body.pop();
    this.body.splice(0, 0, nextPos);

    snake.draw();
  }

  onKeyPress(key) {
    switch(key.name) {
      case 'w':
        this.direction = [0, -1];
        break;
      case 's':
        this.direction = [0, 1];
        break;
      case 'a':
        this.direction = [-1, 0];
        break;
      case 'd':
        this.direction = [1, 0];
        break;
    }
  }

  grow() {
    const lastPos = this.body[this.body.length - 1];
    const newPos = [lastPos[0] + 1, lastPos[1]];
    this.body.push(newPos);
  }

  draw() {
    toDraw = [...toDraw, ...this.body];
  }
}

class Food {
  constructor() {
    this.position = [0, 0];
  }

  setNewPosition() {
    this.position[0] = Math.round(Math.random() * (width - 1));
    this.position[1] = Math.round(Math.random() *(height - 1));
  }

  onCapture() {
    this.setNewPosition();
  }

  update() {
  	this.draw();
  }

  draw() {
    toDraw = [...toDraw, this.position];
  }
}

process.stdin.on('keypress', (ch, key) => {
  if (key && key.ctrl && key.name === 'c') {
    process.exit();
    return;
  }

  if(key.name === 'r') {
  	start();
  	return;
  }

  snake.onKeyPress(key);
});
 
process.stdin.setRawMode(true);
process.stdin.resume();

function isArrayItemExists(array , item) {
    for ( var i = 0; i < array.length; i++ ) {
        if(JSON.stringify(array[i]) == JSON.stringify(item)){
            return true;
        }
            }
            return false;
}

start();
