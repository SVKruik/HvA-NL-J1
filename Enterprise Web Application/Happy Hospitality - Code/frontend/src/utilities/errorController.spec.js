import {errorCustom, errorGeneral} from "@/utilities/errorController";

/**
 * Error Tests – Controller - Service created by Stefan Kruik
 * @author Emir Bay
 */

describe('Error Service', () => {

    it('errorGeneral should return a general error message', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {
        });

        // Calls the method to generate a general alert
        errorGeneral();
        // Expect alert to be the general error message
        expect(window.alert).toHaveBeenCalledWith("Er ging iets fout. Probeer later nog eens.");
    });

    it('errorCustom should return the provided custom error message', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {
        });

        // Calls the method to generate a custom message
        const customMessage = "This is a custom error message.";
        errorCustom(customMessage);
        // Expect alert to be the custom error message
        expect(window.alert).toHaveBeenCalledWith(customMessage);
    });
});