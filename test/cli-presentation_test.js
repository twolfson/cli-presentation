var exec = require('child_process').exec;
var expect = require('chai').expect;
var TempDir = require('temporary').Dir;
var wrench = require('wrench');
var cliPresentationPath = __dirname + '/../bin/cli-presentation';

describe('A cli-presentation', function () {
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

  it('starts on the first slide (current)', function (done) {
    exec(cliPresentationPath, function (err, stdout, stderr) {
      if (err) { return done(err); }
      expect(stdout).to.equal('11111111\n');
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

});
