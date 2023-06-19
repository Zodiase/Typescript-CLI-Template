import { writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import { PackageJson } from 'type-fest';

export default (projectDir: string, packageJson: PackageJson) => {
    const packageJsonPath = resolvePath(projectDir, 'package.json');
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
};
