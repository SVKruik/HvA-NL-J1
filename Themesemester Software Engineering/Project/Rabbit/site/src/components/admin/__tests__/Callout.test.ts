// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import Callout from "../components/Callout.vue";
import { render, screen } from "@testing-library/vue";

describe("Callout.vue", () => {
    const defaultProps = {
        title: "Test Title",
        description: "This is a test description.",
    };

    it("renders title", () => {
        render(Callout, {
            props: defaultProps,
        });

        const title = screen.getByText(defaultProps.title);
        expect(title).toBeVisible();
    });
});
