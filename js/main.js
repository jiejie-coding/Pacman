'use strict';
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
  for (var i in settings) {
    that[i] = options[i] || settings[i];
  }
}
//游戏对象
function Game(id, options) {
  var that = this;
  var settings = {
    width: 100,		//画布宽度
    height: 100,		//画布高度
    view: {			//视图
      x: 0,
      y: 0,
      width: 640,
      height: 640
    },
    fresh: 125,		//画布刷新频率,一秒8帧
    map: [],			//地图信息
    audio: [],		//音频资源
    images: [],		//图片资源
  };
  for (key in options) {
    settings[key] = options[key];
  }
  var $canvas = document.getElementById(id);
  $canvas.style.width = settings.width + 'vw';
  $canvas.style.height = settings.height + 'vh';
  var _context = $canvas.getContext('2d');	//画布上下文环境
  var _items = [];		//对象队列
  var _t = 0;				//内部计算器,交替帧数更新动画
  var _hander = null;  	//画布更新
  //动画停止
  this.stop = function () {
    _hander && clearInterval(_hander);
  };
  //动画开始
  this.start = function () {
    that.stop();

    _hander = setInterval(function () {  //定时刷新画布
      _t++;
      _items.forEach(function (item, index) {
        item.update(_t);
      });
    }, settings.fresh);

  };
  //添加对象
  this.addItem = function (item) {
    _items.push(item);
  };
  //条件嗅探
  this.render = function () {

  };
  //绘图
  this.draw = function () {

  };
}