import { Snowflake } from "discord.js";

export interface IConfigMessages {
	InvalidCommandName: string;
	MissingUserPermissions: string;
	MissingClientPermissions: string;
	CommandHandlingError: string;
}

export interface IConfig {
	messages: IConfigMessages
	prefix: string
}

export const guildConfigValues : IConfig = {
	messages: {
		InvalidCommandName: "Invalid Command",
		MissingUserPermissions: "You don't have permissions for this",
		MissingClientPermissions: "Bot doesn't have permissions for this",
		CommandHandlingError: "This command is broken",
	},
	prefix: "!"
};

export class GuildConfig {
	private _values: IConfig;
	public id: Snowflake;

	constructor(id: Snowflake) {
		this.id = id;
		this._values = guildConfigValues;
	}

	get values(){
		return this._values;
	}

	set values(newValue){
		this._values = newValue;
	}
}

export default class Config {
	public guilds: {
		[guildID: string]: GuildConfig;
	} = {};

	fromID(guildID: Snowflake){
		if (!this.guilds[guildID]) this.guilds[guildID] = new GuildConfig(guildID);
		return this.guilds[guildID];
	}
}
