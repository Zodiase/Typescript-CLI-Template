import { readFileSync, writeFileSync } from 'fs';

export default class IgnoreRules {
    static parse(content: string): IgnoreRules {
        const ignoreRules = new IgnoreRules();

        content.split('\n').reduce((rules, line) => {
            if (line.trim().length > 0) {
                rules.add(line);
            }

            return rules;
        }, ignoreRules);

        return ignoreRules;
    }

    static loadFileSync(filePath: string): IgnoreRules {
        return IgnoreRules.parse(readFileSync(filePath, { encoding: 'utf-8' }));
    }

    static writeFileSync(filePath: string, ignoreRules: IgnoreRules): void {
        writeFileSync(filePath, ignoreRules.toString(), { encoding: 'utf-8' });
    }

    private rules = new Set<string>();

    count(): number {
        return this.rules.size;
    }

    add(pattern: string): IgnoreRules {
        this.rules.add(pattern.trim());
        return this;
    }

    remove(pattern: string): IgnoreRules {
        this.rules.delete(pattern.trim());
        return this;
    }

    toString(): string {
        return Array.from(this.rules).join('\n') + '\n';
    }
}
