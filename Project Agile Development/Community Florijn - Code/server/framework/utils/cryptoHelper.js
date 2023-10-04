class CryptoHelper {
    #cryptoLib = require("crypto");

    generateAuthToken() {
        return this.#cryptoLib.randomBytes(30).toString("hex");
    };

    getHashedPassword(password) {
        const sha256 = this.#cryptoLib.createHash("sha256");
        return sha256.update(password).digest("base64");
    };
};

module.exports = new CryptoHelper();