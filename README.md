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

Set up a `cli-presentation.yml` config to read from:

```bash
cat > cli-presentation.yml <<EOF
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

## Executable interface
`cli-presentation` installs a CLI executable `cli-presentation`. It provides the following commands:

```js
$ cli-presentation --help

  Usage: cli-presentation [options] [command]

  Commands:

    slide <slide>          Jump to a specific slide
    first                  Go back to the beginning
    last                   Jump to the final slide
    next                   Move following by one slide
    previous               Move back by one slide
    back                   Alias for previous
    status                 Get overview of slides

  Options:

    -h, --help             output usage information
    -c, --config <config>  Path to configuration file (accepts .js, .json, .yml)
```

## Slide format
Slides are loaded via `require` and expected to return a `Function` as their `module.exports`.

When a slide is presented, its `module.exports` is run. If the `module.exports` returns a `String`, the output will be processed via `console.log`.

**Example**: Outputting from the slide

```js
// Inside of 1.js
module.exports = function () {
  console.log('Hello World!');
};

// From the command line
$ cli-presentation 1
Hello World!
```

**Example**: Returning content from the slide

```js
// Inside of 2.js
module.exports = function () {
  return 'Nyan cat!';
};

// From the command line
$ cli-presentation 2
Nyan cat!
```

## Documentation
`cli-presentation` exposes a constructor `CliPresentation` as its `module.exports`.

### `new CliPresentation(options)`
Constructor for a new CLI presentation

- options `String|Object` - If options is a string, it is assumed to be a path and resolved via `require`
    - cwd `String` - Directory to locate slides and database. By default, this is `process.cwd()`
    - db `String` - Path to database. If relative, it will resolve from `cwd`

### `CliPresentation.goToSlide(slide, cb)`
Navigate and output the content of a slide

- slide `Number` - Index of slide to navigate to (zero based)
- cb `Function` - Optional callback function with signature `function (err) {}`. If not provided and an error is encountered, it will be thrown.

### `CliPresentation.goToCurrent()`
Output the current slide

### `CliPresentation.goToFirst()`
Output the beginning slide

### `CliPresentation.goToLast()`
Output the final slide

### `CliPresentation.goToNext()`
Output the following slide

### `CliPresentation.goToPrevious()`
Output the previous slide

### `CliPresentation.status()`
Output the presentation progress

```bash
$ cli-presentation status  # on second slide
  0 title.js
* 1 overview.js
  2 create-a-repo.js
```

### `CliPresentation.cli(defaults)`
Return a [commander][] instance with the bindings of the CLI interface.

- defaults `Object` - Override default CLI values
    - config `String` - Default path to presentation configuration. By default, this is `cli-presentation`

[commander]: https://github.com/visionmedia/commander.js

By using this, you can define your custom alias and additional commands

```js
// Mimic behavior from `cli-presentation`
var yaml = require('js-yaml'); // Enables loading of .yml files
require('cli-presentation')
  .cli()
  // OPTIONAL: Add `--version` from `package.json`
  .version(require('../package.json').version)
  .parse(process.argv);
```

This is an example of using `defaults` to override `config`

```js
var CliPresentation = require('cli-presentation');
CliPresentation.cli({
  config: 'presentation/config'
}).parse(process.argv);
```

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
