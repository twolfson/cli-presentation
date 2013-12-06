var path = require('path');
var async = require('async');
var dirty = require('dirty');
var mkdirp = require('mkdirp');

// Define an internal presentation state class
function Presentation(options) {
  // Fallback db path and save for later
  this.cwd = options.cwd || process.cwd();
  this.dbPath = options.db || path.join(this.cwd, 'cli-presentation.db');

  // Create placeholder for slides
  this.slides = [];
  this.length = this.slides.length;

  // Eager load slides
  var that = this;
  options.slides.forEach(function (slidePath) {
    that.addSlidePath(slidePath);
  });

  // Save options for later
  this.options = options;
}
Presentation.prototype = {
  // Define slide interaction fns
  addSlidePath: function (slidePath) {
    var cwdPath = path.join(this.cwd, slidePath);
    var slide = require(cwdPath);
    this.addSlide(slide);
  },
  addSlide: function (name, fn) {
    this.slides.push({
      name: name,
      fn: fn
    });
    this.length = this.slides.length;
  },
  getSlide: function (index) {
    return this.slides[index];
  },

  // Set up async db interactions
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

  // Allow for retrieval/setting of current index
  getCurrentIndex: function (cb) {
    var that = this;
    async.waterfall([
      function fetchDb (cb) {
        that.getDb(cb);
      },
      function getIndex (db, cb) {
        // DEV: We keep this indented to emulate it being a callback
        var val = db.get('index');
          // TODO: Is the numeric coercion necessary
          // cb(err, +val);
          cb(null, val);
      }
    ], cb);
  },
  setCurrentIndex: function (index, cb) {
    var that = this;
    async.waterfall([
      function fetchDb (cb) {
        that.getDb(cb);
      },
      function setIndex (db, cb) {
        db.set('index', index, cb);
      }
    ], cb);
  }
};

module.exports = Presentation;