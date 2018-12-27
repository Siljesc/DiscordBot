import Command from "./Command";
import { Message } from "discord.js";
import { getCommands } from "../utility/Utils";
import logger from "../utility/Logging";
import Config from "../utility/Config";

export interface ICommandHandler {
	commands: Command[];
	command: Command;
	message: Message;
	parse: (message: Message, config: Config) => void;
	init: () => Promise<void>;
}

export default class CommandHandler {
	commands: Command[];
	command: Command;
	message: Message;

	public async init() {
		const commands = await getCommands();
		this.commands = commands;

		logger.info(`Bot is Ready. Loaded ${commands.length} Commands`);

		return;
	}

	public parse(message: Message, config: Config) {
		this.message = message;

		const guildConfig = config.fromID(message.guild.id);
		const ctx = { message, config: guildConfig };

		const withoutPrefix = message.content.slice(guildConfig.values.prefix.length);
		const [cmdName, ...cmdArgs] = withoutPrefix.split(" ");

		const foundCommand = this.commands.find(cmd => {
			return cmdName.toLowerCase() === cmd.name;
		});

		if (!foundCommand) {
			message.channel.send(guildConfig.values.messages.InvalidCommandName);
			return;
		}

		this.command = foundCommand;
		this.command
			.setContext(ctx)
			.setUserArgs(cmdArgs)
			.fillDefaults();

		// Check we got all arguments
		const filledArguments = this.command.userArgs.filter((arg) => arg  !== undefined);

		if (filledArguments.length < this.command.args.length){
			message.channel.send(`Missing arguments. Expected ${this.command.args.length} but got ${filledArguments.length}`);
			return;
		}

		// Check permissions
		if (!this.command.checkPermissions()) {
			message.channel.send(guildConfig.values.messages.MissingUserPermissions);
			return;
		}

		if (!this.command.checkBotPermissions()) {
			message.channel.send(guildConfig.values.messages.MissingClientPermissions);
			return;
		}

		// Valid arguments

		const validations = this.command.getArgumentsValidations();
		const invalidArguments = validations.filter(({isValid}) => !isValid);

		if(invalidArguments.length){
			const errorMessage = invalidArguments
				.map(({error}) => error)
				.join("\n");

			message.channel.send(errorMessage);
			return;
		}

		//Replace arguments with their "real" value;
		this.command.userArgs.map((_, index) => {
			return validations[index].evaluated;
		});

		this.command.run();
	}
}
