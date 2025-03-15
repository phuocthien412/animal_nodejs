var config = require("../config/setting.json");
const { MongoClient } = require('mongodb');

class DatabaseConnection {
    static #instance;
    static #client;

    constructor() {
        if (DatabaseConnection.#instance) {
            return DatabaseConnection.#instance;
        }
        DatabaseConnection.#instance = this;
    }

    static getMongoClient() {
        if (!DatabaseConnection.#client) {
            const user = config.mongodb.username;
            const pass = config.mongodb.password;
            const url = `mongodb+srv://${user}:${pass}@thien.om0cb.mongodb.net/?retryWrites=true&w=majority`;
            DatabaseConnection.#client = new MongoClient(url);
        }
        return DatabaseConnection.#client;
    }
}

module.exports = DatabaseConnection;