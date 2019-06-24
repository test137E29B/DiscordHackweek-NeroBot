import { KlasaClient } from 'klasa';
import { NeroClientOptions } from './lib/structures/neroClient.schema'
import permissionLevels from './lib/structures/PermissionLevels'
import { config, token } from '../config';

class NeroClient extends KlasaClient {

	public owners: Array<string>;

	constructor(options: NeroClientOptions) {
		// @ts-ignore
		super({
			...options,
			permissionLevels
		});

		this.owners = options.ownerIDs
		// Add any properties to your Klasa Client
	}*/

	// Add any methods to your Klasa Client

}

new NeroClient(config).login(token);
