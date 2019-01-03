import Command, { ICommandContext } from "../../handlers/Command";
import { RichEmbed } from "discord.js";
import { capitalize } from "../../utility/Utils";

interface CommandGroup {
	[key: string]: string[]
}

function commandList(commands: Command[]){

	const availableCommands = commands.filter(command => command.checkPermissions());

	const groupedByType : CommandGroup = availableCommands.reduce((accum: CommandGroup, cmd) => {
		accum[cmd.type] = accum[cmd.type] ? accum[cmd.type].concat(cmd.name) : [cmd.name];
		return accum;
	}, {});

	const embed = new RichEmbed().setTitle(`Available Commands`).setColor(0xff0000);

	for (const [type, commands] of Object.entries(groupedByType)) {
		embed.addField(capitalize(type), commands.join(", "));
	}

	return embed;
}

function commandInfo(ctx: ICommandContext, commandName: string){
	const command = ctx.commands.find((_command) => {
		return _command.name.toLowerCase() === commandName.toLowerCase();
	});

	if (!command) return ctx.message.channel.send(`${commandName} is not a command.`);

	if (!command.checkPermissions()) {
		return ctx.message.channel.send(`You don't have permissions for this command`);
	}

	const prefix = ctx.config.values.prefix;

	return new RichEmbed()
		.setTitle(`${capitalize(commandName)}`)
		.setColor(0xff0000)
		.addField("Description", command.description)
		.addField("Usage", `${prefix}${commandName} ${command.usage}`)
		.addField("Example", `${prefix}${commandName} ${command.example}`);
}


async function getHelp() {

	const [command] = this.userArgs;

	if(command === "all") await this.ctx.message.channel.send(commandList(this.ctx.commands));
	else await this.ctx.message.channel.send(commandInfo(this.ctx, command));

}

export default new Command({
	name: "help",
	description: "Get available commands or specific command help",
	usage: "[command]. Leave empty for available commands",
	example: "",
	args: ["command"],
	defaultArgs: ["all"],
	expected: ["string"],
	clientPermissions: [],
	userPermissions: [],
	rolesNeeded: [],
	type: "utility",
	run: getHelp
});
