var exec = require('child_process').exec;
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

  it('starts on the first slide (current)', function () {

  });

  it('starts on the first slide (overview)', function (done) {
    exec(cliPresentationPath + ' status', function (err, stdout, stderr) {
      if (err) { return done(err); }
      console.log(stdout);
    });
  });

});
