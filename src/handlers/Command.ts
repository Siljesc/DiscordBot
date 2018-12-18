import { Message, PermissionResolvable } from "discord.js";

import { Db } from "mongodb";

export interface ICommandContext {
	db: Db;
	message: Message;
	config: {};
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
	run: (ctx: ICommandContext, args: any[]) => void;
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
	run: (ctx: ICommandContext, args: any[]) => void;

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
}
