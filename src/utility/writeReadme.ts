import { writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';

export default (projectDir: string, content: string) => {
    const readmePath = resolvePath(projectDir, 'readme.md');
    writeFileSync(readmePath, content);
};
