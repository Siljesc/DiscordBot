import * as mongoose from "mongoose";
import { Snowflake } from "discord.js";
const Schema = mongoose.Schema;

const memberSchema = new Schema({
	id: String,
	guild_id: String,
	roles: [String],
	created: Date
});

export const Member = mongoose.model("Member", memberSchema);

memberSchema.statics.getMember = function(guildID: Snowflake, userID: Snowflake): Promise<any> {
	return this.findOne({ guild_id: guildID, id: userID }).exec();
};
