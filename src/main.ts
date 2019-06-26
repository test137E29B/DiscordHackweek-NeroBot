import { KlasaClient } from "klasa";

import { NeroClientOptions } from "./lib/structures/neroClient.schema";
import permissionLevels from "./lib/structures/PermissionLevels";
import { schema } from "./lib/structures/schemas/guildSchema";

import { config, token } from "../config";

// Plugins
import { Client as DashboardClient } from "klasa-dashboard-hooks";
import { Client as FunctionsClient } from "@kcp/functions";

class NeroClient extends KlasaClient {
  public owners: string[];

  public constructor(options: NeroClientOptions) {
    options.gateways.guilds.schema = schema;

    super({
      ...options,
      permissionLevels
    });

    this.owners = options.ownerIDs;
  }
}

NeroClient.use(DashboardClient);
NeroClient.use(FunctionsClient);

new NeroClient(config).login(token);
