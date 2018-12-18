import { Db } from "mongodb";
import Command from "./Command";
import { Message, PermissionResolvable } from "discord.js";
import { getCommands } from "../utility/Utils";
import * as Validator from "../utility/Validator";
import logger from "../utility/Logging";
import Config from "../utility/Config";

export interface ICommandHandler {
	db: Db;
	config: Config;
	commands: Command[];
	command: Command;
	message: Message;
	userArgs: string[];
	parsedArgs: string[];
	parse: (message: Message) => Promise<Message | Message[]> | undefined;
	init: () => Promise<void>;
}

export default class CommandHandler {
	db: Db;
	config: Config;
	commands: Command[];
	command: Command;
	message: Message;
	userArgs: string[];
	parsedArgs: string[];

	constructor(db: Db, config: any) {
		this.db = db;
		this.config = config;
	}

	async init() {
		const commands = await getCommands();
		this.commands = commands;

		logger.info(`Bot is Ready. Loaded ${commands.length} Commands`);

		return;
	}

	public parse(message: Message) {
		this.message = message;

		const withoutPrefix = message.content.slice(this.config.values.prefix.length);
		const [cmdName, ...cmdArgs] = withoutPrefix.split(" ");

		const foundCommand = this.commands.find(cmd => {
			return cmdName.toLowerCase() === cmd.name;
		});

		if (!foundCommand) {
			return message.channel.send(this.config.values.messages.InvalidCommandName);
		}

		this.command = foundCommand;
		this.userArgs = cmdArgs;

		// Check if we need to use default args
		if (this.command.defaultArgs) this.fillDefaults();

		// Check permissions
		if (!this.checkPermissions(this.command.userPermissions)) {
			return message.channel.send(this.config.values.messages.MissingUserPermissions);
		}

		if (!this.checkPermissions(this.command.clientPermissions)) {
			return message.channel.send(this.config.values.messages.MissingClientPermissions);
		}

		// Validate arguments and replace values
		if (this.command.expected && !this.validate()) return;

		const ctx = {
			db: this.db,
			message: this.message,
			config: this.config
		};

		this.command.run(ctx, this.userArgs);
	}

	private fillDefaults() {
		this.userArgs = this.userArgs.map((_, index) => {
			return this.userArgs[index] || this.command.defaultArgs[index];
		});
	}

	private checkPermissions(permissionList: PermissionResolvable[]) {
		return permissionList.every(perm => {
			return this.message.member.permissions.has(perm);
		});
	}

	private validate() {
		const errors: string[] = [];
		const devErrors: string[] = [];

		//sorry for the side effect
		const invalid = this.command.expected.filter((expect, index) => {
			const validator = Validator.default[expect];
			const value = this.userArgs[index];

			if (!validator) {
				devErrors.push(`${expect} is not valid`);
				return true;
			}

			const { isValid, invalidMessage, normalizedValue } = validator(value, this.message);

			if (!isValid) {
				errors.push(`Invalid Argument [${this.command.args[index]}]: ${invalidMessage}`);
				return true;
			}

			this.userArgs[index] = normalizedValue || value;
			return false;
		});

		if (!invalid.length) return true;

		const errorMessage = errors.join("\n");
		const devErrorMessage = errors.join("\n");

		if (errorMessage.length > 0) this.message.channel.send(errorMessage);

		if (devErrorMessage.length > 0) {
			this.message.channel.send(this.config.values.messages.CommandHandlingError);
			logger.error(devErrorMessage);
		}
	}
}
