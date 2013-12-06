var exec = require('child_process').exec;
var TempDir = require('temporary').Dir;
var wrench = require('wrench');

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
    console.log(this.tmpPath);
    wrench.copyDirRecursive(__dirname + '/test-files/multi', this.tmpPath, {
      forceDelete: true
    }, done);
  });

  it('', function () {

  });
});
