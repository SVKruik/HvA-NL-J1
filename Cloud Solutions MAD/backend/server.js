// Express Settings
const express = require("express");
require('dotenv').config()
const port = process.env.SERVER_PORT;
const app = express();
app.use(express.json());
const prefix = process.env.SERVER_PREFIX;

// Init
app.listen(port, () => {
    console.log(`Update server listening on port ${port}.`);
});

// Default
app.get(prefix, (req, res) => {
    res.json({ message: `Default Endpoint` });
});

// JWT Login
app.post(`${prefix}/login`, (req, res) => {
    console.log(res);
});
