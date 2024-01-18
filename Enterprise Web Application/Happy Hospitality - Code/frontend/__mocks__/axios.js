const data = require("../fixtures/networkData.json");

// Mock Axios behavior
const axios = jest.fn(() => Promise.resolve(data));

export default axios;