import { KlasaClientOptions } from "klasa";

export interface NeroClientOptions extends Omit<KlasaClientOptions, "ownerID"> {
  ownerIDs: string[];
  aliasFunctions: {
    prefix: string;
    enabled: boolean;
    returnMethod: string;
  };
}
