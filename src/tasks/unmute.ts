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

  async run({ userId, guildId, modId, reason }) {
    /* const guild = this.client.guilds.get(guildId);

    if (!guild) return;

    const stillBanned = await guild
      .fetchBans()
      .then(bans => bans.some(ban => ban.user.id === userId));

    if (!stillBanned) return;

    const mod = guild.members.get(modId) || { user: { tag: "Not Found" } };

    guild.members
      .unban(
        userId,
        `${mod.user.tag} - ${type}${reason ? ` || ${reason}` : ``}`
      )
      .then(user =>
        this.client.emit("modlog", { user, guild, mod, reason, type: "UNBAN" })
      )
      .catch(() => {});
    // The code that will receive the metadata from the task */
  }
}
