var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

var snakeBody = [];
var food;
var snakeSize = 20;
var cvsGridX = canvas.width / snakeSize;
var cvsGridY = canvas.height / snakeSize;
var dire = -2;
var score = 0;
var timer;
//增加蛇节点
function createSnakeNode(x, y) {
  snakeBody.push({
    x: x,
    y: y,
    color: (snakeBody.length == 0) ? "#f00" : "#000"
  });
}

//绘制蛇
function drawSnake() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (var i = 0; i < snakeBody.length; i++) {
    drawRect(snakeBody[i]);
  }
}

//填充正方形
function drawRect(snakeNode) {
  ctx.beginPath();
  ctx.fillStyle = snakeNode.color;
  ctx.fillRect(snakeNode.x * snakeSize, snakeNode.y * snakeSize, snakeSize, snakeSize);
}

//画初始蛇
function createSnake() {
  for (var i = 0; i < 3; i++) {
    createSnakeNode(parseInt(cvsGridX / 2 + i), parseInt(cvsGridY / 2));
    drawSnake();
  }
  setFood();
  drawRect(food);
}

document.onkeydown = function(e) {
  e.preventDefault();
  switch (e.keyCode) {
    case 38:
      setDirection(-1);
      break;
    case 40:
      setDirection(1);
      break;
    case 37:
      setDirection(-2);
      break;
    case 39:
      setDirection(2);
      break;
  }
};

//设置方向
function setDirection(dir) {
  if (Math.abs(dire) === Math.abs(dir)) return;
  dire = dir;
}

//蛇的移动
function snakeMove() {
  //头部的位置
  var newHeadNode = {
    x: snakeBody[0].x,
    y: snakeBody[0].y,
    color: '#f00'
  };
  //检测方向
  switch (dire) {
    case -1:
      newHeadNode.y -= 1;
      break;
    case 1:
      newHeadNode.y += 1;
      break;
    case 2:
      newHeadNode.x += 1;
      break;
    case -2:
      newHeadNode.x -= 1;
      break;
  }

  //调整蛇的位置,剩余部位复制上一个
  for (var i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i].x = snakeBody[i - 1].x;
    snakeBody[i].y = snakeBody[i - 1].y;
    //检测头部会不会接触到蛇的其他部位
    if (snakeBody[i].x === newHeadNode.x && snakeBody[i].y === newHeadNode.y) {
      gameOver();
    }
  }
  //头部改变位置
  snakeBody[0] = newHeadNode;
  isGetFood(snakeBody[0]);
  isOutOfBorder(snakeBody[0]);
  drawSnake();
  drawRect(food);
}

function isGetFood(node){
  if(node.x === food.x && node.y === food.y){
    setFood();
    createSnakeNode(snakeBody[snakeBody.length-1].x,snakeBody[snakeBody.length-1].y);
    score ++;
  }
}

function isOutOfBorder(node){
  if(node.x < 0 || node.x > cvsGridX - 1 || node.y < 0 || node.y > cvsGridY - 1) gameOver();
}

function gameOver(){
  alert("gameOver"+"\nYour:score:"+score+"\nThe best score = "+localStorage.getItem("score"));
  if(score>localStorage.getItem("score")){
    localStorage.setItem("score", score);
  }
  clearTimeout(timer);
}


function setFood(){
  var fx = parseInt((cvsGridX-1)*Math.random());
  var fy = parseInt((cvsGridY-1)*Math.random());
  for(var i = 0;i<snakeBody.length;i++){
    if(fx === snakeBody[i].x && fy === snakeBody[i].y){
      setFood();
    }
  }
  food = {x:fx,y:fy,color:'#0f0'};
}


//初始化
function init() {
  createSnake();
  snakeMove();
  if(!localStorage.getItem("score")){
    localStorage.setItem("score",0)
  };
}

init();
timer = setInterval(function(){
  snakeMove()
},300);
