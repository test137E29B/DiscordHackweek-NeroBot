import { Event, EventStore, KlasaClient, Settings } from "klasa";
import {
  NeroGuildSchema,
  NeroThresholdModAction
} from "../lib/structures/schemas/guildSchema";
import { KlasaMember } from "klasa-member-gateway";
import { NeroMemberSchema } from "../lib/structures/schemas/memberSchema";

export default class extends Event {
  constructor(
    client: KlasaClient,
    store: EventStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir, {
      name: "punishOnWarn",
      enabled: true,
      event: "guildMemberWarnAdd",
      emitter: client,
      once: false
    });
  }

  async run(user: KlasaMember) {
    const { guild } = user;

    // @ts-ignore
    const guildConfig: Settings & NeroGuildSchema = guild.settings;
    // @ts-ignore
    const userConfig: Settings & NeroMemberSchema = user.settings;
    const warns = userConfig.get("warns.active");

    const {
      enabled,
      actions
    }: {
      enabled: boolean;
      actions: NeroThresholdModAction[];
    } = guildConfig.get("warns");

    if (!enabled || !actions || !actions.length || !warns || !warns.length)
      return;

    const action = actions
      .sort((a, b) => a.threshold - b.threshold)
      .filter(act => act.threshold === warns.length)
      .pop();

    if (!action) return;

    // @ts-ignore
    return this.client.funcs.punish({
      user,
      guild,
      action
    });
  }
}
