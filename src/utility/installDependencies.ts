import { exec } from 'child_process';
import NpmDependencies from '../model/NpmDependencies';

export default async (projectDir: string, dependenciesStr: string, options: { dev: boolean; saveExact: boolean }) => {
    const saveFlag = (options.dev ? '--save-dev' : '--save') + (options.saveExact ? ' --save-exact' : '');
    const dependencies = new NpmDependencies();

    dependenciesStr.split('\n').reduce((collection, line) => {
        if (line.trim().length > 0) {
            collection.add(line);
        }

        return collection;
    }, dependencies);

    console.log(`npm install ${saveFlag} ${dependencies.toString()}`);
    //! Execute the command.
};
