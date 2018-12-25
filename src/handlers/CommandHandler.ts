import Command from "./Command";
import { Message } from "discord.js";
import { getCommands } from "../utility/Utils";
import logger from "../utility/Logging";
import Config from "../utility/Config";

export interface ICommandHandler {
	commands: Command[];
	command: Command;
	message: Message;
	userArgs: string[];
	parsedArgs: string[];
	parse: (message: Message, config: Config) => void;
	init: () => Promise<void>;
}

export default class CommandHandler {
	commands: Command[];
	command: Command;
	message: Message;
	userArgs: string[];
	parsedArgs: string[];

	async init() {
		const commands = await getCommands();
		this.commands = commands;

		logger.info(`Bot is Ready. Loaded ${commands.length} Commands`);

		return;
	}

	public parse(message: Message, config: Config) {
		this.message = message;

		const guildConfig = config.byID(message.guild.id);
		const ctx = { message, config: guildConfig };

		const withoutPrefix = message.content.slice(guildConfig.prefix.length);
		const [cmdName, ...cmdArgs] = withoutPrefix.split(" ");

		const foundCommand = this.commands.find(cmd => {
			return cmdName.toLowerCase() === cmd.name;
		});

		if (!foundCommand) {
			message.channel.send(guildConfig.messages.InvalidCommandName);
			return;
		}

		this.command = foundCommand;
		this.command
			.setContext(ctx)
			.setUserArgs(cmdArgs)
			.fillDefaults();

		// Check permissions
		if (!this.command.checkPermissions()) {
			message.channel.send(guildConfig.messages.MissingUserPermissions);
			return;
		}

		if (!this.command.checkBotPermissions()) {
			message.channel.send(guildConfig.values.messages.MissingClientPermissions);
			return;
		}

		this.command.run();
	}
}
