// Load in dependencies
// TODO: Can we get some tab completion for this?
var assert = require('assert');
var Presentation = require('./presentation');
function noop() {}

// // TODO: Let version and name be specified by the CLI invocation (i.e. leave it out of `lib` and pass back `program` *before* .parse
// var program = require('commander')
//                 .version(require('../package.json').version);

// Load in presentation info
// TODO: This should sniff for `presentation/config.{yml,json,js}`, `config.{yml,json,js}`
// TODO: Easily done via `require` but the `fs.existsSync` is excess I don't want to deal with right now
// TODO: Allow override via `--config`
// var yaml = require('js-yaml');
// var config = require('../presentation/config.yml');

function CliPresentation(options) {
  this.presentation = new Presentation(options);
}
CliPresentation.prototype = {
  // Tolerant slide navigator
  goToSlide: function (_slide, cb) {
    var slides, slide;
    var that = this;
    async.series([
      function fallbackSlide (cb) {
        // Fallback slide to active one
        if (_slide === undefined) {
          that.presentation.getCurrentIndex(function (err, val) {
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
        if (isNaN(slide)) {
          return cb(new Error('Slide "' + _slide + '" parsed to NaN'));
        }
        slide = Math.max(0, slide);
        slide = Math.min(slide, that.presentation.length - 1);
        cb();
      },
      function loadSlide (cb) {
        // Load and run the slide
        var slideJs = that.presentation.getSlide(slide);
        try {
          slideJs();
        } catch (e) {
          return cb(e);
        }
        cb();
      },
      function saveState (cb) {
        // Save the slide state
        that.presentation.setCurrentIndex(slide, cb);
      }
    ], function handleErrors (err) {
      // If there is a callback, send back the error
      if (cb) {
        cb(err);
      // Otherwise, if there was an error, throw it
      } else if (err) {
        throw err;
      }
    });
  },

  // Define common actions
  // TODO: Extend this into `byName`
  goToIndex: function (index) {
    this.goToIndex(index);
  },

  cli: function () {
    // Define CLI commands
    var that = this;
    program
      .command('slide <slide>')
      .description('Jump to a specific slide')
      .action(this.goToIndex.bind(this));

    program
      .command('first')
      .description('Go back to the beginning')
      .action(function () {
        that.goToSlide(0);
      });

    program
      .command('last')
      .description('Jump to the final slide')
      .action(function () {
        that.goToSlide(that.presentation.length - 1);
      });

    program
      .command('next')
      .description('Move following by one slide')
      .action(function () {
        that.presentation.getCurrentIndex(function (err, val) {
          if (err) { throw err; }
          // TODO: Adjust logic when we deal with `null` case
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
  }
};



// Parse the arguments
program.parse(process.argv);

// If there was no command, re-run the current slide
if (process.argv.length === 2) {
  goToSlide();
}
