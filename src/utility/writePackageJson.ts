import { writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import { PackageJson } from 'type-fest';
import Logger, { CommonLoggingKeys } from './Logger';

const logger = new Logger(module.id);

export default (projectDir: string, packageJson: PackageJson) => {
    const packageJsonPath = resolvePath(projectDir, 'package.json');
    logger.debug('Creating NPM package manifest', { [CommonLoggingKeys.Path]: packageJsonPath });
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n');
};
