import ForgotPassword from '@/components/ForgotPassword.vue';
import { fetchApi } from '@/utilities/networkController';
import { mount } from '@vue/test-utils';

/**
 * Forgot Password Tests – Component
 *
 * @author Milou Hogendoorn
 */

//Mock window.alert
global.alert = jest.fn();

//Mock the network controller for API calls
jest.mock('@/utilities/networkController', () => ({
    fetchApi: jest.fn().mockResolvedValue({ blocked: false, email: 'milou.hogendoorn@hva.nl' }),
}));

//Mock the OTP controller to generate a certain OTP
jest.mock('@/utilities/OTPController', () => ({
    createOTP: jest.fn(() => '123456'),
}));

describe('ForgotPassword', () => {

    it('Correctly renders the component', () => {
        const wrapper = mount(ForgotPassword);

        //Check if the initial date of the component is as expected
        expect(wrapper.exists()).toBe(true);

        //Check if the data from the component is valid
        expect(wrapper.vm.$data.email).toBe('');
        expect(wrapper.vm.$data.OTP).toBe('');
        expect(wrapper.vm.$data.imageSource).toBeTruthy();
    });

    it('Display the right input when an email is entered', async () => {
        const wrapper = mount(ForgotPassword);
        const emailInput = wrapper.find('#email');

        //Check if the component's data is updated correctly
        await emailInput.setValue('milou.hogendoorn@hva.nl');

        //Check if the data is updated with the right data
        expect(wrapper.vm.$data.email).toBe('milou.hogendoorn@hva.nl');
    });

    it('Calls the checkUser method when the "Verstuur" button is clicked', async () => {
        const wrapper = mount(ForgotPassword);
        const checkUserSpy = jest.spyOn(wrapper.vm, 'checkUser');
        const emailInput = wrapper.find('#email');

        //Enter an e-mail in the inputfield
        await emailInput.setValue('milou.hogendoorn@hva.nl');

        //Click the "Verstuur" button
        wrapper.find('.btn-primary').trigger('click');

        //Check if the checkUser method is called with the given e-mail
        expect(checkUserSpy).toHaveBeenCalledWith('milou.hogendoorn@hva.nl');
    });

    it('Send an e-mail with a valid OTP when the checkUser method is called', async () => {
        //Mock the fetchApi function to simulate the API call
        fetchApi.mockResolvedValue({ blocked: false, email: 'test@example.com' });

        //Create the wrapper
        const wrapper = mount(ForgotPassword);

        //Set the value for the e-mail input
        const emailInput = wrapper.find('#email');
        await emailInput.setValue('test@example.com');

        //Calls the checkUser method which then should trigger the fetchApi
        await wrapper.vm.checkUser('test@example.com');

        //Wait for all async code to complete
        await wrapper.vm.$nextTick();

        //Check if the fetchAPI is called
        expect(fetchApi).toHaveBeenCalled();

        //Check if the alert is called with the expected message
        expect(global.alert).toHaveBeenCalledWith("Bekijk je inbox, check eventueel je spamfolder hierin ontvang je een eenmalig wachtwoord.");
    });
});
