import { fetchApi } from "@/utilities/networkController";
import axios from 'axios';

/**
 * Network Tests
 * @author Stefan Kruik
 */

jest.mock("axios");

describe('Network Test Suite', () => {
    it('Should call a request using Axios.', async () => {
        const response = await fetchApi('http://localhost:8008/ticket', 'GET', null, true);
        expect(axios).toHaveBeenCalled();
        expect(response.ticket.length).toEqual(8);
    });
});
