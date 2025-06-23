// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { getPageButtons } from "../utils";

describe("getPageButtons", () => {
    const MAX_BUTTONS = 5; // Reflects the hardcoded value in the function

    // --- Scenario 1: Total pages less than or equal to maxButtons ---
    it("should return all pages if totalPages is less than maxButtons", () => {
        expect(getPageButtons(3, 1)).toEqual([1, 2, 3]);
        expect(getPageButtons(3, 2)).toEqual([1, 2, 3]);
        expect(getPageButtons(3, 3)).toEqual([1, 2, 3]);
    });

    it("should return all pages if totalPages is equal to maxButtons", () => {
        expect(getPageButtons(MAX_BUTTONS, 1)).toEqual([1, 2, 3, 4, 5]);
        expect(getPageButtons(MAX_BUTTONS, 3)).toEqual([1, 2, 3, 4, 5]);
        expect(getPageButtons(MAX_BUTTONS, MAX_BUTTONS)).toEqual([
            1, 2, 3, 4, 5,
        ]);
    });

    // --- Scenario 2: Total pages greater than maxButtons ---
    describe("when totalPages > maxButtons", () => {
        const totalPages = 10;

        // Current page at the beginning
        it("should show first set of buttons when currentPage is at the beginning (1)", () => {
            expect(getPageButtons(totalPages, 1)).toEqual([1, 2, 3, 4, 5]);
        });

        it("should show first set of buttons when currentPage is at the beginning (2)", () => {
            expect(getPageButtons(totalPages, 2)).toEqual([1, 2, 3, 4, 5]);
        });

        it("should show first set of buttons when currentPage is at the beginning (3)", () => {
            // startPage = max(3-2, 1) = 1. endPage = 1 + 5 - 1 = 5.
            expect(getPageButtons(totalPages, 3)).toEqual([1, 2, 3, 4, 5]);
        });

        // Current page in the middle
        it("should center buttons around currentPage when in the middle (4)", () => {
            // startPage = max(4-2, 1) = 2. endPage = 2 + 5 - 1 = 6.
            expect(getPageButtons(totalPages, 4)).toEqual([2, 3, 4, 5, 6]);
        });

        it("should center buttons around currentPage when in the middle (5)", () => {
            // startPage = max(5-2, 1) = 3. endPage = 3 + 5 - 1 = 7.
            expect(getPageButtons(totalPages, 5)).toEqual([3, 4, 5, 6, 7]);
        });

        it("should center buttons around currentPage when in the middle (7)", () => {
            // startPage = max(7-2, 1) = 5. endPage = 5 + 5 - 1 = 9.
            expect(getPageButtons(totalPages, 7)).toEqual([5, 6, 7, 8, 9]);
        });

        // Current page at the end
        it("should show last set of buttons when currentPage is at the end (10)", () => {
            // startPage = max(10-2, 1) = 8. endPage = 8 + 5 - 1 = 12.
            // endPage > totalPages (12 > 10) -> endPage = 10. startPage = max(10-5+1, 1) = 6.
            expect(getPageButtons(totalPages, 10)).toEqual([6, 7, 8, 9, 10]);
        });

        it("should show last set of buttons when currentPage is near the end (9)", () => {
            // startPage = max(9-2, 1) = 7. endPage = 7 + 5 - 1 = 11.
            // endPage > totalPages (11 > 10) -> endPage = 10. startPage = max(10-5+1, 1) = 6.
            expect(getPageButtons(totalPages, 9)).toEqual([6, 7, 8, 9, 10]);
        });

        it("should show last set of buttons when currentPage is near the end (8)", () => {
            // startPage = max(8-2, 1) = 6. endPage = 6 + 5 - 1 = 10.
            // endPage not > totalPages
            expect(getPageButtons(totalPages, 8)).toEqual([6, 7, 8, 9, 10]);
        });

        // Edge case: totalPages is just slightly more than maxButtons
        it("should handle totalPages = maxButtons + 1 correctly (currentPage=1)", () => {
            expect(getPageButtons(MAX_BUTTONS + 1, 1)).toEqual([1, 2, 3, 4, 5]); // e.g. total 6, current 1
        });
        it("should handle totalPages = maxButtons + 1 correctly (currentPage=3)", () => {
            expect(getPageButtons(MAX_BUTTONS + 1, 3)).toEqual([1, 2, 3, 4, 5]); // e.g. total 6, current 3
        });
        it("should handle totalPages = maxButtons + 1 correctly (currentPage=4)", () => {
            expect(getPageButtons(MAX_BUTTONS + 1, 4)).toEqual([2, 3, 4, 5, 6]); // e.g. total 6, current 4
        });
        it("should handle totalPages = maxButtons + 1 correctly (currentPage=6)", () => {
            expect(getPageButtons(MAX_BUTTONS + 1, MAX_BUTTONS + 1)).toEqual([
                2, 3, 4, 5, 6,
            ]); // e.g. total 6, current 6
        });
    });

    // --- Scenario 3: Edge cases with inputs ---
    it("should handle totalPages = 1", () => {
        expect(getPageButtons(1, 1)).toEqual([1]);
    });

    it("should handle currentPage = 0 or invalid low (should behave like 1)", () => {
        // The Math.max(currentPage - 2, 1) handles this by clamping startPage to 1
        expect(getPageButtons(10, 0)).toEqual([1, 2, 3, 4, 5]);
        expect(getPageButtons(10, -5)).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle currentPage > totalPages (should behave like totalPages)", () => {
        // The adjustment logic for endPage > totalPages handles this
        expect(getPageButtons(10, 12)).toEqual([6, 7, 8, 9, 10]); // Behaves as if currentPage was 10
        expect(getPageButtons(5, 7)).toEqual([1, 2, 3, 4, 5]); // Behaves as if currentPage was 5
    });

    it("should return an empty array if totalPages is 0", () => {
        expect(getPageButtons(0, 1)).toEqual([]);
        expect(getPageButtons(0, 0)).toEqual([]);
    });

    // Test with different totalPages to ensure logic holds for various sizes
    it("should work for a larger number of total pages (e.g., 20, current 10)", () => {
        // startPage = max(10-2, 1) = 8. endPage = 8 + 5 - 1 = 12.
        expect(getPageButtons(20, 10)).toEqual([8, 9, 10, 11, 12]);
    });

    it("should work for a larger number of total pages (e.g., 20, current 19)", () => {
        // startPage = max(19-2, 1) = 17. endPage = 17 + 5 - 1 = 21.
        // endPage > totalPages (21 > 20) -> endPage = 20. startPage = max(20-5+1, 1) = 16.
        expect(getPageButtons(20, 19)).toEqual([16, 17, 18, 19, 20]);
    });
});
