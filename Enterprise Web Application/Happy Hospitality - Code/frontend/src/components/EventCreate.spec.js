import EventCreate from '@/components/EventCreate.vue';
import { setItem } from "@/utilities/sessionController";
import { mount } from '@vue/test-utils';
import {nextTick} from "vue";


/**
 * Event Create Tests – Component
 *
 * @author Stijn Kortekaas
 */

describe('EventCreate', () => {
    let wrapper;
    let fetchApiMock;

    beforeEach(() => {

        // mock the localStorage
        setItem("userType", "Admin/Superuser")

        // Create a mock function for fetchApi
        fetchApiMock = jest.fn();

        // Mount the component with the mock function
        wrapper = mount(EventCreate, {
            props: {
                fetchApi: fetchApiMock
            }
        });

        // makes sure the button is not disabled
        wrapper.find('.submit-button').attributes().disabled = false;
    });

    it('Check if initial data is empty', () => {

        //creates the wrapper object with the EventCreate component
        const wrapper = mount(EventCreate);

        //checks if the data is empty
        expect(wrapper.vm.$data.eventName).toBe('');
        expect(wrapper.vm.$data.description).toBe('');
        expect(wrapper.vm.$data.eventDate).toBe('');
        expect(wrapper.vm.$data.eventPrice).toBe('');

    });

    it('shows error message when form is submitted with empty fields', async () => {
        const wrapper = mount(EventCreate);
        // triggers the submit button
        await wrapper.find(".submit-button").trigger('click');
        expect(wrapper.vm.$data.errorMessages.general).toBe('* 1 of meerdere velden zijn niet ingevuld');
    });

    it('show correct document title when component is loaded', () => {
        // checks if the document title is correct
        expect(document.title).toBe('HHC | Evenement Aanmaken');
    });

    it('makes no api call when form is submitted with empty fields', async () => {
        await wrapper.find(".submit-button").trigger('click');
        expect(fetchApiMock).not.toHaveBeenCalled();
    });

    it('makes sure button does not get disabled after clicking it once', async () => {
        const wrapper = mount(EventCreate);
        await wrapper.find(".submit-button").trigger('click');
        expect(wrapper.find('button').attributes().disabled).toBe(undefined);

    });

});

