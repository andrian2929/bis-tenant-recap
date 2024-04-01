import mysql from "mysql2/promise";
import {MysqlConfig} from "./types";

export default class MySql {
    private readonly mysqlHost: string | undefined;
    private readonly mysqlUser: string | undefined;
    private readonly mysqlPassword: string | undefined;
    private readonly mysqlDatabase: string | undefined;
    private readonly mysqlPort: number | undefined;
    private connection?: mysql.Connection;

    constructor(config: MysqlConfig) {
        const {
            host, user, password, database, port
        } = config;
        this.mysqlHost = host;
        this.mysqlPort = port;
        this.mysqlUser = user;
        this.mysqlPassword = password;
        this.mysqlDatabase = database;
    }

    public async connect() {
        if (!this.connection) {
            this.connection = await mysql.createConnection({
                host: this.mysqlHost,
                port: this.mysqlPort,
                user: this.mysqlUser,
                password: this.mysqlPassword,
                database: this.mysqlDatabase
            });
        }
    }

    public async disconnect() {
        if (this.connection) {
            await this.connection.end();
            this.connection = undefined;
        }
    }

    public async query(query: string, values?: any[]) {
        try {
            await this.connect();
            const [results] = await this.connection!.query(query, values);
            return results;
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        } finally {
            await this.disconnect();
        }
    }
}