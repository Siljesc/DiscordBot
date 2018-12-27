import Command from "../../handlers/Command";

async function reply(){
	this.ctx.message.channel.send("Worked");
}

export default new Command({
	name: "testvalid",
	description: "Get bot's delay",
	usage: "",
	example: "",
	args: ["Number", "Snowflake", "User"],
	defaultArgs: [],
	expected: ["Number", "Snowflake", "User"],
	clientPermissions: [],
	userPermissions: [],
	rolesNeeded: [],
	run: reply
});
