import { mount } from "@vue/test-utils";
import RegisterPage from "@/components/RegisterPage.vue";
import CryptoJS from "crypto-js";

/**
 * Register Tests
 * @author Mike Schaper
 */

describe("Register test suite", () => {
    it("should show the correct role", async () => {
        //** Setup - Arrange **//

        //** Load - Act **//
        const wrapper = mount(RegisterPage);
        const buttonsEl = wrapper.findAll(".role-btns > *");

        //** Test - Assert **//
        // Test initial state for entrepreneur class
        expect(buttonsEl.at(0).classes()).toContain("isActive");
        // Click partner role
        await buttonsEl.at(1).trigger("click");
        // Test for partner class change
        expect(buttonsEl.at(1).classes()).toContain("isActive");
    });

    it("should correctly hash the password", () => {
        //** Setup - Arrange **//
        const rawPassword = "testPassword";

        //** Load - Act **//
        const wrapper = mount(RegisterPage);
        const encryptedPassword = wrapper.vm.encryptPassword(rawPassword);

        //** Test - Assert **//
        const expectedHash = CryptoJS.SHA256(rawPassword).toString();
        expect(encryptedPassword).toBe(expectedHash);
    });

    it("should validate email format correctly", async () => {
        //** Setup - Arrange **//
        const data = {
            formInputs: {
                companyName: "Test Company",
                email: "test@example.com",
                name: "Test Name",
                password: "testPassword",
                confirmPassword: "testPassword",
            },
        };
        //** Load - Act **//
        const wrapper = mount(RegisterPage);
        await wrapper.setData(data);

        //** Test - Assert **//
        expect(wrapper.vm.errorMessage).toBe("");
    });

    it("should give no error message passing through right form inputs", async () => {
        //** Setup - Arrange **//
        const data = {
            formInputs: {
                companyName: "Test Company",
                email: "test@example.com",
                name: "Test Name",
                password: "testPassword",
                confirmPassword: "testPassword",
            },
        };

        //** Load - Act **//
        const wrapper = mount(RegisterPage);
        await wrapper.setData(data);

        //** Test - Assert **//
        expect(wrapper.vm.errorMessage).toBe("");
    });

    it("should check if password and confirm password match", async () => {
        //** Setup - Arrange **//
        const data = {
            formInputs: {
                companyName: "Test Company",
                email: "test@example.com",
                name: "Test Name",
                password: "testPassword",
                confirmPassword: "differentTestPassword",
            },
        };

        //** Load - Act **//
        const wrapper = mount(RegisterPage);
        await wrapper.setData(data);

        //** Test - Assert **//
        await wrapper.vm.createUser();
        expect(wrapper.vm.errorMessage).toContain("The passwords do not match");
    });

    it("should display an error message for invalid email", async () => {
        //** Setup - Arrange **//
        const data = {
            formInputs: {
                companyName: "Test Company",
                email: "invalidEmail",
                name: "Test Name",
                password: "testPassword",
                confirmPassword: "testPassword",
            },
        };

        //** Load - Act **//
        const wrapper = mount(RegisterPage);
        await wrapper.setData(data);

        //** Test - Assert **//
        await wrapper.vm.createUser();
        expect(wrapper.vm.errorMessage).toContain(
            "Please enter a valid email address"
        );
    });
});
