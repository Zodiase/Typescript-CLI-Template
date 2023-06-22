import { writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
// import Logger, { CommonLoggingKeys } from './Logger';

// const logger = new Logger(module.id);

export default (projectDir: string, filePath: string, content: string) => {
    const absPath = resolvePath(projectDir, filePath);
    writeFileSync(absPath, content);
};
