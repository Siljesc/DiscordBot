import { Guild, GuildMember, Snowflake } from "discord.js";
import { Guild as GuildModel } from "../database/models/Guild";
import { Member as MemberModel } from "../database/models/Member";
import Config from "./Config";

export async function setupGuildConfig(guildID: Snowflake, config: Config){
	const guildConfig = config.fromID(guildID);
	return guildConfig.init();
}

export async function setupGuildMember(member: GuildMember){
	const dbMember = new MemberModel();

	dbMember._id = member.id;
	dbMember.guild_id = member.guild.id;
	dbMember.roles = [];
	dbMember.created = new Date();

	return dbMember.save();
}

export async function setupGuild(guild: Guild, config: Config): Promise<void> {
	const dbGuild = (await GuildModel.findOne({_id: guild.id}).exec()) || new GuildModel();

	if(!dbGuild.created) {
		dbGuild._id = guild.id;
		dbGuild.created = new Date();

		await dbGuild.save();
	}

	//Setup Guild Members
	const dbMembers = await MemberModel.find({guild_id: guild.id}).exec();
	const dbMembersIDs = dbMembers.map((member) => member.id);

	const missingMembers = guild.members.filter((member) => {
		return !dbMembersIDs.includes(member.id)
	});

	await Promise.all(missingMembers.map(setupGuildMember));

	//Setup Guild Config
	return setupGuildConfig(guild.id, config);

}

export async function setupGuilds(guilds: Guild[], config: Config){
	return Promise.all(guilds.map((guild) => setupGuild(guild, config)));
}