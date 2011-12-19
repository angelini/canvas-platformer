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

  level: null,

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

  loadLevel: function(level_path, callback) {
    var that = this;

    $.getJSON(level_path, function(data) {
      $('.current-level').text(data.name);

      that.level = document.createElement('canvas');
      that.level.width = data.w;
      that.level.height = data.h;

      var i = 0;
      var ctx = that.level.getContext('2d');

      ctx.fillStyle = data.background;
      ctx.fillRect(0, 0, data.w, data.h);

      for(i = 0; i < data.elements.length; i++) {
        var elem = data.elements[i];
        ctx.fillStyle = elem.color;
        ctx.fillRect(elem.x, elem.y, elem.w, elem.h);
      }

      // DEBUG BLOCK //
      /*
      that.level.id = 'debug';
      $('body').append(that.level);
      */
      // END DEBUG //

      callback(data);
    });
  },

  checkPointOnElement: function(cx, cy, ex, ey, ew, eh) {
    if(cx > ex && cx < (ex + ew)) {
      if(cy == ey) {
        return true;
      }
    }

    return false;
  },

  checkFloor: function(x, y, level) {
    var i = 0;
    var lx = x;
    var ly = y + C.CHAR_HEIGHT;
    var rx = x + C.CHAR_WIDTH;
    var ry = y + C.CHAR_HEIGHT;

    for(i = 0; i < level.elements.length; i++) {
      var e = level.elements[i];
      if(this.checkPointOnElement(lx, ly, e.x, e.y, e.w, e.h)) {
        return true;
      }
      
      if(this.checkPointOnElement(rx, ry, e.x, e.y, e.w, e.h)) {
        return true;
      }
    }
  },

  checkInside: function(x, y) {
    if(x < 0 || x > C.APP_WIDTH || y < 0 || y > C.APP_HEIGHT) {
      return true;
    }
  },

  init: function(level) {
    var that = this;
    var Char = app.module('char');
    var Control = app.module('control');

    this.setUpCanvases();
   
    this.bg_ctx.drawImage(this.level, 0, 0, C.APP_WIDTH, C.APP_HEIGHT, 
                                      0, 0, C.APP_WIDTH, C.APP_HEIGHT);

    var char = new Char.Constructor({
      height: C.CHAR_HEIGHT,
      width: C.CHAR_WIDTH,
      x: level.start.x,
      y: level.start.y,
      color: 'red'
    },
    document.getElementById('main'));

    char.on('move', function(x, y, rect) {
      that.clearMain(rect);

      if(that.checkInside(x, y)) {
        console.log('outside');
        return;
      }

      if(!that.checkFloor(x, y, level)) {
        char.fall();
      }
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
  app.loadLevel('levels/test-level.json', function(level) {
    app.init(level);
  });
});

