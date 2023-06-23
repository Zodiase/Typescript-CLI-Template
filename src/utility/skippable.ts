/* eslint-disable @typescript-eslint/no-explicit-any */

type SkippableFunction<T extends (...args: any[]) => void> = T & { skip: (...args: Parameters<T>) => void };

export default <T extends (...args: any[]) => void>(func: T): SkippableFunction<T> => {
    const skipFunction: SkippableFunction<T> = Object.assign(func, {
        skip: () => {
            // NOOP
        },
    });
    return skipFunction;
};
