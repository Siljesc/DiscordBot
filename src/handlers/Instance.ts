import * as Discord from "discord.js";
import Database from "../database/Database";
import Config from "../utility/Config";
import { Db } from "mongodb";
import CommandHandler, { ICommandHandler } from "./CommandHandler";
import logger from "../utility/Logging";

export interface IInstance {
	client: Discord.Client;
	config: Config;
	db: Db;
	commandHandler: ICommandHandler;
	init: () => Promise<void>;
}

export default class Instance implements IInstance {
	public client: Discord.Client;
	private _config: Config;
	private _db: Db;
	private _commandHandler: ICommandHandler;

	constructor(token: string) {
		this.client = new Discord.Client();
		this.client.login(token);
	}

	public async init() {
		const database = new Database();
		this._db = await database.connect();

		logger.info("Connected to Database");

		this._config = new Config(this.db);
		this._commandHandler = new CommandHandler(this.db, this.config);
		await this._commandHandler.init();
	}

	get commandHandler() {
		return this._commandHandler;
	}

	get db() {
		return this._db;
	}

	get config() {
		return this._config;
	}
}
