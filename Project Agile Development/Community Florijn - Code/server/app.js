/**
 * Server application - contains all server config and api endpoints
 * Only make changes in this file if you know what you are doing :)
 *
 * @author Pim Meijer
 */
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const errorcodes = require("./framework/utils/httpErrorCodes");
const path = require("path");

// Front-end as static directory
app.use(express.static(path.join(__dirname, '../src')));

// Logger library  - 'short' is basic logging info
app.use(morgan("short"));

// Helper libraries for parsing request bodies from json to javascript objects
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS config - Cross Origin Requests
const corsConfig = require("./framework/utils/corsConfigHelper");
app.use(corsConfig);

// ------ ROUTES - all .js files in ./routes are read and loaded
const routesPath = __dirname + "/routes/";

require("fs").readdirSync(routesPath).forEach((file) => {
    if (file.match(/\.js$/) !== null && file !== 'index.js') {
        const name = file.replace(".js", "");

        // Require the <..>routes.js file
        exports[name] = require(routesPath + file);

        // Check if it is a class(function), if it is instantiate it
        if (typeof exports[name] === "function") {
            new exports[name](app);
            console.log(`Loaded and instantiated routes in ${name}.js`);
        } else {
            console.error(`Routes file ${name} found but not able to instantiate. Make sure it is a class, 
            has a constructor and is being exported by module.exports = ..`);
        };
    };
});

// Fallback Route
app.get("*", (req, res) => {
    res.status(errorcodes.ROUTE_NOT_FOUND_CODE).json({ reason: "Not found, make sure the endpoint you are trying to call exists." });
});

//------- END ROUTES -------

module.exports = app;