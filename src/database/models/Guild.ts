import * as mongoose from "mongoose";
import { Document } from "mongoose";
const Schema = mongoose.Schema;

interface IGuild {
	created: Date
}

export interface IGuildModel extends IGuild, Document {}

const guildSchema = new Schema({
	_id: String,
	created: Date
});

export const Guild = mongoose.model<IGuildModel>("Guild", guildSchema);
