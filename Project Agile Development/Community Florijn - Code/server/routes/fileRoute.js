/**
 * Routes for the 'file' entity.
 * Upload file route requires FormData.
 * @author Pim Meijer & Donovan Tjokrodimedjo & Stefan Kruik
 */
const fs = require("fs");

class fileRoutes {
    #errorCodes = require("../framework/utils/httpErrorCodes");
    #multer = require("multer");
    #app

    /**
     * @param app - ExpressJS instance passed via app.js.
     */
    constructor(app) {
        this.#app = app;

        // Activate all the methods.
        this.#uploadFile();
        this.#renameFile();
        this.#deleteFile();
    };

    /**
     * Upload a new file to the SFTP server.
     * @private
     */
    #uploadFile() {
        this.#app.post("/file/upload", this.#multer().single("upload-file"), (req, res) => {

            if (!req.file) {
                return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: "No file was uploaded." });
            }

            // Get the buffer of the file
            const sampleFile = req.file.buffer;

            fs.writeFile(wwwrootPath + `/uploads/${req.body.location}/${req.body.fileName}.jpg`, sampleFile, (err) => {
                if (err) {
                    console.log(err)
                    return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: err });
                };

                return res.status(this.#errorCodes.HTTP_OK_CODE).json("File successfully uploaded.");

            });
        });
    };

    /**
     * Rename a specific file on the SFTP server.
     * @private
     */
    #renameFile() {
        this.#app.post("/file/rename", (req, res) => {
            // Check for the presence of the necessary parameters.
            if (!req.body.location || !req.body.fileName || !req.body.newFileName) {
                return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: "Missing arguments." });
            }

            // Rename the file
            fs.rename(
                wwwrootPath + `/uploads/${req.body.location}/${req.body.fileName}.jpg`,
                wwwrootPath + `/uploads/${req.body.location}/${req.body.newFileName}.jpg`,
                (err) => {
                    if (err) {
                        console.log(err)
                        return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: err });
                    };

                    return res.status(this.#errorCodes.HTTP_OK_CODE).json("File successfully renamed.");
                }
            );
        });
    };

    /**
     * Delete a specific file from the SFTP server.
     * @private
     */
    #deleteFile() {
        this.#app.delete("/file/delete", (req, res) => {
            // Check for the presence of the neccessery paramaters.
            if (!req.body.location || !req.body.fileName) {
                return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: "Missing arguments." });
            }

            // Delete the file
            fs.unlink(wwwrootPath + `/uploads/${req.body.location}/${req.body.fileName}.jpg`, (err) => {
                if (err) {
                    console.log(err)
                    return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({ reason: err });
                };

                return res.status(this.#errorCodes.HTTP_OK_CODE).json("File successfully deleted.");
            });
        });
    };
};

module.exports = fileRoutes;