import { mount } from "@vue/test-utils";
import Breadcrumb from "@/components/edge/Breadcrumb.vue";
import { createRouter, createWebHistory } from "vue-router";

/**
 * Breadcrumbs Tests
 * @author Mike Schaper
 */

const routes = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About" },
];
const router = createRouter({ history: createWebHistory(), routes });

describe("Breadcrumbs test suite", () => {
    // Navigates to a route & mounts the component with necessary mocks
    const mountComponent = async (path) => {
        await router.push(path);
        await router.isReady();
        return mount(Breadcrumb, {
            global: {
                plugins: [router],
                mocks: {
                    $route: router.currentRoute.value,
                },
            },
        });
    };

    it("should displays breadcrumb based on the current route", async () => {
        //** Setup - Arrange **//

        //** Load - Act **//
        const wrapper = await mountComponent("/about");

        //** Test - Assert **//
        // Check if breadcrumb should be shown
        expect(wrapper.vm.shouldShowBreadcrumb).toBe(true);
        // Check the breadcrumb list
        expect(wrapper.vm.breadcrumbList).toEqual([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
        ]);
        // Check the rendering of breadcrumb items
        const breadcrumbItems = wrapper.findAll(".breadcrumb-item");
        expect(breadcrumbItems.length).toBe(2);
        expect(breadcrumbItems.at(0).text()).toContain("Home");
        expect(breadcrumbItems.at(1).text()).toContain("About");
    });

    it("should does not display breadcrumb at home route", async () => {
        //** Setup - Arrange **//

        //** Load - Act **//
        const wrapper = await mountComponent("/");

        //** Test - Assert **//
        // Check if breadcrumb should not be shown
        expect(wrapper.vm.shouldShowBreadcrumb).toBe(false);
        // Check that the breadcrumb is not rendered
        expect(wrapper.find(".breadcrumb").exists()).toBe(false);
    });
});
