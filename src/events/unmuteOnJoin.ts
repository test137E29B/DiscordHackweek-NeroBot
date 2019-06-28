import { Event, KlasaClient, EventStore, Settings } from "klasa";
import { KlasaMember } from "klasa-member-gateway";
import { NeroGuildSchema } from "../lib/structures/schemas/guildSchema";

export default class extends Event {
  constructor(
    client: KlasaClient,
    store: EventStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir, {
      name: "unmuteOnJoin",
      enabled: true,
      event: "guildMemberAdd",
      emitter: client,
      once: false
    });
  }

  async run(member: KlasaMember) {
    const guildSett = (await member.guild.settings) as Settings &
      NeroGuildSchema;
    if (!guildSett.toUnmute.includes(member.id)) return;

    // @ts-ignore
    this.client.funcs.unmute({
      user: member,
      guild: member.guild,
      role: guildSett.roles.punishments.muted,
      keep: true,
      silent: true
    });
  }
}
