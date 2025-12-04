import type { DateFormat } from "@/assets/customTypes";

/**
 * Timestamp Calculation
 * @param datetime Overwrite Date.now.
 * @returns Object with date, time, now and the full date string.
 */
export function getDate(datetime: Date | undefined | string): DateFormat {
    let targetDate: Date = new Date();
    if (datetime) targetDate = new Date(datetime);
    const today: Date = new Date(targetDate.toLocaleString("en-US"));

    const hh: string = formatTime(today.getHours());
    const m: string = formatTime(today.getMinutes());

    const dd: string = String(today.getDate()).padStart(2, '0');
    const mm: string = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy: number = today.getFullYear();

    const date: string = `${dd}-${mm}-${yyyy}`;
    const time: string = `${hh}:${m}`;
    const fullDate: string = `${time} ${date}`;

    /**
     * Time formatter.
     * @param {number} value Add an extra zero if the input number is not double-digit.
     * @returns Formatted value.
     */
    function formatTime(value: number): string {
        return value < 10 ? "0" + value : value.toString();
    }

    return { date, time, today, fullDate };
}

/**
 * Convert DD-MM-YYYY to YYYY-MM-DD.
 * @param date The input date.
 * @returns The input date in ISO format.
 */
export function formatISODate(date: string): string {
    // DD-MM-YYYY
    const exploded: Array<string> = date.split('-');

    // YYYY-MM-DD
    return `${exploded[2]}-${exploded[1]}-${exploded[0]}`;
}
