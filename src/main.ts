import { KlasaClient } from "klasa";

import { NeroClientOptions } from "./lib/structures/neroClient.schema";
import permissionLevels from "./lib/structures/PermissionLevels";

// Schemas
import { schema as guildSchema } from "./lib/structures/schemas/guildSchema";
import { schema as memberSchema } from "./lib/structures/schemas/memberSchema";

// Config
import { config, token } from "../config";

// Plugins
import { Client as DashboardClient } from "klasa-dashboard-hooks";
import { Client as FunctionsClient } from "@kcp/functions";
import { Client as MemberGatewayClient } from "klasa-member-gateway";

class NeroClient extends KlasaClient {
  public owners: string[];

  public constructor(options: NeroClientOptions) {
    options.gateways.guilds.schema = guildSchema;
    options.gateways.members.schema = memberSchema;

    super({
      ...options,
      permissionLevels
    });

    this.owners = options.ownerIDs;
  }
}

NeroClient.use(DashboardClient);
NeroClient.use(FunctionsClient);
NeroClient.use(MemberGatewayClient);

new NeroClient(config).login(token);
