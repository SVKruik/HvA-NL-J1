class DatabaseHelper {
    #mysql = require("mysql");
    #dbConfig = serverConfig.database;
    #connectionPool;

    constructor() {
        this.#initConnection()
    };

    #initConnection() {
        setTimeout(() => console.log(this.#dbConfig), 500);
        if (!this.#dbConfig.host || !this.#dbConfig.database || !this.#dbConfig.username || !this.#dbConfig.password) {
            return console.log(`Error: '${serverConfigFile}' not configured! Please fill in your team's credentials!`);
        };

        this.#connectionPool = this.#mysql.createPool({
            host: this.#dbConfig.host,
            port: this.#dbConfig.port,
            user: this.#dbConfig.username,
            password: this.#dbConfig.password,
            database: this.#dbConfig.database,
            timezone: "UTC",
            multipleStatements: true,
            charset: "utf8mb4"
        });

        this.#connectionPool.getConnection((err, conn) => {
            if (err) {
                console.log(err);
                console.error(`${err.errno} ${err.code}: ${err.sqlMessage}`);
            } else {
                conn.release();
            };
        });
    };

    handleQuery(data) {
        return new Promise((resolve, reject) => {
            this.#connectionPool.query({
                sql: data.query,
                values: data.values,
                timeout: this.#dbConfig.timeout
            }, (error, results) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log("Query results: ");
                    console.log(data.query);
                    resolve(results);
                };
            });
        });
    };
};

module.exports = new DatabaseHelper();