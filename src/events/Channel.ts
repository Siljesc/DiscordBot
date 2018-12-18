import { Channel } from "discord.js";
import { IInstance } from "../handlers/Instance";

export function onChannelCreate(instance: IInstance, channel: Channel) {}

export function onChannelUpdate(instance: IInstance, oldChannel: Channel, newChannel: Channel) {}

export function onChannelDelete(instance: IInstance, channel: Channel) {}
