import CommonLoggingKeys from './CommonLoggingKeys';
export { default as CommonLoggingKeys } from './CommonLoggingKeys';

export interface LoggerContext {
    [CommonLoggingKeys.Time]: [number, number];
    [CommonLoggingKeys.Logger]: string;
}

export default class Logger {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * Returns a context of the log.
     */
    private getContext(): LoggerContext {
        return {
            [CommonLoggingKeys.Time]: process.hrtime(),
            [CommonLoggingKeys.Logger]: this.name,
        };
    }

    /**
     * Prints a log only when debugging logs are enabled.
     */
    debug(...args: unknown[]): void {
        console.debug(this.getContext(), ...args);
    }
}
