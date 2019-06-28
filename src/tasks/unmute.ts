import { Task, KlasaClient, TaskStore } from "klasa";

export default class extends Task {
  constructor(
    client: KlasaClient,
    store: TaskStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir, {
      name: "unmute"
    });
  }

  async run({ userId, guildId, modId, silent }) {
    const guild = this.client.guilds.get(guildId);
    if (!guild) return;

    // @ts-ignore
    const role = guild.settings.roles.punishments.muted;

    // @ts-ignore
    const userSettings = await this.client.gateways.members.get(
      `${guildId}.${userId}`
    );

    if (!role || !userSettings) {
      await guild.settings.update("toUnmute", userId, { action: "add" });
      return;
    }

    // @ts-ignore
    const stillMuted = userSettings.muted;
    if (!stillMuted) return;

    const mod = this.client.users.get(modId);
    const user = guild.members.get(userId);

    // @ts-ignore
    this.client.funcs.unmute({
      user: user || userId,
      guild,
      mod,
      role,
      silent
    });
  }
}
