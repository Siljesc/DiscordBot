import { MongoClient, Db } from "mongodb";

export interface IDatabase {
	url: string;
	dbName: string;
	client: MongoClient;
	conn: Db;
}

export default class Database {
	url: string;
	dbName: string;
	client: MongoClient;
	conn: Db;

	constructor() {
		const [url, dbName] = ["DB_URL", "DB_NAME"].map(name => {
			const env = process.env[name];
			if (!env) throw new Error(`Missing ${name} enviroment variable`);
			return env;
		});

		this.client = new MongoClient(url, { useNewUrlParser: true });
		this.dbName = dbName;
	}

	public connect(): Promise<Db> {
		return new Promise((resolve, reject) => {
			this.client.connect(err => {
				if (err) return reject(err);

				const dbInstance = this.client.db(this.dbName);
				if (!dbInstance) return reject(new Error(`Couldn't create db instance ${this.dbName}`));

				resolve(dbInstance);
			});
		});
	}
}
