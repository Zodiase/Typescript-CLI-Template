import hello from './hello';

describe('hello', () => {
    it('does not throw', () => {
        expect(() => hello()).not.toThrow();
    });
});
