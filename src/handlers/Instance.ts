import * as Discord from "discord.js";
import CommandHandler, { ICommandHandler } from "./CommandHandler";
import logger from "../utility/Logging";
import { connect } from "../database/Database";
import Config from "../utility/Config";

export interface IInstance {
	client: Discord.Client;
	commandHandler: ICommandHandler;
	config: Config;
	init: () => Promise<void>;
}

export default class Instance implements IInstance {
	public client: Discord.Client;
	public config: Config;
	private _commandHandler: ICommandHandler;

	constructor(token: string) {
		this.client = new Discord.Client();
		this.config = new Config();
		this.client.login(token);
	}

	public async init() {
		logger.info("Connected to Database");

		try {
			await connect();
		} catch (err) {
			throw new Error(`Couldn't connect to Databae. Error: ${err}`);
		}

		this._commandHandler = new CommandHandler();
		await this._commandHandler.init();
	}

	get commandHandler() {
		return this._commandHandler;
	}
}
