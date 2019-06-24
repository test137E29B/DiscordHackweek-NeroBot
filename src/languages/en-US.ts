import { Language, KlasaClient, LanguageStore } from 'klasa';

export default class extends Language {

	public constructor(client: KlasaClient, store: LanguageStore, file: string[], dir: string) {
		super(client, store, file, dir);
		this.language = {
			// Add Language keys in here
			TEST: "This is a test"
		};
	}

	public async init(): Promise<void> {
		await super.init();
	}

}
