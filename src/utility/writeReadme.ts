import { writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import Logger, { CommonLoggingKeys } from './Logger';

const logger = new Logger(module.id);

export default (projectDir: string, content: string) => {
    const readmePath = resolvePath(projectDir, 'readme.md');
    logger.debug('Creating Readme file', { [CommonLoggingKeys.Path]: readmePath });
    writeFileSync(readmePath, content);
};
