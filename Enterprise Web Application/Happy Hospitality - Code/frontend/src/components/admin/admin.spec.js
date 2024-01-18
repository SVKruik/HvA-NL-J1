import adminData from "@/../fixtures/adminData.json"
import AdminUserItem from "@/components/admin/AdminUserItem.vue";
import EventOverview from "@/components/admin/EventOverview.vue";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";

/**
 * Administrator Tests
 * @author Stefan Kruik
 */

// Mock Router
const routerMockPlugin = {
    plugins: [createRouter({
        history: createWebHistory(),
        routes: [
            {
                path: '/',
                component: {
                    template: '<div></div>'
                }
            },
            {
                path: '/admin',
                component: {
                    template: '<div></div>'
                }
            },
            {
                path: '/events',
                component: {
                    template: '<div></div>'
                }
            }
        ]
    })],
    mocks: {
        $route: {
            fullPath: '/events'
        }
    }
}

describe("Admin Overview Test Suite", () => {
    beforeEach(() => {
        // Setup session to prevent a redirect.
        window.localStorage.setItem("admin", true);
        window.localStorage.setItem("rank", "Administrator");
    });

    it("Should display the correct User information.", async () => {
        // Setup
        const data = adminData.superUsers[0]; // Stefan

        // Load
        const wrapper = mount(AdminUserItem, {
            props: data
        });

        // Test
        expect(wrapper.props().name).toEqual("Stefan Kruik");
        expect(wrapper.find(".information-container").element.childNodes[0].textContent).toEqual("Stefan Kruik");
    });

    it("Should display the correct Rank.", async () => {
        // Setup
        const data = adminData.superUsers[1]; // Emir

        // Load
        const wrapper = mount(AdminUserItem, {
            props: data
        });

        // Test
        expect(wrapper.find({ ref: "admin-select" }).element.value).toEqual("Super User");
    });

    it("Should choose correct class name depending on Block status.", async () => {
        // Setup
        const data = adminData.superUsers[2]; // Donovan

        // Load
        const wrapper = mount(AdminUserItem, {
            props: data
        });

        // Test
        expect(wrapper.find(".unblock-button").exists()).toBeFalsy();
        expect(wrapper.find(".block-button").exists()).toBeTruthy();
    });
});

describe("Event Overview Test Suite", () => {
    beforeEach(() => {
        // Setup session to prevent a redirect.
        window.localStorage.setItem("admin", true);
        window.localStorage.setItem("rank", "Administrator");
    });


    it("Should display placeholder message when there are no Events.", () => {
        // Setup
        const data = [];

        const wrapper = mount(EventOverview, {
            data() {
                return {
                    eventList: data
                }
            },
            global: routerMockPlugin
        });

        // Test
        expect(wrapper.find({ ref: "placeholder-text" }).exists()).toBeTruthy();
    });

    it("Should load all Events correctly.", async () => {
        // Setup
        const data = adminData.events

        // Load
        const wrapper = mount(EventOverview, {
            data() {
                return {
                    eventList: data
                }
            },
            global: routerMockPlugin
        });

        // Test
        expect(wrapper.find({ ref: "placeholder-text" }).exists()).toBeFalsy();
        expect(wrapper.find(".event-container").element.childElementCount).toEqual(3);
    });
});