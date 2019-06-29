import { NeroGuildSettingsOnly } from "../lib/structures/schemas/guildSchema";
import {
  Route,
  KlasaIncomingMessage,
  DashboardClient,
  RouteStore
} from "klasa-dashboard-hooks";
import { ServerResponse } from "http";
import { isString } from "util";
import { Settings } from "klasa";

interface GuildSettingsGet {
  id: string;
}

// interface GuildSettingsUpdates extends Partial<NeroGuildSchema> {}

const isGuildSettingsGet = (arg: any): arg is GuildSettingsGet => {
  return isString(arg.id);
};

module.exports = class extends Route {
  constructor(
    client: DashboardClient,
    store: RouteStore,
    file: string[],
    directory: string
  ) {
    super(client, store, file, directory, {
      route: "guild/settings/:id",
      authenticated: true
    });
  }

  get(request: KlasaIncomingMessage, response: ServerResponse) {
    if (!isGuildSettingsGet(request.params)) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({ success: false, data: null, error: "Bad Request" })
      );
    }

    // Get Settings
    const req = request.params;
    const set = this.client.gateways.guilds.get(req.id);
    if (!set) {
      response.statusCode = 404;
      return response.end(
        JSON.stringify({ success: false, data: null, error: "Not Found" })
      );
    }
    const s = set as Settings & NeroGuildSettingsOnly;
    const settings: NeroGuildSettingsOnly = s; // Strip all other stuff out
    response.statusCode = 200;
    return response.end(
      JSON.stringify({ success: true, data: settings, error: null })
    );
  }

  patch(request: KlasaIncomingMessage, response: ServerResponse) {
    if (!isGuildSettingsGet(request.params)) {
      response.statusCode = 400;
      return response.end(
        JSON.stringify({ success: false, error: "Bad Request" })
      );
    }

    const req = request.params;
    const set = this.client.gateways.guilds.get(req.id);
    if (!set) {
      response.statusCode = 404;
      return response.end(
        JSON.stringify({ success: false, error: "Not Found" })
      );
    }

    let data = "";
    request.on("data", chunk => (data += chunk));
    request.on("end", () => {
      try {
        const newSettings = JSON.parse(data);
        set.update(newSettings, { action: "overwrite" });
      } catch (err) {
        response.statusCode = 503;
        return response.end(
          JSON.stringify({ success: false, error: "Internal Server Error" })
        );
      }

      response.statusCode = 200;
      return response.end(JSON.stringify({ success: true, error: null }));
    });
  }
};
