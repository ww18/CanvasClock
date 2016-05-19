# CanvasClock

1. <canvas id="clock"></canvas>
   
   var options = {
      target: 'clock', //id
      width: 800,
      height: 500,
      type: "clock" //'countdown'
    };
    new CanvasClock(options);
    可以创建时钟，目前是只有时分秒，并且是24的<br/>

2. <canvas id="countdown"></canvas>
  
   var option = {
      target: 'countdown', //id
      width: 800,
      height: 500,
      type: "countdown", //'countdown'
      endTime: '2016-05-21,12:32:21'
    };
    new CanvasClock(option);
可以创建倒计时，目前只能是2位的小时，即最多时24*4 ＝96，也就是4天内的倒计时
