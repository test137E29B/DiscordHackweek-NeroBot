import { Event, KlasaClient, EventStore, Settings } from "klasa";
import { KlasaMember } from "klasa-member-gateway";
import { NeroGuildSchema } from "../lib/structures/schemas/guildSchema";
import { NeroMemberSchema } from "../lib/structures/schemas/memberSchema";

export default class extends Event {
  constructor(
    client: KlasaClient,
    store: EventStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir, {
      name: "muteOnJoin",
      enabled: true,
      event: "guildMemberAdd",
      emitter: client,
      once: false
    });
  }

  async run(member: KlasaMember) {
    const guildSett = (await member.guild.settings) as Settings &
      NeroGuildSchema;
    if (guildSett.toUnmute.includes(member.id)) return;

    await member.settings.sync(true);
    // @ts-ignore
    const sett = (await member.settings) as Settings & NeroMemberSchema;

    if (sett && sett.get("muted"))
      // @ts-ignore
      this.client.funcs.mute({
        user: member,
        guild: member.guild,
        role: guildSett.roles.punishments.muted,
        keep: true,
        silent: true
      });
  }
}
