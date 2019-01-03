import Command from "../../handlers/Command";

async function getPing() {
	const dateNow = Date.now();
	const messageDate = this.ctx.message.createdAt.getTime();
	const difference = dateNow - messageDate;

	await this.ctx.message.channel.send(`${difference}ms`);
}

export default new Command({
	name: "ping",
	description: "Get bot's delay",
	usage: "",
	example: "",
	args: [],
	defaultArgs: [],
	expected: [],
	clientPermissions: [],
	userPermissions: [],
	rolesNeeded: [],
	type: "utility",
	run: getPing
});
