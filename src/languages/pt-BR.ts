import { Language, KlasaClient, LanguageStore } from 'klasa';

export default class extends Language {

	public constructor(client: KlasaClient, store: LanguageStore, file: string[], dir: string) {
		super(client, store, file, dir);
		this.language = {
			// Add Language keys in here with Portuguese translations
			TEST: "This is a test but in portuguese"
		};
	}

	public async init(): Promise<void> {
		await super.init();
	}

}
