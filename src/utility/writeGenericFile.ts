import { ensureFileSync, writeFileSync } from 'fs-extra';
import { resolve as resolvePath } from 'path';
import skippable from './skippable';
// import Logger, { CommonLoggingKeys } from './Logger';

// const logger = new Logger(module.id);

export default skippable((projectDir: string, filePath: string, content: string) => {
    const absPath = resolvePath(projectDir, filePath);
    ensureFileSync(absPath);
    writeFileSync(absPath, content.trim() + '\n');
});
