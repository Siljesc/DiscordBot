import * as mongoose from "mongoose";

export function connect() {
	const [url, dbName] = ["DB_URL", "DB_NAME"].map(name => {
		const env = process.env[name];
		if (!env) throw new Error(`Missing ${name} environment variable`);
		return env;
	});

	return mongoose.connect(`${url}/${dbName}`, { useNewUrlParser: true });
}
