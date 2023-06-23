import { ensureDirSync } from 'fs-extra';
import Logger, { CommonLoggingKeys } from './Logger';
import skippable from './skippable';

const logger = new Logger(module.id);

export default skippable((projectDir: string) => {
    logger.debug('Creating project directory', { [CommonLoggingKeys.Path]: projectDir });
    ensureDirSync(projectDir);
});
