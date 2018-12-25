import { Message, PermissionResolvable } from "discord.js";
import Config from "../utility/Config";

export interface ICommandContext {
	message: Message;
	config: Config;
}

export interface ICommandOptions {
	name: string;
	description: string;
	usage: string;
	example: string;
	args: string[];
	defaultArgs: string[];
	expected: string[];
	clientPermissions: PermissionResolvable[];
	userPermissions: PermissionResolvable[];
	rolesNeeded: string[];
	userArgs: string[];
	ctx: ICommandContext;
	run: () => void;
}

export default class Command {
	name: string;
	description: string;
	usage: string;
	example: string;
	args: string[];
	defaultArgs: string[];
	expected: string[];
	clientPermissions: PermissionResolvable[];
	userPermissions: PermissionResolvable[];
	rolesNeeded: string[];
	userArgs: string[];
	ctx: ICommandContext;
	run: () => void;

	constructor(options: ICommandOptions) {
		this.name = options.name;
		this.description = options.description;
		this.usage = options.usage;
		this.example = options.example;
		this.args = options.args;
		this.defaultArgs = options.defaultArgs;
		this.expected = options.expected;
		this.clientPermissions = options.clientPermissions;
		this.userPermissions = options.userPermissions;
		this.rolesNeeded = options.rolesNeeded;
		this.run = options.run;
	}

	public setContext(ctx: ICommandContext) {
		this.ctx = ctx;
		return this;
	}

	public setUserArgs(args: string[]) {
		this.userArgs = args;
		return this;
	}

	public fillDefaults() {
		if (!this.defaultArgs.length) return this;

		this.userArgs = this.userArgs.map((_, index) => {
			return this.userArgs[index] || this.defaultArgs[index];
		});
		return this;
	}

	public checkPermissions() {
		return this.userPermissions.every(perm => {
			return this.ctx.message.member.permissions.has(perm);
		});
	}

	public checkBotPermissions() {
		return this.clientPermissions.every(perm => {
			return this.ctx.message.guild.me.permissions.has(perm);
		});
	}
}

/*


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
   
*/
