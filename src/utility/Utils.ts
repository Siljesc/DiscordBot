import { Message, Snowflake } from "discord.js";
import Command from "../handlers/Command";
import { promisify } from "util";
import * as glob from "glob";

export function capitalize(str: string){
	return str[0].toUpperCase() + str.slice(1);
}

export function getUserMention(message: Message) {
	return message.mentions.members.first();
}

export function getUserByID(message: Message, id: Snowflake) {
	return message.guild.members.find(member => {
		return member.id === id;
	});
}

export async function getCommands(): Promise<Command[]> {
	const commands = await promisify(glob)("dist/commands/**/*.js");

	return commands.map(command => require("../../" + command).default);
}