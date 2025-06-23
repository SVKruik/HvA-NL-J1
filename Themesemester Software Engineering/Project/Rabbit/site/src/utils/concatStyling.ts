/**
 * Concatenates multiple class names into a single string.
 * @param classes The classes to be concatenated.
 * @returns The concatenated classes.
 */
export function concatStyling(...classes: string[]): string {
    return classes.filter(Boolean).join(" ");
}
