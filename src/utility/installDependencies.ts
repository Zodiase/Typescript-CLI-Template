import { exec } from 'child_process';
import NpmDependencies from '../model/NpmDependencies';
import Logger, { CommonLoggingKeys } from './Logger';

const logger = new Logger(module.id);

export default async (projectDir: string, dependenciesStr: string, options: { dev: boolean; saveExact: boolean }) => {
    const listOfDependencies = dependenciesStr.trim().split('\n');
    logger.debug('Installing npm dependencies', {
        [CommonLoggingKeys.Path]: projectDir,
        [CommonLoggingKeys.Value]: listOfDependencies,
        [CommonLoggingKeys.Details]: { saveDev: options.dev, saveExact: options.saveExact },
    });
    const saveFlag = (options.dev ? '--save-dev' : '--save') + (options.saveExact ? ' --save-exact' : '');
    const dependencies = new NpmDependencies();

    listOfDependencies.reduce((collection, line) => {
        if (line.trim().length > 0) {
            collection.add(line);
        }

        return collection;
    }, dependencies);

    const installCmdStr = `npm install ${saveFlag} ${dependencies.toString()}`;

    return new Promise((resolve, reject) => {
        console.log(`> ${installCmdStr}`);
        exec(
            installCmdStr,
            {
                cwd: projectDir,
            },
            (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            }
        );
    });
};
