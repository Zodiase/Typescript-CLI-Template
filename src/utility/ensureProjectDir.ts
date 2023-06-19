import { mkdirSync } from 'fs';

export default (projectDir: string) => {
    mkdirSync(projectDir);
};
