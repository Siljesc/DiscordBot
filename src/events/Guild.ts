import { IInstance } from "../handlers/Instance";
import { Guild, GuildMember } from "discord.js";

export function onGuildCreate(instance: IInstance, guild: Guild) {}

export function onGuildUpdate(instance: IInstance, oldGuild: Guild, newGuild: Guild) {}

export function onGuildDelete(instance: IInstance, guild: Guild) {}

export function onGuildMemberAdd(instance: IInstance, member: GuildMember) {}

export function onGuildMemberRemove(instance: IInstance, member: GuildMember) {}

export function onGuildMemberUpdate(instance: IInstance, oldMember: GuildMember, newMember: GuildMember) {}
