#! /usr/bin/env node

/**
 * This is the command-line interface that runs the functions provided by the
 * library to execute the tasks specified by the input arguments.
 * To be compatible with older versions of node, keep this file at ES5.
 */

var program = require('commander');
var npmManifest = require('./package.json');
// Expect lib to be an async function that returns a promise.
var lib = require('./lib');

program
  .version(npmManifest.version)
  .usage('[options] <some-arg>')
  .option('--some-option', 'description of the option')
  .option('--verbose', 'show more logs')
  .parse(process.argv);

if (program.args.length === 0) {
  program.outputHelp();
} else if (program.args.length > 1) {
  console.error('Please only provide argument at a time.');
  process.exit(1);
} else {
  try {
    // Pass in all arguments and `program` for easy access to options.
    lib(program.args, program)
    .then(function (result) {
      process.exit(result);
    }, function (error) {
      console.error(error.message);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
