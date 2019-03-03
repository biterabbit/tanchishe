 //食物
 (function () {
  let foodArray = []
  function Food(height, width, color) {
    this.height = height || 20;
    this.width = width || 20;
    this.color = color || 'green'
  }
  Food.prototype.init = function (map) {
    removeFood()
    let div = document.createElement('div')
    this.x = Math.floor(Math.random() * map.offsetWidth / this.width) * this.width;
    this.y = Math.floor(Math.random() * map.offsetHeight / this.height) * this.height;
    div.style.position = "absolute"
    div.style.height = this.height + 'px';
    div.style.width = this.width + 'px';
    div.style.backgroundColor = this.color;
    div.style.left = this.x + 'px';
    div.style.top = this.y + 'px';
    map.appendChild(div)
    foodArray.push(div)
  }
  function removeFood() {
    for (let i = 0; i < foodArray.length; i++) {
      foodArray[i].parentNode.removeChild(foodArray[i])
      foodArray.splice(i, 1)
    }
  }
  window.Food = Food
}());//自调用函数末尾一定要加分号
//小蛇
(function () {
  let snakeArray = []
  function Snake(width, height, color, direction) {
    this.width = width || 20;
    this.height = height || 20;
    this.body = [
      { x: 3, y: 1, color: 'red' },
      { x: 2, y: 1, color: 'orange' },
      { x: 1, y: 1, color: 'orange' },
    ];
    this.direction = direction || 'right'
  }
  Snake.prototype.init = function (map) {
    removeSnake()
    for (let i = 0; i < this.body.length; i++) {
      let div = document.createElement('div')
      div.style.position = "absolute"
      div.style.height = this.height + 'px';
      div.style.width = this.width + 'px';
      div.style.left = this.body[i].x * this.width + 'px';
      div.style.top = this.body[i].y * this.height + 'px'
      div.style.background = this.body[i].color;
      map.appendChild(div)
      snakeArray.push(div)
    }
  }
  Snake.prototype.move = function (map) {
    for (let i = this.body.length - 1; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x
      this.body[i].y = this.body[i - 1].y
    }
    switch (this.direction) {
      case 'right': this.body[0].x += 1; break;
      case 'left': this.body[0].x -= 1; break;
      case 'top': this.body[0].y -= 1; break;
      case 'bottom': this.body[0].y += 1; break;
    }
  }
  function removeSnake() {
    for (let i = snakeArray.length - 1; i >= 0; i--) {
      snakeArray[i].parentNode.removeChild(snakeArray[i])
      snakeArray.splice(i, 1)
    }
  }
  window.Snake = Snake
}());
//游戏
(function () {
  let timerRun
  function Game(map, start, count) {
    this.count = count
    this.map = map
    this.start = start
    that = this
  }
  Game.prototype.init = function () {
    this.food = new Food;
    this.snake = new Snake;
    this.food.init(this.map)
    clearInterval(timerRun)
    this.run()
    this.changeDirection()
  }
  Game.prototype.run = function () {
    let count = 0;
    let snakeBodyArray = [];
    let checkBody = false;
    let maxHeight = map.offsetHeight;
    let maxWidth = map.offsetWidth;
    timerRun = setInterval(function () {
      let headX = this.snake.body[0].x * this.snake.height;
      let headY = this.snake.body[0].y * this.snake.width;
      for (let i = this.snake.body.length - 1; i > 1; i--) {
        if (this.snake.body[i].x * this.snake.height == headX && this.snake.body[i].y * this.snake.width == headY) {
          checkBody = true
        }
      }

      //吃食物
      if (headX == this.food.x && headY == this.food.y) {
        this.food.init(this.map)
        this.snake.body.push({
          x: this.snake.body[this.snake.body.length - 1].x,
          y: this.snake.body[this.snake.body.length - 1].y,
          color: this.snake.body[this.snake.body.length - 1].color,
        })
        count += 1
        this.count.innerHTML = count;
      }
      //撞墙和身体
      if (headX >= maxWidth || headX < 0 || headY >= maxHeight || headY < 0) {
        alert('游戏结束')
        clearInterval(timerRun)
      } else if (checkBody) {
        alert('游戏结束')
        clearInterval(timerRun)
      } else {
        this.snake.init(this.map)
        this.snake.move(this.map)
      }

    }.bind(that), 100)
  }
  Game.prototype.changeDirection = function () {
    window.addEventListener('keydown', function (i) {
      let key = i.keyCode
      switch (key) {
        case 37:
          if (this.snake.direction != 'right') { this.snake.direction = 'left'; } break;
        case 38:
          if (this.snake.direction != 'bottom') { this.snake.direction = 'top'; } break;
        case 39:
          if (this.snake.direction != 'left') { this.snake.direction = 'right'; } break;
        case 40:
          if (this.snake.direction != 'top') { this.snake.direction = 'bottom'; } break;
      }
    }.bind(that))
  }

  window.Game = Game
}());
let start = document.querySelector('.btn')
let map = document.querySelector('.map')
let count = document.querySelector('.count')
let game = new Game(map, start, count)
start.addEventListener('click', function () {
  game.init()
})
