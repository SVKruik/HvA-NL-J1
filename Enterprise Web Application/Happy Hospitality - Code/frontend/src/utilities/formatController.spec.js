import {
    documentTitle,
    formatDateDMY,
    formatDateTime,
    formatStringLimit,
    getStringLimit,
    numberFormat
} from './formatController';

/**
 * Format Controller Tests - Service
 * @author Jenelle Davelaar
 */

describe('Format Service Tests', () => {
    it('formatDateDMY should format date correctly in both locales', () => {
        const formattedDateUS = formatDateDMY('2023-01-01T12:00:00', 'en-US');
        const formattedDateNL = formatDateDMY('2023-02-14T13:20:00', 'nl-NL');

        expect(formattedDateUS).toBe('January 1, 2023');
        expect(formattedDateNL).toBe('14 februari 2023');
    });

    it('formatDateTime should format date and time correctly in both locales', () => {
        const formattedDateTimeUS = formatDateTime('2023-02-14T13:20:00', 'en-US');
        const formattedDateTimeNL = formatDateTime('2023-01-01T12:00:00', 'nl-NL');

        expect(formattedDateTimeUS).toBe('February 14, 2023 at 01:20 PM');
        expect(formattedDateTimeNL).toBe('1 januari 2023 om 12:00');
    });

    it('formatStringLimit should limit the length of the string', () => {
        const inputString = 'This needs to be formatted';

        const limitedString1 = formatStringLimit(inputString, 10);
        const limitedString2 = formatStringLimit(inputString, 5);
        const limitedString3 = formatStringLimit(inputString, 1);

        expect(limitedString1).toBe('This needs...');
        expect(limitedString2).toBe('This ...');
        expect(limitedString3).toBe('T...');
    });

    it('getStringLimit should choose the correct limit based on threshold', () => {
        const largeInput = 'This is a large string to be formatted';
        const smallInput = 'Short string';
        const threshold = 500;

        //Mocks screen.availWidth to be more than 0, test has width to work with
        jest.spyOn(global.screen, 'availWidth', 'get').mockReturnValue(400);
        const formattedStringLarge = getStringLimit(threshold, 5, 10, largeInput);

        jest.spyOn(global.screen, 'availWidth', 'get').mockReturnValue(600);
        const formattedStringSmall = getStringLimit(threshold, 5, 10, smallInput);

        //Screen is less than threshold, limit 'b' is used (10).
        expect(formattedStringLarge).toBe('This is a ...');
        //Screen is more than threshold, limit 'a' is used (5).
        expect(formattedStringSmall).toBe('Short...');
    });

    it('numberFormat should format numbers correctly', () => {
        const numberSmall = numberFormat(123);
        const numberLarge = numberFormat(3260);
        const nonNumber = numberFormat('Number');

        expect(numberSmall).toBe(123);
        expect(numberLarge).toBe('3.3K');
        expect(nonNumber).toBe('Number');

    });

    it('documentTitle should set document title with prefix', () => {
        documentTitle('Document Title Test');
        expect(document.title).toBe('HHC | Document Title Test');
    });
});
