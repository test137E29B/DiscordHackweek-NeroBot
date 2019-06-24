import { Language, KlasaClient, LanguageStore } from 'klasa';

export default class extends Language {

	public constructor(client: KlasaClient, store: LanguageStore, file: string[], dir: string) {
		super(client, store, file, dir);
		this.language = {
			// Add Language keys in here with Portuguese translations
			TEST: 'Isto é um teste',
			ERR: '\\❌ **|** Aconteceu um erro, por favor tente novamente mais tarde\nSe o erro persistir, contate o suporte',

			// Kick
			COMMAND_KICK_DESCRIPTION: 'Expulsa um usuário',
			COMMAND_KICK_NOT: (user) => `\\❌ **|** Infelizmente, não posso expulsar \`${user.user.tag}\``,
			COMMAND_KICK_DONE: (user, reason) => `\\👢 **|** \`${user.user.tag}\` levou uma botada ${reason ? ` por \`${reason}\`` : ``}`,

			// BAN
			COMMAND_BAN_DESCRIPTION: 'Bane um usuário',
			COMMAND_BAN_NOT: (user) => `\\❌ **|** Infelizmente, não posso banir \`${user.user.tag}\``,
			COMMAND_BAN_DONE: (user, reason, days) => `\\🔨 **|** \`${user.user.tag}\` levou uma martelada${reason ? ` por \`${reason}\`` : ``}${days ? ` e suas mensagens ${days === 7 ? 'dos últimos 7 days' : 'das últimas 24 hours'} foram removidas` : ``}`

		};
	}

	public async init(): Promise<void> {
		await super.init();
	}

}
