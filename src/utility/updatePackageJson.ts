import { readFileSync, writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import objectPath from 'object-path';
import Logger, { CommonLoggingKeys } from './Logger';
import skippable from './skippable';

const logger = new Logger(module.id);
const propertyLineRegex =
    /^(?<path>[a-z][a-z0-9]*(?::[a-z][a-z0-9]*)*(?:\.[a-z][a-z0-9]*(?::[a-z][a-z0-9]*)*)*)="(?<value>.+)"$/i;

export default skippable((projectDir: string, properties: string) => {
    const packageJsonPath = resolvePath(projectDir, 'package.json');
    const listOfProperties = properties
        .trim()
        .split('\n')
        .map((line) => {
            const match = propertyLineRegex.exec(line);

            if (!match || !match.groups) {
                return null;
            }

            const { path: rawPropertyPath, value: rawPropertyValue } = match.groups;

            return {
                path: rawPropertyPath,
                value: rawPropertyValue,
            };
        })
        .filter(Boolean);
    logger.debug('Updating NPM package manifest', {
        [CommonLoggingKeys.Path]: packageJsonPath,
        [CommonLoggingKeys.Details]: listOfProperties,
    });

    const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf-8' }));

    listOfProperties.forEach((prop) => {
        if (!prop) {
            return;
        }

        // TODO: check protected paths.

        logger.debug('Setting property', { property: prop.path, value: prop.value });
        objectPath.set(packageJson, prop.path, prop.value);
    });

    // TODO: sort properties? Motivation: objectPath seems to order new properties in a strange way.

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + '\n');
});
