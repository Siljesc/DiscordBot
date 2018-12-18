import Command, { ICommandContext } from "../../handlers/Command";

async function getPing(ctx: ICommandContext) {
	const dateNow = Date.now();
	const messageDate = ctx.message.createdAt.getTime();
	const difference = dateNow - messageDate;

	ctx.message.channel.send(`${difference}ms`);
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
	run: getPing
});
