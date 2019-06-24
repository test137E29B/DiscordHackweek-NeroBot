import { Command, CommandStore, KlasaMessage, KlasaClient } from 'klasa';

export default class extends Command {

	constructor(client: KlasaClient, store: CommandStore, file: string[], dir: string) {
		super(client, store, file, dir, {
			requiredPermissions: ['KICK_MEMBERS', 'EMBED_LINKS'],
			permissionLevel: 3,
			description: (lang) => lang.get('COMMAND_KICK_DESCRIPTION'),
			runIn: ['text'],
			aliases: ['bgone', 'outtahere'],
			usage: '<User:member> [Reason:...string]'
		});
	}

	async run(msg: KlasaMessage, args) {
		const [user, reason] = args;
		if (!user.kickable) return msg.sendLocale('COMMAND_KICK_NOT', [user]);

		return user.kick(`${msg.author.tag}${reason ? ` || ${reason}` : ``}`)
			.then(() => msg.sendLocale('COMMAND_KICK_DONE', [user, reason]))
			.catch(() => msg.sendLocale('ERR'));
	}

}
