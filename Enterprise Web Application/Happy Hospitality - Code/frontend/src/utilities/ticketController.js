/**
 * Ticket Controller
 * Create new tickets used for images etc.
 *
 * @author Stefan Kruik
 */

/**
 * Generate a new ticket.
 * A ticket is a string consisting of random numbers and letters, with a total length of 8 characters.
 *
 * @return {string} The random generated ticket.
 */
export function createTicket() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let ticket = "";

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        ticket += characters.charAt(randomIndex);
    }

    return ticket;
}
