import * as mongoose from "mongoose";
import { Snowflake } from "discord.js";
import { Document } from "mongoose";
const Schema = mongoose.Schema;

interface IConfig {
	guild_id: Snowflake,
	value: any
}

interface IConfigModel extends IConfig, Document {}

const configSchema = new Schema({
	_id: String,
	guild_id: String,
	value: mongoose.Schema.Types.Mixed
});

export const ConfigModel = mongoose.model<IConfigModel>("Config", configSchema);

configSchema.statics.getConfig = function(guildID: Snowflake, configKey: string): Promise<any> {
	return this.findOne({ guild_id: guildID, id: configKey }).exec();
};

configSchema.statics.updateConfig = function(guildID: Snowflake, configKey: string, configValue: any): Promise<void> {
	return this.updateOne({ guild_id: guildID, id: configKey }, { value: configValue }).exec();
};
