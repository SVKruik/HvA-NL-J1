const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const errorcodes = require("./framework/utils/httpErrorCodes");
const path = require("path");

// Network Config
app.use(express.static(path.join(__dirname, '../src')));
app.use(morgan("short"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const corsConfig = require("./framework/utils/corsConfigHelper");
app.use(corsConfig);

// Routes
const routesPath = path.join(__dirname, "routes");
require("fs").readdirSync(routesPath).forEach((file) => {
    if (file.match(/\.js$/) !== null && file !== "index.js") {
        const name = file.replace(".js", "");

        try {
            exports[name] = require(path.join(routesPath, file));
            if (typeof exports[name] === "function") {
                new exports[name](app);
                console.log(`Loaded and instantiated routes in ${name}.js`);
            } else {
                console.error(`Routes file ${name} found but not able to instantiate. Make sure it is a class, has a constructor, and is being exported by module.exports = ..`);
            }
        } catch (err) {
            console.error(`Failed to load route file ${file}:`, err.message);
        }
    }
});

// Fallback Route
app.get("*", (req, res) => {
    res.status(errorcodes.ROUTE_NOT_FOUND_CODE).json({ reason: "Not found, make sure the endpoint you are trying to call exists." });
});

module.exports = app;