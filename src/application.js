var C = {
  APP_HEIGHT: 400,
  APP_WIDTH: 400,
  CHAR_HEIGHT: 20,
  CHAR_WIDTH: 20,
  UNIT: 5,
  LEFT: 65,
  RIGHT: 68,
  JUMP: 32,
  KEY_REPEAT: 15
};

var app = {
  module: (function() {
    // Internal module cache.
    var modules = {};

    return function(name) {
      // If this module has already been created, return it.
      if (modules[name]) {
        return modules[name];
      }

      // Create a module and save it under this name
      modules[name] = {};

      return modules[name];
    };
  })(),

  main_ctx: null,

  bg_ctx: null,

  setUpCanvases: function() {
    var bg_canvas = document.getElementById('bg');
    var main_canvas = document.getElementById('main');
    
    bg_canvas.height = C.APP_HEIGHT;
    bg_canvas.width = C.APP_WIDTH;
    main_canvas.height = C.APP_HEIGHT;
    main_canvas.width = C.APP_WIDTH;

    this.bg_ctx = bg_canvas.getContext('2d');
    this.main_ctx = main_canvas.getContext('2d');
  },

  clearMain: function(rect) {
    if(rect) {
      return this.main_ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    }

    this.main_ctx.clearRect(0, 0, C.APP_WIDTH, C.APP_HEIGHT);
  },

  init: function() {
    var that = this;
    var Char = app.module('char');
    var Control = app.module('control');

    this.setUpCanvases();
    
    this.bg_ctx.fillStyle = 'rgb(200,200,200)';
    this.bg_ctx.fillRect(0, 0, C.APP_WIDTH, C.APP_HEIGHT);

    var char = new Char.Constructor({
      height: C.CHAR_HEIGHT,
      width: C.CHAR_WIDTH,
      x: 0,
      y: C.APP_HEIGHT - C.CHAR_HEIGHT,
      color: 'red'
    },
    document.getElementById('main'));

    char.on('clear', function(rect) {
      that.clearMain(rect);
    });

    var control = new Control.Constructor();

    control.on('right', function() {
      char.move(C.UNIT, 0);
    });

    control.on('left', function() {
      char.move(-1 * C.UNIT, 0);
    });

    control.on('jump', function() {
      char.jump(20 * C.UNIT);
    });
  }
};

jQuery(function($) {
  app.init();
});

