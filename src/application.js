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

  setUpCanvases: function(main_canvas, bg_canvas) {
    bg_canvas.height = C.APP_HEIGHT;
    bg_canvas.width = C.APP_WIDTH;
    main_canvas.height = C.APP_HEIGHT;
    main_canvas.width = C.APP_WIDTH;
  },

  init: function(level_path) {
    var that = this;
    var Char = app.module('char');
    var Control = app.module('control');
    var Level = app.module('level');

    var main_canvas = document.getElementById('main');
    var bg_canvas = document.getElementById('bg');

    this.setUpCanvases(main_canvas, bg_canvas);
    var control = new Control.Constructor();
    var level = new Level.Constructor(bg_canvas);

    level.load(level_path, function() {
      var char_info = {
        height: C.CHAR_HEIGHT,
        width: C.CHAR_WIDTH,
        x: level.start.x,
        y: level.start.y,
        color: 'red'
      };
      
      $('.current-level').text(level.name);
      level.setBackground(0, 0);
      this.char = new Char.Constructor(char_info, control, level, main_canvas);
    });
  }
};

jQuery(function($) {
  app.init('levels/test-level.json');
});

