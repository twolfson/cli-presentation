var exec = require('child_process').exec;
var expect = require('chai').expect;
var TempDir = require('temporary').Dir;
var wrench = require('wrench');
var cliPresentationPath = __dirname + '/../bin/cli-presentation';

function setupPresentation() {
  // Create temporary directory to test within
  before(function () {
    this.tmpDir = new TempDir();
    this.tmpPath = this.tmpDir.path;
  });
  after(function (done) {
    // DEV: We cannot use temporary to clean up since it won't be empty
    wrench.rmdirRecursive(this.tmpPath, done);
  });

  // Copy over our temp files
  before(function (done) {
    wrench.copyDirRecursive(__dirname + '/test-files/multi', this.tmpPath, {
      forceDelete: true
    }, done);
  });

  // Navigate to the temporary directory
  before(function () {
    process.chdir(this.tmpPath);
  });
}

function runCommand(args) {
  before(function (done) {
    var that = this;
    exec(cliPresentationPath + ' ' + args, function (err, stdout, stderr) {
      that.stdout = stdout;
      that.stderr = stderr;
      done(err);
    });
  });
}

describe('A cli-presentation', function () {
  setupPresentation();

  it('starts on the first slide (current)', function (done) {
    // Get the first slide as the current slide
    exec(cliPresentationPath, function (err, stdout, stderr) {
      if (err) { return done(err); }
      expect(stdout).to.equal('one\n');
      done();
    });
  });

  it('starts on the first slide (overview)', function (done) {
    // Run `cli-presentation status` and assert output
    exec(cliPresentationPath + ' status', function (err, stdout, stderr) {
      if (err) { return done(err); }
      expect(stdout).to.equal([
        '* 0 1.js',
        '  1 2.js',
        '  2 3.js',
        ''
      ].join('\n'));
      done();
    });
  });

  describe('moving to the next slide', function () {
    runCommand('next');

    it('outputs the second slide\'s contents', function () {
      expect(this.stdout).to.equal('twotwo\n');
    });

    describe('moving to the next slide', function () {
      runCommand('next');

      it('outputs the third slide\'s contents', function () {
        expect(this.stdout).to.equal('threethreethree\n');
      });
    });
  });
});

describe('A cli-presentation', function () {
  setupPresentation();

  describe('moving to the last slide', function () {
    runCommand('last');
    it('navigates to the final slide', function () {
      expect(this.stdout).to.equal('threethreethree\n');
    });

    describe('outputting the status', function () {
      runCommand('status');
      it('is on the last slide', function () {
        expect(this.stdout).to.equal([
          '  0 1.js',
          '  1 2.js',
          '* 2 3.js',
          ''
        ].join('\n'));
      });

      describe('moving to the first slide', function () {
        runCommand('first');
        it('goes to the first slide', function () {
          expect(this.stdout).to.equal('one\n');
        });
      });
    });
  });
});

describe('A cli-presentation', function () {
  setupPresentation();

  describe('jumping to the third slide', function () {
    runCommand('slide 2');
    it('navigates to the third slide', function () {
      expect(this.stdout).to.equal('threethreethree\n');
    });

    describe('outputting the status', function () {
      runCommand('status');
      it('is on the last slide', function () {
        expect(this.stdout).to.equal([
          '  0 1.js',
          '  1 2.js',
          '* 2 3.js',
          ''
        ].join('\n'));
      });
    });
  });
});

describe('A cli-presentation', function () {
  setupPresentation();

  describe('navigating to the previous slide from the first one', function () {
    runCommand('slide 0');
    runCommand('back');
    it('remains on the first slide', function () {
      expect(this.stdout).to.equal('one\n');
    });
  });

  describe('navigating to the next slide from the last one', function () {
    runCommand('slide 2');
    runCommand('next');
    it('remains on the last slide', function () {
      expect(this.stdout).to.equal('threethreethree\n');
    });
  });
});

describe('A cli-presentation run from a remote directory', function () {
  setupPresentation();
  before(function moveAwayFromPresentation () {
    process.chdir(__dirname);
  });
  runCommand('status --config ' + this.tmpPath + '/cli-presentation');

  it('resolves slides relative to the config', function () {
    expect(this.stdout).to.equal([
      '* 0 1.js',
      '  1 2.js',
      '  2 3.js',
      ''
    ].join('\n'));
  });
});