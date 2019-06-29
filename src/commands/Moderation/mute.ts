import { Command, CommandStore, KlasaMessage, KlasaClient } from "klasa";
import { GuildMember } from "discord.js";

export default class extends Command {
  public constructor(
    client: KlasaClient,
    store: CommandStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir, {
      requiredPermissions: ["MANAGE_ROLES", "EMBED_LINKS"],
      permissionLevel: 2,
      description: lang => lang.get("COMMAND_MUTE_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["shush", "stfu", "m"],
      usage: "<User:member> [Duration:duration] [Reason:...string]"
    });
  }

  public async run(
    msg: KlasaMessage,
    args: [GuildMember, Date, String]
  ): Promise<any> {
    const { flags } = msg;
    const [user, duration, reason] = args;

    if (!user.manageable) return msg.sendLocale("COMMAND_MUTE_NOT");

    const { settings } = msg.guild;

    // @ts-ignore
    const { muted } = settings.roles.punishments;

    if (!muted)
      return msg.sendLocale("ROLES_REQUIRED", ["muted", "mutedSetup"]);

    const silent: boolean = "silent" in flags || "s" in flags;

    // @ts-ignore
    return this.client.funcs
      .mute({
        user,
        guild: msg.guild,
        mod: msg.author,
        role: muted,
        duration,
        reason,
        silent
      })
      .then(() =>
        msg.sendLocale("COMMAND_MUTE_DONE", [
          user,
          reason,
          duration ? msg.args[1] : null
        ])
      )
      .catch(() => msg.sendLocale("ERR"));
  }
}
