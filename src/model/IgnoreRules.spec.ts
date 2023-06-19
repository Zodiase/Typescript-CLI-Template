import IgnoreRules from './IgnoreRules';

describe('IgnoreRules', () => {
    it('can be instantiated', () => {
        expect(() => new IgnoreRules()).not.toThrow();
    });

    it('can tell its size', () => {
        const instance = new IgnoreRules();
        expect(instance.count()).toBe(0);
    });

    it('can add pattern strings', () => {
        const instance = new IgnoreRules();
        instance.add('node_modules');
        expect(instance.count()).toBe(1);
        instance.add('dist');
        expect(instance.count()).toBe(2);
    });

    it('will not have duplicate entries', () => {
        const instance = new IgnoreRules();
        instance.add('node_modules');
        expect(instance.count()).toBe(1);
        instance.add('node_modules');
        expect(instance.count()).toBe(1);
    });

    it('can remove pattern strings', () => {
        const instance = new IgnoreRules();
        instance.add('node_modules');
        expect(instance.count()).toBe(1);
        instance.remove('node_modules');
        expect(instance.count()).toBe(0);
        instance.remove('dist');
        expect(instance.count()).toBe(0);
    });

    describe('IgnoreRules#toString', () => {
        it('returns a string representation of all the rules', () => {
            const instance = new IgnoreRules();
            instance.add('node_modules');
            instance.add('dist');
            expect(instance.toString()).toBe('node_modules\ndist\n');
        });
    });

    describe('IgnoreRules.parse', () => {
        it('parses rule strings', () => {
            expect(IgnoreRules.parse('node_modules').toString()).toBe('node_modules\n');
            expect(
                IgnoreRules.parse(
                    `
node_modules
dist
`
                ).toString()
            ).toBe('node_modules\ndist\n');
        });
    });
});
