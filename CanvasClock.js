/**
 * Created by phoebe on 5/12/16.
 */

/**
 * more than 4 days(96 hours)
 * show the year month day
 * **/
function CanvasClock(options){
  var defaultOptions = {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
    type: "clock"   //'countdown'
  };
  this.newOptions = this.copyObject(defaultOptions, options);

  //const endTime = new Date(2016,4,16,12,32,34);
  if((this.newOptions.type).toLowerCase() == 'countdown'){
    this.endTime = new Date(this.newOptions.endTime);
  }else if(this.newOptions.type == 'clock'){
    this.endTime = null;
  }

  this.curShowSeconds = 0;
  this.balls = [];

  var width = this.newOptions.width,
      height = this.newOptions.height;

  this.radius = Math.round(width * 4 / 5 / 108) - 1;
  this.marginTop = Math.round(height/5);
  this.marginLeft = Math.round(width/10);

  var clock = document.getElementById(this.newOptions.target);

  clock.height = height;
  clock.width = width;

  var _this = this;
  if(clock.getContext("2d")){
    var context = clock.getContext("2d");

    this.curShowSeconds = this.getCurSeconds();

    setInterval(function(){

      _this.render(context);
      _this.update();
    }, 50);
  }
}

CanvasClock.prototype.copyObject = function(defaultObj, newObj){
  //the same use newObj and the empty use defaultObj
  //maybe has some problem, because the object use address
  var item;
  for(item in defaultObj){
    if(newObj[item] == undefined){
      newObj[item] = defaultObj[item];
    }
  }
  return newObj;
};

CanvasClock.prototype.update = function(){
  var radius = this.radius,
      marginTop = this.marginTop,
      marginLeft = this.marginLeft,
      curShowSeconds = this.curShowSeconds;

  var nextShowSeconds = this.getCurSeconds();
  var nextHours = parseInt(nextShowSeconds/3600),
      nextMinutes = parseInt((nextShowSeconds - nextHours * 3600)/60),
      nextSeconds = parseInt(nextShowSeconds % 60);
  var curHours = parseInt(curShowSeconds/3600),
      curMinutes = parseInt((curShowSeconds - curHours * 3600)/60),
      curSeconds = parseInt(curShowSeconds % 60);
  if(curSeconds != nextSeconds){

    if(parseInt(curHours/10) != parseInt(nextHours/10)){
      this.addBalls(marginLeft, marginTop, parseInt(nextHours/10));
    }
    if(parseInt(curHours%10) != parseInt(nextHours%10)){
      this.addBalls(marginLeft + 15 * (radius + 1), marginTop, parseInt(nextHours/10));
    }
    if(parseInt(curMinutes/10) != parseInt(nextMinutes/10)){
      this.addBalls(marginLeft + 39 * (radius + 1), marginTop, parseInt(nextMinutes/10));
    }
    if(parseInt(curMinutes%10) != parseInt(nextMinutes%10)){
      this.addBalls(marginLeft  + 54 * (radius + 1), marginTop, parseInt(nextMinutes/10));
    }
    if(parseInt(curSeconds/10) != parseInt(nextSeconds/10)){
      this.addBalls(marginLeft + 78 * (radius + 1), marginTop, parseInt(nextSeconds/10));
    }
    if(parseInt(curSeconds%10) != parseInt(nextSeconds%10)){
      this.addBalls(marginLeft + 93 * (radius + 1), marginTop, parseInt(nextSeconds/10));
    }
    this.curShowSeconds = nextShowSeconds;
  }

  this.updateBalls();

};

CanvasClock.prototype.updateBalls = function(){
  var balls = this.balls,
      radius = this.radius,
      width = this.newOptions.width,
      height = this.newOptions.height;
  for(var i = 0; i< balls.length; i++){
    var ball = balls[i];
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += ball.g;

    if(ball.y >= (height - radius)){
      ball.y = height - radius;
      ball.vy = - ball.vy*0.75;
    }
  }

  var cont = 0;
  for(var i = 0;i < balls.length; i++){
    if(balls[i].x + radius > 0 && balls[i].x - radius < width){
      balls[cont++] = balls[i];
    }
  }

  while(Math.min(500, cont) < balls.length){
    balls.pop();
  }

  console.log(balls.length);

};

CanvasClock.prototype.addBalls = function(x, y, num){
  var digit = this.digit,
      radius = this.radius;
  for(var i = 0; i < digit[num].length; i++){
    for(var j = 0; j < digit[num][i].length; j++){
      if(digit[num][i][j] == 1){
        //var ball = {
        //  x: x + j * 2 * (radius + 1) + (radius + 1),
        //  y: y + i * 2 * (radius + 1) + (radius + 1),
        //  g: 2.5 * (Math.random() + 0.3),
        //  vx: Math.pow(-1, Math.ceil(Math.random()*1000)) * 4,
        //  vy: 0,
        //  color: colors[parseInt(Math.random() * colors.length)]
        //};
        var ball = {
          x: x + j * 2 * (radius + 1) + (radius + 1),
          y: y + i * 2 * (radius + 1) + (radius + 1),
          g: 1.5 + Math.random(),
          vx: Math.pow( -1 , Math.ceil( Math.random() * 1000 ) ) * 4,
          vy: -5,
          color: this.colors[ Math.floor( Math.random() * this.colors.length ) ]
        };
        this.balls.push(ball);
      }
    }
  }

};

CanvasClock.prototype.getCurSeconds = function(){
  var nowTime = new Date();
  if(this.endTime == null){
    var minSeconds = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds() ;
    return minSeconds;
  }else{
    var minSeconds = this.endTime.getTime() - nowTime.getTime();
    minSeconds = Math.round(minSeconds/1000);
    return  minSeconds >= 0 ? minSeconds : 0;
  }

};

CanvasClock.prototype.render = function(cxt){
  var curShowSeconds = this.curShowSeconds,
      marginLeft = this.marginLeft,
      marginTop = this.marginTop,
      radius = this.radius,
      width = this.newOptions.width,
      height = this.newOptions.height;
  var hours = parseInt(curShowSeconds/3600),
      minutes = parseInt((curShowSeconds - hours * 3600)/60),
      seconds = parseInt(curShowSeconds % 60);
  cxt.clearRect(0, 0, width, height);
  this.renderDigit(marginLeft, marginTop, parseInt(hours/10), cxt);
  this.renderDigit(marginLeft + 15 * (radius + 1), marginTop, parseInt(hours%10), cxt);
  this.renderDigit(marginLeft + 30 * (radius + 1), marginTop, 10, cxt);
  this.renderDigit(marginLeft + 39 * (radius + 1), marginTop, parseInt(minutes/10), cxt);
  this.renderDigit(marginLeft + 54 * (radius + 1), marginTop, parseInt(minutes%10), cxt);
  this.renderDigit(marginLeft + 69 * (radius + 1), marginTop, 10, cxt);
  this.renderDigit(marginLeft + 78 * (radius + 1), marginTop, parseInt(seconds/10), cxt);
  this.renderDigit(marginLeft + 93 * (radius + 1), marginTop, parseInt(seconds%10), cxt);

  for(var i = 0; i < this.balls.length; i++){
    var ball = this.balls[i];
    //cxt.clearRect(0, 0, 500, 500);
    cxt.fillStyle = ball.color;
    cxt.beginPath();
    cxt.arc(ball.x, ball.y, radius, 0, 2 * Math.PI);
    cxt.closePath();
    cxt.fill();
  }
};

CanvasClock.prototype.renderDigit = function(x, y, num, cxt){
  var digit = this.digit,
      radius = this.radius;

  cxt.fillStyle = '#6179ad';
  for(var i = 0; i < digit[num].length; i++){
    for(var j = 0; j < digit[num][i].length; j++){
      if(digit[num][i][j] == 1){
        cxt.beginPath();
        cxt.arc(x + j * 2 * (radius + 1) + (radius + 1), y + i * 2 * (radius + 1) + (radius + 1), radius, 0, 2 * Math.PI);
        cxt.closePath();
        cxt.fill();
      }
    }
  }
};
CanvasClock.prototype.colors = ['#33B5E5', '#0099cc', '#aa66cc', '#9933cc', '#99cc00', '#669900', '#ffbb33', '#ff8800', '#ff4444', '#cc0000'];
CanvasClock.prototype.digit = [
  [
    [0,0,1,1,1,0,0],
    [0,1,1,0,1,1,0],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [0,1,1,0,1,1,0],
    [0,0,1,1,1,0,0]
  ],//0
  [
    [0,0,0,1,1,0,0],
    [0,1,1,1,1,0,0],
    [0,0,0,1,1,0,0],
    [0,0,0,1,1,0,0],
    [0,0,0,1,1,0,0],
    [0,0,0,1,1,0,0],
    [0,0,0,1,1,0,0],
    [0,0,0,1,1,0,0],
    [0,0,0,1,1,0,0],
    [1,1,1,1,1,1,1]
  ],//1
  [
    [0,1,1,1,1,1,0],
    [1,1,0,0,0,1,1],
    [0,0,0,0,0,1,1],
    [0,0,0,0,1,1,0],
    [0,0,0,1,1,0,0],
    [0,0,1,1,0,0,0],
    [0,1,1,0,0,0,0],
    [1,1,0,0,0,0,0],
    [1,1,0,0,0,1,1],
    [1,1,1,1,1,1,1]
  ],//2
  [
    [1,1,1,1,1,1,1],
    [0,0,0,0,0,1,1],
    [0,0,0,0,1,1,0],
    [0,0,0,1,1,0,0],
    [0,0,1,1,1,0,0],
    [0,0,0,0,1,1,0],
    [0,0,0,0,0,1,1],
    [0,0,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [0,1,1,1,1,1,0]
  ],//3
  [
    [0,0,0,0,1,1,0],
    [0,0,0,1,1,1,0],
    [0,0,1,1,1,1,0],
    [0,1,1,0,1,1,0],
    [1,1,0,0,1,1,0],
    [1,1,1,1,1,1,1],
    [0,0,0,0,1,1,0],
    [0,0,0,0,1,1,0],
    [0,0,0,0,1,1,0],
    [0,0,0,1,1,1,1]
  ],//4
  [
    [1,1,1,1,1,1,1],
    [1,1,0,0,0,0,0],
    [1,1,0,0,0,0,0],
    [1,1,1,1,1,1,0],
    [0,0,0,0,0,1,1],
    [0,0,0,0,0,1,1],
    [0,0,0,0,0,1,1],
    [0,0,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [0,1,1,1,1,1,0]
  ],//5
  [
    [0,0,0,0,1,1,0],
    [0,0,1,1,0,0,0],
    [0,1,1,0,0,0,0],
    [1,1,0,0,0,0,0],
    [1,1,0,1,1,1,0],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [0,1,1,1,1,1,0]
  ],//6
  [
    [1,1,1,1,1,1,1],
    [1,1,0,0,0,1,1],
    [0,0,0,0,1,1,0],
    [0,0,0,0,1,1,0],
    [0,0,0,1,1,0,0],
    [0,0,0,1,1,0,0],
    [0,0,1,1,0,0,0],
    [0,0,1,1,0,0,0],
    [0,0,1,1,0,0,0],
    [0,0,1,1,0,0,0]
  ],//7
  [
    [0,1,1,1,1,1,0],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [0,1,1,1,1,1,0],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [0,1,1,1,1,1,0]
  ],//8
  [
    [0,1,1,1,1,1,0],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [1,1,0,0,0,1,1],
    [0,1,1,1,0,1,1],
    [0,0,0,0,0,1,1],
    [0,0,0,0,0,1,1],
    [0,0,0,0,1,1,0],
    [0,0,0,1,1,0,0],
    [0,1,1,0,0,0,0]
  ],//9
  [
    [0,0,0,0],
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ]//:
];