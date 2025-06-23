// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/vue";
import Systemlogs from "../../../pages/admin/systemlogs.vue";
import type { PaginatedEventLogTypes } from "~/assets/customTypes";
import { useFetchEventLog } from "~/utils/fetch/admin/useFetchEventLog";

// The mock for the useNuxtApp (toast)
vi.stubGlobal("useNuxtApp", () => ({
    $event: vi.fn(),
}));

// Mocking the userstore for the middleware
vi.mock("~/stores/userStore", () => {
    return {
        useUserStore: () => ({
            isAdmin: true,
        }),
    };
});

// The mock for the useFetchEventLog function
vi.mock("~/utils/fetch/admin/useFetchEventLog");

// The mock data for the event logs
const MOCK_LOGS: PaginatedEventLogTypes = {
    data: [
        {
            object_type: "Hopper",
            object_id: 1,
            description: "Max logged in",
            endpoint: "/auth/login",
            date_creation: "2025-06-12T10:00:00Z",
        },
        {
            object_type: "Hopper",
            object_id: 2,
            description: "Updated their burrow",
            endpoint: "/api/burrow",
            date_creation: "2025-06-12T12:30:00Z",
        },
    ],
    pagination: { page: 1, total_pages: 1 },
};

describe("Systemlogs", () => {
    let mockUseFetchEventLog: Mock;

    beforeEach(() => {
        vi.clearAllMocks();

        mockUseFetchEventLog = useFetchEventLog as Mock;
        mockUseFetchEventLog.mockResolvedValue({ ...MOCK_LOGS });
    });

    it("renders the list of system logs", async () => {
        render(Systemlogs);

        expect(await screen.findByText("Max logged in")).toBeInTheDocument();
        expect(screen.getByText("Updated their burrow")).toBeInTheDocument();
    });
});
