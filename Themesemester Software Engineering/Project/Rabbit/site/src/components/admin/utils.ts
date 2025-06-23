export function getPageButtons(
    totalPages: number,
    currentPage: number,
): number[] {
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(currentPage - 2, 1);
    let endPage = startPage + maxButtons - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxButtons + 1, 1);
    }

    return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i,
    );
}
