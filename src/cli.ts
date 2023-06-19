import { Command } from 'commander';
import packageJson from '../package.json';
import createCli from './createCli';

export const run = async (argv: string[]) => {
    const program = new Command();

    program
        .version(packageJson.version)
        .description('An example CLI for managing a directory')
        .arguments('<tool-name>')
        // .option('-l, --ls  [value]', 'List directory contents')
        // .option('-m, --mkdir <value>', 'Create a directory')
        // .option('-t, --touch <value>', 'Create a file')
        .action((name: string, options, command: Command) =>
            createCli(name, {
                // pwd: console.log({ command }),
                ...options,
            })
        )
        .parse(argv);
};
