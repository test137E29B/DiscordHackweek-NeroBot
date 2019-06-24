import { KlasaClientOptions } from 'klasa';

export interface NeroClientOptions extends Omit<KlasaClientOptions, 'ownerID'> {
	ownerIDs: Array<string>;
}