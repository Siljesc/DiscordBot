import { Message, PermissionResolvable } from "discord.js";
import { GuildConfig } from "../utility/Config";
import validators from "../utility/Validation";

export interface ICommandContext {
	message: Message;
	config: GuildConfig;
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
	run: () => Promise<void>;
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
	run: () => Promise<void>;

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

		this.userArgs = this.args.map((_, index) => {
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

	public getArgumentsValidations(){
		return this.expected.map((name, index) => {

			const value = this.userArgs[index];

			if(!name){
				return {
					isValid: true,
					evaluated: value,
					error: null
				}
			}

			return validators[name](value, this.ctx);
		});
	}
}