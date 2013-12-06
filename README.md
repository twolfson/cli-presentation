# cli-presentation [![Build status](https://travis-ci.org/twolfson/cli-presentation.png?branch=master)](https://travis-ci.org/twolfson/cli-presentation)

Give presentations from your terminal

This was built from the library created in [Develop Faster][].

[Develop Faster]: https://github.com/twolfson/develop-faster-presentation

```bash
$ cli-presentation status
* 0 title.js
  1 overview.js
  2 create-a-repo.js
  3 write-some-code-server.js
  4 compile-assets.js
  5 write-some-code-browser.js
  6 commit.js
  7 write-some-tests.js
  8 release.js
  9 reflection.js
  10 title.js
```

## Getting Started
Install the module with: `npm install cli-presentation -g`

Set up a `config` to read from:

```bash
cat > config.yml <<EOF
slides:
  - hello.js
  - world.js
EOF

cat > hello.js <<EOF
module.exports = function () {
  // TODO: If a string is returned, it will be logged.
  // Otherwise, it is assumed the slide logged its own content.
  return 'Hello';
};
EOF

cat > hello.js <<EOF
module.exports = function () {
  return 'World!';
};
EOF
```

In a terminal:

```bash
cli-presentation
# Outputs: Hello

cli-presentation next
# Outputs: World!
```

## Documentation
_(Coming soon)_

// TODO: Make .bin extremely thin
// DEV: This allows for aliasing without aliasing on a per project basis
// TODO: Maybe leave it in `bin` but with a `module.parent` check

```js
require('cli-presentation').cli(/* config */);
```

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint via [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Unlicense
As of Dec 06 2013, Todd Wolfson has released this repository and its contents to the public domain.

It has been released under the [UNLICENSE][].

[UNLICENSE]: UNLICENSE
