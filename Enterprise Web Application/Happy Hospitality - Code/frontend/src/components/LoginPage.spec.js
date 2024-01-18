import {mount} from '@vue/test-utils';
import LoginPage from '@/components/LoginPage.vue';
import {deleteItem} from "@/utilities/sessionController";

/**
 * Login Tests – Component
 * @author Emir Bay
 */

// Mocks the data of the API call for the tests
jest.mock('@/utilities/networkController', () => ({
    fetchApi: jest.fn().mockResolvedValue({
        "id": 0,
        "address": "Amstelcampus, Wibautstraat 1a",
        "age": 21,
        "companyFunction": "CEO",
        "companyName": "Emir INC",
        "email": "bayet@hva.nl",
        "gender": "Man",
        "industry": "Horecabedrijf",
        "name": "Emir",
        "postalCode": "1001 AB Amsterdam",
        "password": "2cba2ebedf788bc2da7c52609574f1ddd39d0495d1bfb23aa3af65b30c7ffd5c" // Emir
    })
}));

describe('LoginPage Component', () => {
    beforeEach(() => {
        // Deleting localStorage to prevent status error(for redirection) during tests after logging in
        deleteItem("email")
        deleteItem("userType");
    });

    it('Renders the LoginPage component', () => {
        const wrapper = mount(LoginPage);
        expect(wrapper.exists()).toBeTruthy();
    });

    it('Display random image', () => {
        const wrapper = mount(LoginPage);

        // Generate random image
        const imageSource = wrapper.vm.randomImage();

        // Expect a random image to be created
        expect(imageSource).toMatch(/^https:\/\/files\.stefankruik\.com\/uploads\/events\/[A-Z0-9]+\.png$/);
    });

    it('Shows an alert when user info is wrong', async () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {
        });

        const wrapper = mount(LoginPage);

        // Find the email and password input elements and set their values
        const emailInput = wrapper.find('#email');
        await emailInput.setValue('bayet@hva.nl');

        const passwordInput = wrapper.find('#password');
        await passwordInput.setValue('Emir1');

        // Trigger the button click
        await wrapper.find('.btn-primary').trigger('click');

        // Expect the alert to have been called with the expected message
        expect(window.alert).toHaveBeenCalledWith('Verkeerde gegevens!');
    });

    it('Shows an alert if succesfully logged in', async () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {
        });

        const wrapper = mount(LoginPage);

        // Mocking the router push method
        wrapper.vm.$router = {push: jest.fn().mockResolvedValue()};

        // Suppress the navigation error for the window.location.reload, other errors like tests fails (expected, received) will still be shown
        jest.spyOn(console, 'error').mockImplementation(() => {
        });

        // Find the email and password input elements and set their values
        const emailInput = wrapper.find('#email');
        await emailInput.setValue('bayet@hva.nl');

        const passwordInput = wrapper.find('#password');
        await passwordInput.setValue('Emir');

        // Trigger the button click
        await wrapper.find('.btn-primary').trigger('click');

        // Expect the alert to have been called with the expected message
        expect(window.alert).toHaveBeenCalledWith('Ingelogd!');
    });

    it('Redirects to forgot password page when "Wachtwoord vergeten?" is clicked', async () => {
        const wrapper = mount(LoginPage);

        // Mocking the router push method
        wrapper.vm.$router = {push: jest.fn().mockResolvedValue()};

        // Suppress the navigation error for the window.location.reload, other errors like tests fails (expected, received) will still be shown
        jest.spyOn(console, 'error').mockImplementation(() => {
        });

        // Trigger a click on the element with class '.forgot-password'
        await wrapper.find('.forgot-password').trigger('click');

        // Ensure that $router.push was called with the argument 'forgotPassword'
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith('forgotPassword');
    });
});