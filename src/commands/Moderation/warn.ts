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
      description: lang => lang.get("COMMAND_WARN_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["w"],
      usage: "<User:member> <Reason:...string>"
    });
  }

  public async run(
    msg: KlasaMessage,
    args: [GuildMember, String]
  ): Promise<any> {
    const { flags } = msg;
    const [user, reason] = args;

    if (user.id === this.client.user.id)
      return msg.send(this.client.languages.get("en-US").get("COMPUTER_MAN"));
    if (!msg.guild.settings.get("warns.enabled"))
      return msg.sendLocale("WARNS_DISABLED");

    const silent: boolean = "silent" in flags || "s" in flags;

    // @ts-ignore
    return this.client.funcs
      .warn({
        user,
        guild: msg.guild,
        mod: msg.author,
        reason,
        silent
      })
      .then(() => msg.sendLocale("COMMAND_WARN_DONE", [user, reason]))
      .catch(() => msg.sendLocale("ERR"));
  }
}
