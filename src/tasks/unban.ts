import { Task, KlasaClient, TaskStore } from "klasa";

export default class extends Task {
  constructor(
    client: KlasaClient,
    store: TaskStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir, {
      name: "unban"
    });
  }

  async run({
    userId,
    guildId,
    modId,
    reason,
    silent
  }: {
    userId: string;
    guildId: string;
    modId?: string;
    reason?: string;
    silent: boolean;
  }) {
    const guild = this.client.guilds.get(guildId);

    if (!guild) return;

    const bans = await guild.fetchBans();
    const ban = bans.find(ban => ban.user.id === userId);

    if (!ban) return;
    const mod = this.client.users.get(modId);

    // @ts-ignore
    this.client.funcs.unban({
      user: userId,
      guild,
      mod,
      reason,
      silent
    });
    // The code that will receive the metadata from the task
  }
}
