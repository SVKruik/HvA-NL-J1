const errorCodes = require("./httpErrorCodes");

function corsConfigHelper(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers"
    );

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "HEAD, PUT, POST, PATCH, DELETE, GET");
        return res.status(errorCodes.HTTP_OK_CODE).json({});
    };

    next();
};

module.exports = corsConfigHelper;