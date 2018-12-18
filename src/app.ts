import Instance from "./handlers/Instance";
import * as dotenv from "dotenv";

import * as messageEvent from "./events/Message";
import * as channelEvent from "./events/Channel";
import * as guildEvent from "./events/Guild";
import * as clientEvent from "./events/Client";

dotenv.config();

const DISCORD_TOKEN = process.env["DISCORD_TOKEN"];
if (!DISCORD_TOKEN) throw new Error("Couldn't find Discord token.");

(() => {
	const instance = new Instance(DISCORD_TOKEN);

	//Channel Events
	instance.client.on("channelCreate", channel => {
		channelEvent.onChannelCreate(instance, channel);
	});

	instance.client.on("channelDelete", channel => {
		channelEvent.onChannelDelete(instance, channel);
	});

	instance.client.on("channelUpdate", (oldChannel, newChannel) => {
		channelEvent.onChannelUpdate(instance, oldChannel, newChannel);
	});

	//Guild Events

	instance.client.on("guildCreate", guild => {
		guildEvent.onGuildCreate(instance, guild);
	});

	instance.client.on("guildDelete", guild => {
		guildEvent.onGuildDelete(instance, guild);
	});

	instance.client.on("guildUpdate", (oldGuild, newGuild) => {
		guildEvent.onGuildUpdate(instance, oldGuild, newGuild);
	});

	instance.client.on("guildMemberAdd", member => {
		guildEvent.onGuildMemberAdd(instance, member);
	});

	instance.client.on("guildMemberRemove", member => {
		guildEvent.onGuildMemberRemove(instance, member);
	});

	instance.client.on("guildMemberUpdate", (oldMember, newMember) => {
		guildEvent.onGuildMemberUpdate(instance, oldMember, newMember);
	});

	// Message Events

	instance.client.on("message", message => {
		messageEvent.onMessage(instance, message);
	});

	// instance.client.on('messageUpdate', (oldMessage, newMessage) => {
	//    messageEvent.onMesageUpdate(instance, oldMessage, newMessage);
	// });

	// Client Events

	instance.client.on("ready", () => {
		clientEvent.onReady(instance);
	});
})();
