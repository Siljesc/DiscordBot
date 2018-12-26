import { Snowflake } from "discord.js";
import { ConfigModel }  from "../database/models/Config";

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
	private _ready = false;
	public id: Snowflake;

	constructor(id: Snowflake) {
		this.id = id;
		this._values = guildConfigValues;
	}

	async init(){
		if(this._ready) return;

		const dbConfig = await this.getDBValues();
		this._values = {...this._values, ...dbConfig};
		this._ready = true;
	}

	private async getDBValues(){
		const config = await ConfigModel.find({guild_id: this.id}).exec();
		if(!config) return;

		return config.reduce((accum: object, current) => {
			return {...accum, [current.id]: current.value};
		}, {})
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

	public fromID(guildID: Snowflake){
		if (!this.guilds[guildID]) this.guilds[guildID] = new GuildConfig(guildID);
		return this.guilds[guildID];
	}
}
