#!/usr/bin/env node

{ // Enforce node engine version.
    const semVerSatisfies = require("semver").satisfies;
    const packageJson = require("./package.json");
    const nodeEngineRequirement = packageJson?.engines?.node;
    if (nodeEngineRequirement && !semVerSatisfies(process.version, nodeEngineRequirement)) {
        console.error("Node engine requirement not satisfied.", {
            expected: nodeEngineRequirement,
            current: process.version,
        });
        throw new Error("Unsupported Node Engine");
    }
}

{ // Run dist or src bin.
    // check if we're running in dev mode
    const devMode = require('fs').existsSync(`${__dirname}/src`) && (process.env?.NODE_ENV !== 'production');

    /**
     * @returns {Promise<{ run: (argv: string[]) => string }>}
     */
    const loadCLI = async () => {
        if (!devMode) {
            // this runs from the compiled javascript source
            return require(`${__dirname}/dist/cli.js`);
        } else {
            // this runs from the typescript source (for dev only)
            console.warn("::: Running from source code :::");
            // hook into ts-node so we can run typescript on the fly
            require('ts-node').register({ project: `${__dirname}/src/tsconfig.json`, emit: false });
            // run the CLI with the current process arguments
            return require(`${__dirname}/src/cli.ts`);
        }
    };

    loadCLI().then((cli) => cli.run(process.argv), (reason) => {
        console.error("Unexpected error", { reason });
        process.exit(1);
    });
}
