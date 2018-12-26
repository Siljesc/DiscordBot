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
	public token: string;
	private _commandHandler: ICommandHandler;

	constructor(token: string) {
		this.client = new Discord.Client();
		this.config = new Config();
		this.token = token;
	}

	public async init() {
		await this.client.login(this.token);

		logger.info("Connected to Discord");

		try {
			await connect();
		} catch (err) {
			throw new Error(`Couldn't connect to Database. Error: ${err}`);
		}

		logger.info("Connected to Database");

		this._commandHandler = new CommandHandler();
		await this._commandHandler.init();
	}

	get commandHandler() {
		return this._commandHandler;
	}
}
