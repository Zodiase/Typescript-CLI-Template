import { existsSync } from 'fs';
import { resolve as resolvePath } from 'path';
import IgnoreRules from '../model/IgnoreRules';
import Logger, { CommonLoggingKeys } from './Logger';
import skippable from './skippable';

const logger = new Logger(module.id);

export const IgnoreFileTypes = {
    git: '.gitignore',
    prettier: '.prettierignore',
};

export type IgnoreFileType = keyof typeof IgnoreFileTypes;

export default skippable((projectDir: string, patterns: string, type: IgnoreFileType) => {
    const ignoreFilePath = resolvePath(projectDir, IgnoreFileTypes[type]);
    const listOfPatterns = patterns.trim().split('\n');
    logger.debug('Adding ignore rules', {
        ignoreFileType: type,
        [CommonLoggingKeys.Path]: ignoreFilePath,
        [CommonLoggingKeys.Value]: listOfPatterns,
    });
    const ignoreRules = existsSync(ignoreFilePath) ? IgnoreRules.loadFileSync(ignoreFilePath) : new IgnoreRules();

    listOfPatterns.reduce((rules, line) => {
        rules.add(line);

        return rules;
    }, ignoreRules);
    IgnoreRules.writeFileSync(ignoreFilePath, ignoreRules);
});
