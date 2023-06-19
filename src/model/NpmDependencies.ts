import sanitizeFilename from 'sanitize-filename';
import { validRange as validSemverRange } from 'semver';

export class NpmDependency {
    private static regex = /^(?:@(?<scope>[^@\s/]{1,30})\/)?(?<name>[^@\s]{1,30})(?:@(?<version>.{1,256}))?$/;

    static parse(dependency: string): null | NpmDependency {
        const match = NpmDependency.regex.exec(dependency);

        if (!match || !match.groups) {
            return null;
        }

        const packageScopeName = sanitizeFilename(match.groups.scope ?? '', {
            replacement: '',
        }).trim();
        const packageName = sanitizeFilename(match.groups.name ?? '', {
            replacement: '',
        }).trim();

        if (!packageName) {
            return null;
        }

        const scopedPackageName = packageScopeName ? `@${packageScopeName}/${packageName}` : packageName;
        const packageVersion = validSemverRange(match.groups.version) ? match.groups.version.trim() : '';

        return new NpmDependency(scopedPackageName, packageVersion);
    }

    static equals(a: null | NpmDependency, b: null | NpmDependency): boolean {
        if (a === null || b === null) {
            return false;
        }

        return a.name === b.name && a.version === b.version;
    }

    name: string;
    version: string;

    constructor(name: string, version: string) {
        this.name = name;
        this.version = version;
    }

    equals(b: NpmDependency): boolean {
        return NpmDependency.equals(this, b);
    }

    toString(): string {
        return this.version ? `${this.name}@${this.version}` : this.name;
    }
}

export default class NpmDependencies {
    private dependencies: Map<string, NpmDependency>;

    constructor() {
        this.dependencies = new Map();
    }

    count(): number {
        return this.dependencies.size;
    }

    add(dependencyStr: string): NpmDependencies {
        const dependency = NpmDependency.parse(dependencyStr);

        if (dependency) {
            this.dependencies.set(dependency.name, dependency);
        } else {
            // TODO: handle error?
        }

        return this;
    }

    get(dependencyStr: string): null | NpmDependency {
        const dependency = NpmDependency.parse(dependencyStr);

        if (dependency) {
            if (this.dependencies.has(dependency.name)) {
                if (!dependency.version) {
                    return this.dependencies.get(dependency.name) ?? null;
                } else {
                    const storedDependency = this.dependencies.get(dependency.name) ?? null;
                    return NpmDependency.equals(storedDependency, dependency) ? storedDependency : null;
                }
            }
        } else {
            // TODO: handle error?
        }

        return null;
    }

    remove(dependencyStr: string): NpmDependencies {
        const dependency = NpmDependency.parse(dependencyStr);

        if (dependency) {
            this.dependencies.delete(dependency.name);
        } else {
            // TODO: handle error?
        }

        return this;
    }

    toString(): string {
        return Array.from(this.dependencies)
            .reverse()
            .map(([, dep]) => dep.toString())
            .join(' ');
    }
}
