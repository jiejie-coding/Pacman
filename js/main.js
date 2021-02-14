// 'use strict';
//活动对象构造
function Item(options) {
  options = options || {};
  let that = this;
  let settings = {
    x: 0,					//横坐标
    y: 0,					//纵坐标
    width: 20,				//宽
    height: 20,				//高
    type: 1,					//对象类型
    status: 1,				//对象状态,1表示正常
    orientation: 0,			//当前定位方向,0表示上,1表示右,2表示下,3表示左
    vector: {				//目标坐标
      x: 0,
      y: 0
    },
    speed: 1,				//速度等级,1表示与刷新频率一致
    update: function () { },	//更新参数信息
    draw: function () { }		//绘制
  };
  for (let key in settings) {
    that[key] = options[key] || settings[key];
  }
}
//游戏对象
function Game(id, options) {
  let that = this;
  let settings = {
    name: 'Pacman',		//游戏名称
    width: 960,			//画布宽度
    height: 640,			//画布高度
    map: {				//地图信息
      x: 0,			//地图起点坐标
      y: 0,
      size: 20,		//地图单元的宽度
      data: []
    },
    fresh: 100,			//画布刷新频率,一秒10帧
    audio: [],			//音频资源
    images: [],			//图片资源
  };
  for (let key in options) {
    settings[key] = options[key];
  }
  let $canvas = document.getElementById(id);
  $canvas.width = _settings.width;
  $canvas.height = _settings.height;
  let context = $canvas.getContext('2d');	//画布上下文环境
  let items = [];							//动画对象队列
  let status = 0;							//页面状态							
  let hander = null;  						//画布更新
  //动画开始
  this.startAnimate = function (callback, frame) {
    frame = frame || 1;
    let requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    let t = 0;	//帧数计算
    let fn = function () {
      t++;
      if (!(t % frame)) {
        callback(t / frame);
      }
      hander = requestAnimationFrame(fn);
    };
    that.stopAnimate();
    hander = requestAnimationFrame(fn);
  };
  //动画结束
  this.stopAnimate = function () {
    let cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
    hander && cancelAnimationFrame(_hander);
  };
  //开始画面
  this.launch = function () {
    that.startAnimate(function (t) {
      //清除画布
      context.clearRect(0, 0, _settings.width, _settings.height);
      //logo
      context.fillStyle = '#FC3';
      context.beginPath();
      if (t % 2) {
        context.arc(_settings.width / 2, _settings.height * .45, 50, .20 * Math.PI, 1.80 * Math.PI, false);
        context.lineTo(_settings.width / 2, _settings.height * .45);
      } else {
        context.arc(_settings.width / 2, _settings.height * .45, 50, .01 * Math.PI, 1.99 * Math.PI, false);
        context.lineTo(_settings.width / 2, _settings.height * .45);
      }
      context.closePath();
      context.fill();
      context.fillStyle = '#000';
      context.beginPath();
      context.arc(_settings.width / 2 + 5, _settings.height * .45 - 27, 7, 0, 2 * Math.PI, false);
      context.closePath();
      context.fill();
      //游戏名
      context.font = 'bold 42px Helvetica';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#FFF';
      context.fillText(_settings.name, _settings.width / 2, _settings.height * .6);

    }, 10);
  };
  this.update = function () {
    startAnimate(function (t) {
      items.forEach(function (item, index) {
        item.update(t);
      });
    });
  };
  //添加对象
  this.addItem = function (item) {
    items.push(item);
  };
  //条件嗅探
  this.render = function () {

  };
  //绘图
  this.draw = function () {

  };
  //事件
}





