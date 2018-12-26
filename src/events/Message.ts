import { IInstance } from "../handlers/Instance";
import { Message } from "discord.js";

export function onMessage(instance: IInstance, message: Message) {
	if (message.author.bot) return;
	if (!message.content.startsWith(instance.config.fromID(message.guild.id).values.prefix)) return;

	instance.commandHandler.parse(message, instance.config);
}

export function onMessageUpdate(instance: IInstance, message: Message) {}
