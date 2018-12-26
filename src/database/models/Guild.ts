import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const guildSchema = new Schema({
	id: String,
	created: Date
});

export const Guild = mongoose.model("Guild", guildSchema);
