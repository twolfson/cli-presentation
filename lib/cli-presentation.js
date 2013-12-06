// Load in dependencies
// TODO: Can we get some tab completion for this?
var assert = require('assert');
var path = require('path');
var async = require('async');
var dirty = require('dirty');
var mkdirp = require('mkdirp');

// // TODO: Let version and name be specified by the CLI invocation (i.e. leave it out of `lib` and pass back `program` *before* .parse
// var program = require('commander')
//                 .version(require('../package.json').version);

// Load in presentation info
// TODO: This should sniff for `presentation/config.{yml,json,js}`, `config.{yml,json,js}`
// TODO: Easily done via `require` but the `fs.existsSync` is excess I don't want to deal with right now
// TODO: Allow override via `--config`
// var yaml = require('js-yaml');
// var config = require('../presentation/config.yml');
// var Presentation = require('../');
// var presentation = new Presentation(config, {cwd: __dirname + '/../presentation'});

function Presentation(options) {
  // Fallback db path and save for later
  this.cwd = options.cwd || process.cwd();
  this.dbPath = options.db || path.join(this.cwd, 'cli-presentation.db');

  // Create placeholder for slides
  this.slides = [];

  // Eager load slides
  options.slides.forEach(function (slidePath) {
    this.addSlidePath(slidePath);
  });

  // Save options for later
  this.options = options;
}
Presentation.prototype = {
  addSlidePath: function (slidePath) {
    var cwdPath = path.join(cwd, slidePath);
    var slide = require(cwdPath);
    this.addSlide(slide);
  },
  addSlide: function (name, fn) {
    this.slides.push({
      name: name,
      fn: fn
    });
  },

  getDb: function (cb) {
    // If we already have a db, callback with it
    if (this.db) {
      return cb(null, this.db);
    }

    // Otherwise, load it
    var dbPath = this.dbPath;
    mkdirp.sync(path.dirname(dbPath));
    var db = dirty(dbPath);
    var that = this;
    db.on('load', function (err) {
      // Save the db and callback with it
      that.db = db;
      cb(err, db);
    });
  },

  // Allow for retrieval of current slide
  getCurrentSlide: function (cb) {
    var that = this;
    async.waterfall([
      function fetchDb (cb) {
        that.getDb(cb);
      },
      function getSlide (db, cb) {
        db.get('slide', function (err, val) {
          // If this is the first run, return -1
          // TODO: Not found was for leveldb, this will be different. Probably `null`
          if (err && err.notFound) {
            cb(null, -1);
          } else {
          // Otherwise, callback with the slide
          // TODO: Is the numeric coercion necessary
            // cb(err, +val);
            cb(err, val);
          }
        });
      }
    ], cb);
  },

  getSlide: function (index, cb) {

  }
};

// Define common slide jumping function
function goToSlide(_slide, argv) {
  // TODO: Load slides
  var slides, slide;
  async.series([
    function fallbackSlide (cb) {
      // Fallback slide to active one
      if (_slide === undefined) {
        getCurrentSlide(function (err, val) {
          // Save the info and callback
          _slide = val || 0;
          cb(err);
        });
      } else {
        cb();
      }
    },
    function coerceSlide (cb) {
      // Parse the slide and guarantee it is within our bounds
      slide = parseInt(_slide, 10);
      assert(!isNaN(slide), 'Slide "' + _slide + '" parsed to NaN');
      slide = Math.max(0, slide);
      slide = Math.min(slide, presentation.length - 1);
      cb();
    },
    function loadSlide (cb) {
      // Load and run the slide
      var slideJs = presentation.getSlide(slide);
      slideJs();
      cb();
    },
    function saveState (cb) {
      // Save the slide state
      db.put('slide', slide, cb);
    }
  ], function handleErrors (err) {
    // If there was an error, throw it
    if (err) {
      throw err;
    }
  });
}

// Define CLI commands
program
  .command('slide <slide>')
  .description('Jump to a specific slide')
  .action(goToSlide);

program
  .command('first')
  .description('Go back to the beginning')
  .action(function () {
    goToSlide(0);
  });

program
  .command('last')
  .description('Jump to the final slide')
  .action(function () {
    goToSlide(presentation.length - 1);
  });

program
  .command('next')
  .description('Move following by one slide')
  .action(function () {
    getCurrentSlide(function (err, val) {
      if (err) { throw err; }
      // -1 -> 0. 0 -> 1
      goToSlide(val + 1);
    });
  });

program
  .command('back')
  .description('Move to the previous slide')
  .action(function () {
    getCurrentSlide(function (err, val) {
      if (err) { throw err; }
      // 0 -> -1 (max -> 0). 1 -> 0
      goToSlide(val - 1);
    });
  });

program
  .command('status')
  .description('Get overview of slides')
  .action(function () {
    getCurrentSlide(function (err, val) {
      if (err) { throw err; }

      config.slides.forEach(function (name, i) {
        var active = val === i ? '*' : ' ';
        console.log(active + ' ' + i + ' ' + name);
      });
    });
  });

// Parse the arguments
program.parse(process.argv);

// If there was no command, re-run the current slide
if (process.argv.length === 2) {
  goToSlide();
}
