import { createOTP } from '@/utilities/OTPController';

/**
 * OTP Test – Controller
 *
 * @author Milou Hogendoorn
 */


describe('OTPController', () => {

    it('Generate a valid OTP code', () => {
        //Regex for a valid OTP code
        const otpRegex = /^[A-Z0-9]{8}$/;

        const generatedOTP = createOTP();

        expect(generatedOTP).toMatch(otpRegex);
    });
});

