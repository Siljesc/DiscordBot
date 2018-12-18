import { Db } from "mongodb";

export interface IConfigMessages {
	InvalidCommandName: string;
	MissingUserPermissions: string;
	MissingClientPermissions: string;
	CommandHandlingError: string;
}

export default class Config {
	public db: Db;
	private _values: {
		messages: IConfigMessages;
		prefix: string;
	};

	constructor(db: Db) {
		this.db = db;

		this._values = {
			messages: {
				InvalidCommandName: "Invalid Command",
				MissingUserPermissions: "You don't have permissions for this",
				MissingClientPermissions: "Bot doesn't have permissions for this",
				CommandHandlingError: "This command is broken"
			},
			prefix: "!"
		};
	}

	get values() {
		return this._values;
	}

	set values(newValue) {
		this._values = newValue;
	}
}
