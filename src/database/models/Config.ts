import * as mongoose from "mongoose";
import { Snowflake } from "discord.js";
const Schema = mongoose.Schema;

const configSchema = new Schema({
	id: String,
	guild_id: String,
	value: mongoose.Schema.Types.Mixed
});

export const Config = mongoose.model("Config", configSchema);

configSchema.statics.getConfig = function(guildID: Snowflake, configKey: string): Promise<any> {
	return this.findOne({ guild_id: guildID, id: configKey }).exec();
};

configSchema.statics.updateConfig = function(guildID: Snowflake, configKey: string, configValue: any): Promise<void> {
	return this.updateOne({ guild_id: guildID, id: configKey }, { value: configValue }).exec();
};
