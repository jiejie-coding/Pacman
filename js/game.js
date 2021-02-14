'use strict';
/*
* 小型游戏引擎
*/
function Game(id, options) {
  let that = this;
  options = options || {};
  let settings = {
    width: 960,						//画布宽度
    height: 640						//画布高度
  };
  for (let i in settings) {
    this[i] = options[i] || settings[i];
  }
  let $canvas = document.getElementById(id);
  $canvas.width = that.width;
  $canvas.height = that.height;
  let context = $canvas.getContext('2d');	//画布上下文环境
  let stages = [];							//布景对象队列
  let events = {};							//事件集合
  let index,									//当前布景索引					
    hander;  								//帧动画控制
  //活动对象构造
  let Item = function (options) {
    options = options || {};
    let settings = {
      x: 0,					//横坐标
      y: 0,					//纵坐标
      width: 20,				//宽
      height: 20,				//高
      type: 1,					//对象类型
      status: 1,				//对象状态,1表示正常,0表示隐藏
      orientation: 0,			//当前定位方向,0表示上,1表示右,2表示下,3表示左
      vector: {				//目标坐标
        x: 0,
        y: 0
      },
      speed: 1,				//速度等级,内部计算器times多少帧变化一次
      update: function () { } 	//更新参数信息
    };
    for (let i in settings) {
      this[i] = options[i] || settings[i];
    }
  };


  Item.prototype.bind = function (eventType, callback) {
    if (!events[eventType]) {
      events[eventType] = {};
      $canvas.addEventListener(eventType, (e) => {
        let position = that.getPosition(e);
        stages[index].items.forEach((item) => {

          if (Math.abs(position.x - item.x) < item.width / 2 && Math.abs(position.y - item.y) < item.height / 2) {
            let key = 's' + index + 'i' + item.index;
            if (events[eventType][key]) {
              events[eventType][key](e);
            }
          }
        });
      });
    }
    events[eventType]['s' + this.stage.index + 'i' + this.index] = callback;
  };
  //布景对象构造器
  let Stage = function (options) {
    options = options || {};
    let settings = {
      map: {							//地图信息
        x: 0,						//地图起点坐标
        y: 0,
        size: 20,					//地图单元的宽度
        data: []						//地图数据
      },
      status: 1,						//布景状态
      audio: [],						//音频资源
      images: [],						//图片资源
      items: []						//对象队列
    };
    for (let i in settings) {
      this[i] = options[i] || settings[i];
    }
  }
  //动画开始
  Stage.prototype.start = function () {
    let requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    let f = 0;		//帧数计算
    let stage = this;
    let fn = function () {
      context.clearRect(0, 0, that.width, that.height);	//清除画布
      if (stage.items.length) {
        f++;
        stage.items.forEach(function (item, index) {
          if (!(f % item.speed)) {
            item.times = f / item.speed;							//计数器
          }
          item.update(context);
        });
        hander = requestAnimationFrame(fn);
      }
    };
    this.stop();
    hander = requestAnimationFrame(fn);
  };
  //动画结束
  Stage.prototype.stop = function () {
    let cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
    hander && cancelAnimationFrame(hander);
  };

  //添加对象
  Stage.prototype.createItem = function (options) {
    let item = new Item(options);
    //对象动态属性
    item.stage = this;					//绑定对象与所属布景绑定
    item.index = this.items.length;		//对象层级
    this.items.push(item);
    return item;
  };
  //绑定事件
  Stage.prototype.bind = function (eventType, callback) {
    if (!events[eventType]) {
      events[eventType] = {};
      window.addEventListener(eventType, function (e) {
        let key = 's' + index;
        if (events[eventType][key]) {
          events[eventType][key](e);
        }
      });
    }
    events[eventType]['s' + this.index] = callback;
  };
  //事件坐标
  this.getPosition = function (e) {
    let box = $canvas.getBoundingClientRect(); //用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
    console.log(box);
    console.log(that.width);
    return {
      x: e.clientX - box.left,
      y: e.clientY - box.top
    };
  }
  //创建布景
  this.createStage = function (options) {
    let stage = new Stage(options);
    stage.index = stages.length;
    stages.push(stage);
    return stage;
  };
  //下个布景
  this.nextStage = function () {
    if (stages[index + 1]) {
      index++;
      stages[index].start();
    } else {
      throw new Error('unfound new stage.');
    }
  };
  //初始化游戏引擎
  this.init = function () {
    index = 0;
    if (stages[index]) {
      stages[index].start();
    }
  };
} 
