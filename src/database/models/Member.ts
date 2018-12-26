import * as mongoose from "mongoose";
import { Snowflake } from "discord.js";
import { Document } from "mongoose";
const Schema = mongoose.Schema;

interface IMember {
	guild_id: string
	roles: string[]
	created: Date
}

export interface IMemberModel extends IMember, Document {}

const memberSchema = new Schema({
	_id: String,
	guild_id: String,
	roles: [String],
	created: Date
});

export const Member = mongoose.model<IMemberModel>("Member", memberSchema);

memberSchema.statics.getMember = function(guildID: Snowflake, userID: Snowflake): Promise<any> {
	return this.findOne({ guild_id: guildID, id: userID }).exec();
};
