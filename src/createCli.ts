import { readFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import sanitizeFilename from 'sanitize-filename';
import writePackageJson from './utility/writePackageJson';
import ensureProjectDir from './utility/ensureProjectDir';
import writeReadme from './utility/writeReadme';
import ignoreFiles from './utility/ignoreFiles';
import installDependencies from './utility/installDependencies';
import writeGenericFile from './utility/writeGenericFile';
import updatePackageJson from './utility/updatePackageJson';

interface CreateCliOptions {
    //!
}

export default async (toolName: string, options: CreateCliOptions) => {
    const workDir = process.cwd();
    const sanitizedFilename = sanitizeFilename(toolName, {
        replacement: '-',
    });
    const toolProjectDir = resolvePath(workDir, sanitizedFilename);

    ensureProjectDir(toolProjectDir);

    writePackageJson(toolProjectDir, {
        name: toolName,
        version: '1.0.0',
        engines: {
            node: '>=16',
        },
        bin: {
            [sanitizedFilename]: 'bin.cjs',
        },
    });

    writeReadme(
        toolProjectDir,
        `# ${toolName}
`
    );

    ignoreFiles(
        toolProjectDir,
        `
node_modules
dist
tsconfig.tsbuildinfo
`,
        'git'
    );

    await installDependencies(
        toolProjectDir,
        `
typescript
jest
ts-node
ts-jest
@types/jest
@types/node
`,
        {
            dev: true,
            saveExact: false,
        }
    );

    await installDependencies(
        toolProjectDir,
        `
eslint
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
eslint-config-prettier
@xch/prettier-config
`,
        {
            dev: true,
            saveExact: false,
        }
    );

    await installDependencies(
        toolProjectDir,
        `
prettier
`,
        {
            dev: true,
            saveExact: true,
        }
    );

    writeGenericFile(
        toolProjectDir,
        './.eslintrc.cjs',
        `
module.exports = {
    extends: ['eslint:recommended', 'prettier'],
    env: {
        node: true,
        es2022: true,
    },
    root: true,
};
`
    );

    writeGenericFile(
        toolProjectDir,
        './src/.eslintrc.cjs',
        `
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: false,
};
`
    );

    updatePackageJson(
        toolProjectDir,
        `
scripts.check:style="npx eslint ."
scripts.format="npx prettier --ignore-path .gitignore --write ."
scripts.dev:run="node bin.cjs"
scripts.dist:run="node bin.cjs"
scripts.dist:build="npx tsc --build src"
scripts.dist:clean="rm -rf dist"
scripts.test="jest"
prettier="@xch/prettier-config"
`
    );

    await installDependencies(
        toolProjectDir,
        `
commander
semver
`,
        {
            dev: false,
            saveExact: false,
        }
    );
    await installDependencies(
        toolProjectDir,
        `
@types/semver
`,
        {
            dev: true,
            saveExact: false,
        }
    );

    writeGenericFile(
        toolProjectDir,
        './bin.cjs',
        readFileSync(resolvePath(__dirname, '../bin.cjs'), { encoding: 'utf-8' })
    );

    writeGenericFile(
        toolProjectDir,
        './tsconfig.json',
        `
{
    "compilerOptions": {
        "rootDir": ".",
        // if out path for a file is same as its src path, nothing will be emitted
        "outDir": ".",
        // required on the dependency project for references to work
        "composite": true,
        "resolveJsonModule": true
    },
    "files": [
        // by whitelisting the files to include, you avoid the default TS behavior, which
        // will include everything, resulting in \`src\` being included in both projects (bad)
        "package.json"
    ]
}
`
    );

    writeGenericFile(
        toolProjectDir,
        './src/tsconfig.json',
        `
{
    "compilerOptions": {
        "rootDir": ".",
        "outDir": "../dist",
        "module": "NodeNext",
        "strict": true,
        "target": "ES2022",
        "esModuleInterop": true,
        "resolveJsonModule": true
    },
    "references": [{ "path": ".." }]
}
`
    );

    writeGenericFile(
        toolProjectDir,
        './src/cli.ts',
        `
export const run = async (argv: string[]) => {
    console.log('hello world!');
};
`
    );
};
