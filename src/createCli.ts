import { resolve as resolvePath } from 'path';
import sanitizeFilename from 'sanitize-filename';
import writePackageJson from './utility/writePackageJson';
import ensureProjectDir from './utility/ensureProjectDir';
import writeReadme from './utility/writeReadme';
import ignoreFiles from './utility/ignoreFiles';
import installDependencies from './utility/installDependencies';

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
};
