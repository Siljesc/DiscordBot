import { Snowflake } from "discord.js";

export interface IConfigMessages {
	InvalidCommandName: string;
	MissingUserPermissions: string;
	MissingClientPermissions: string;
	CommandHandlingError: string;
}

export interface IConfig {
	messages: {
		InvalidCommandName: "Invalid Command";
		MissingUserPermissions: "You don't have permissions for this";
		MissingClientPermissions: "Bot doesn't have permissions for this";
		CommandHandlingError: "This command is broken";
	};
	prefix: "!";
}

export class GuildConfig {
	InvalidCommandName: string;
	MissingUserPermissions: string;
	MissingClientPermissions: string;
	CommandHandlingError: string;

	constructor(guildID: Snowflake) {}
}

export default class Config {
	public guilds: {
		[guildID: string]: GuildConfig;
	} = {};

	byID(guildID: Snowflake) {
		if (!this.guilds[guildID]) this.guilds[guildID] = new GuildConfig(guildID);
		return this.guilds[guildID];
	}
}
