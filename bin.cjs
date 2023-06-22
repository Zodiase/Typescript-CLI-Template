#!/usr/bin/env node

{
    // Enforce node engine version.
    const semVerSatisfies = require('semver/functions/satisfies');
    const packageJson = require('./package.json');
    const nodeEngineRequirement = packageJson?.engines?.node;
    if (nodeEngineRequirement && !semVerSatisfies(process.version, nodeEngineRequirement)) {
        console.error('Node engine requirement not satisfied.', {
            expected: nodeEngineRequirement,
            current: process.version,
        });
        throw new Error('Unsupported Node Engine');
    }
}

{
    // Run dist or src bin.
    // check if we're running in dev mode
    const devMode = require('fs').existsSync(`${__dirname}/src`) && process.env?.NODE_ENV !== 'production';

    /**
     * @returns {Promise<{ run: (argv: string[]) => Promise<void> }>}
     */
    const loadCLI = async () => {
        if (!devMode) {
            // this runs from the compiled javascript source
            try {
                return require(`${__dirname}/dist/cli.js`);
            } catch (e) {
                if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
                    console.error('No Logic');
                    process.exit(3);
                }
                throw e;
            }
        } else {
            // this runs from the typescript source (for dev only)
            console.warn('::: Running from source code :::');
            // hook into ts-node so we can run typescript on the fly
            const tsConfigFilePath = `${__dirname}/src/tsconfig.json`;
            try {
                require('ts-node').register({ project: tsConfigFilePath, emit: false });
            } catch (e) {
                if (e instanceof Error) {
                    if (e.diagnosticCodes?.[0] === 5083) {
                        console.error('Failed to load TypeScript config file', { path: tsConfigFilePath });
                        process.exit(3);
                    }
                }
                throw e;
            }
            // run the CLI with the current process arguments
            try {
                return require(`${__dirname}/src/cli.ts`);
            } catch (e) {
                if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
                    console.error('No Logic');
                    process.exit(3);
                }
                throw e;
            }
        }
    };

    loadCLI().then(
        (cli) => cli.run(process.argv),
        (reason) => {
            console.error('Unexpected error', { reason });
            process.exit(1);
        }
    );
}
