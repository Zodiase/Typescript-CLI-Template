import { mkdirSync } from 'fs';
import Logger, { CommonLoggingKeys } from './Logger';

const logger = new Logger(module.id);

export default (projectDir: string) => {
    logger.debug('Creating project directory', { [CommonLoggingKeys.Path]: projectDir });
    mkdirSync(projectDir);
};
