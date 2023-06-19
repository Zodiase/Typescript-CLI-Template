import NpmDependencies, { NpmDependency } from './NpmDependencies';

describe('NpmDependencies', () => {
    describe('NpmDependency', () => {
        it('can be instantiated', () => {
            const instance = new NpmDependency('foo', '1.2.3');

            expect(instance.name).toBe('foo');
            expect(instance.version).toBe('1.2.3');
        });

        it('can be compared', () => {
            const instanceA = new NpmDependency('foo', '1.2.3');
            const instanceB = new NpmDependency('foo', '1.2.3');
            const instanceC = new NpmDependency('foo', '1.2.4');

            expect(instanceA.equals(instanceB)).toBe(true);
            expect(instanceB.equals(instanceA)).toBe(true);
            expect(NpmDependency.equals(instanceA, instanceB)).toBe(true);
            expect(NpmDependency.equals(instanceA, instanceC)).toBe(false);
            expect(NpmDependency.equals(instanceA, null)).toBe(false);
            expect(NpmDependency.equals(null, null)).toBe(false);
        });

        describe('NpmDependency.parse', () => {
            it('parses dependency strings', () => {
                expect(NpmDependency.parse('lodash')).toMatchObject({
                    name: 'lodash',
                    version: '',
                });

                expect(NpmDependency.parse('lodash@1.2.3')).toMatchObject({
                    name: 'lodash',
                    version: '1.2.3',
                });
                expect(NpmDependency.parse('lodash@^1.2.3')).toMatchObject({
                    name: 'lodash',
                    version: '^1.2.3',
                });
            });
            it('returns null for invalid inputs', () => {
                expect(NpmDependency.parse('')).toBeNull();
                expect(NpmDependency.parse(' ')).toBeNull();
                expect(NpmDependency.parse('\t')).toBeNull();
                expect(NpmDependency.parse('\n')).toBeNull();
                expect(NpmDependency.parse('@')).toBeNull();
                expect(NpmDependency.parse('@1.2.3')).toBeNull();
                expect(NpmDependency.parse(' lodash ')).toBeNull();
                expect(NpmDependency.parse('lodash @1.2.3')).toBeNull();
                expect(NpmDependency.parse(' lodash@1.2.3 ')).toBeNull();
            });
        });

        describe('NpmDependency#toString', () => {
            it('returns a string representation of the dependency', () => {
                const instance = new NpmDependency('foo', '1.2.3');
                expect(instance.toString()).toBe('foo@1.2.3');
            });
        });
    });

    it('can be instantiated', () => {
        expect(() => new NpmDependencies()).not.toThrow();
    });

    it('can tell its size', () => {
        const instance = new NpmDependencies();
        expect(instance.count()).toBe(0);
    });

    it('can add dependency strings', () => {
        const instance = new NpmDependencies();
        instance.add('lodash');
        expect(instance.count()).toBe(1);
        instance.add('underscore');
        expect(instance.count()).toBe(2);
    });

    it('can retrieve dependency strings', () => {
        const instance = new NpmDependencies();
        instance.add('lodash@1.2.3');
        expect(instance.get('lodash')).toMatchObject({
            name: 'lodash',
            version: '1.2.3',
        });
        expect(instance.get('lodash@2.0.0')).toBe(null);
        expect(instance.get('lodash@1.2.3')).toMatchObject({
            name: 'lodash',
            version: '1.2.3',
        });
    });

    it('will not have duplicate entries', () => {
        const instance = new NpmDependencies();
        instance.add('lodash');
        expect(instance.count()).toBe(1);
        expect(instance.get('lodash')).toMatchObject({
            name: 'lodash',
            version: '',
        });
        instance.add('lodash@1.2.3');
        expect(instance.count()).toBe(1);
        expect(instance.get('lodash')).toMatchObject({
            name: 'lodash',
            version: '1.2.3',
        });
    });

    it('can remove dependency strings', () => {
        const instance = new NpmDependencies();
        instance.add('lodash');
        expect(instance.count()).toBe(1);
        instance.remove('lodash');
        expect(instance.count()).toBe(0);
        expect(instance.get('lodash')).toBe(null);
        instance.remove('underscore');
        expect(instance.count()).toBe(0);
    });

    describe('NpmDependencies#toString', () => {
        it('returns a string representation of all the dependencies', () => {
            const instance = new NpmDependencies();
            instance.add('lodash');
            instance.add('underscore@^2');
            expect(instance.toString()).toBe('lodash underscore@^2');
        });
    });
});
