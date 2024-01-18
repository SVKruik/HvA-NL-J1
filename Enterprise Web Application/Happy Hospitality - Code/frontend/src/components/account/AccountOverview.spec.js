import AccountOverview from '@/components/account/AccountOverview.vue';
import {deleteItem, setItem} from "@/utilities/sessionController";
import {mount} from '@vue/test-utils';

/**
 * Account Overview Tests – Component
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
        "postalCode": "1001 AB Amsterdam"
    })
}));

describe('AccountOverview Component', () => {
    beforeEach(() => {
        // Setting localStorage to prevent redirection
        setItem("email", "emir.bay@hva.nl");
        setItem("userType", "Entrepreneur");
    });

    it('Check if initial data is empty', () => {
        const wrapper = mount(AccountOverview);
        // The form inputs should be empty, before the userInfo method gets called
        expect(wrapper.vm.$data.formInputs.name).toBe('');
        expect(wrapper.vm.$data.formInputs.companyName).toBe('');
    });

    it('Fills in the inputs with the user data in advance', async () => {
        const wrapper = mount(AccountOverview);

        // Retrieve all the relevant input fields
        const nameInput = wrapper.find('#name');
        const ageInput = wrapper.find('#age');
        const addressInput = wrapper.find('#address');
        const genderInput = wrapper.find('#gender');
        const companyFunctionInput = wrapper.find('#function');
        const companyNameInput = wrapper.find('#company-name');
        const postalCodeInput = wrapper.find('#postal-code');
        const industryInput = wrapper.find('#business-type');

        // Calls the userInfo method, which fills in the inputs with the saved data
        await wrapper.vm.userInfo();

        // Assert that the value of the input field matches the expected value
        expect(nameInput.element.value).toBe('Emir');
        expect(ageInput.element.value).toBe('21');
        expect(addressInput.element.value).toBe('Amstelcampus, Wibautstraat 1a');
        expect(genderInput.element.value).toBe('Man');
        expect(companyFunctionInput.element.value).toBe('CEO');
        expect(companyNameInput.element.value).toBe('Emir INC');
        expect(postalCodeInput.element.value).toBe('1001 AB Amsterdam');
        expect(industryInput.element.value).toBe('Horecabedrijf');
    });

    it('Should redirect to login when there is no email in session', async () => {
        const wrapper = mount(AccountOverview);

        // Mocking the router push method
        wrapper.vm.$router = {push: jest.fn()};

        // Delete email from session
        deleteItem("email");

        // Trigger the status method
        await wrapper.vm.status();

        // Check if the router push method was called with the expected argument
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/login');
    });

    it('Should not redirect when there is an email in session', async () => {
        const wrapper = mount(AccountOverview);

        // Mocking the router push method
        wrapper.vm.$router = {push: jest.fn()};

        // Trigger the status method
        await wrapper.vm.status();

        // Check if the router push method was not called
        expect(wrapper.vm.$router.push).not.toHaveBeenCalled();
    });

    it('Should redirect to settings when user is an admin', async () => {
        const wrapper = mount(AccountOverview);

        // Mocking the router push method
        wrapper.vm.$router = {push: jest.fn()};

        // Set user to admin
        setItem("admin", "true")

        // Trigger the status method
        await wrapper.vm.status();

        // Check if the router push method was called with the expected argument
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/account/settings');
    });
});