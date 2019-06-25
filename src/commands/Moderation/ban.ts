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
      requiredPermissions: ["BAN_MEMBERS", "EMBED_LINKS"],
      permissionLevel: 4,
      description: lang => lang.get("COMMAND_BAN_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["bgone", "outtahere"],
      usage: "<User:member> [Reason:...string]"
    });
  }

  public async run(
    msg: KlasaMessage,
    args: [GuildMember, String]
  ): Promise<any> {
    const { flags } = msg;
    const [user, reason] = args;
    if (user.user.id === this.client.user.id)
      return msg.send(this.client.languages.get("en-US").get("COMPUTER_MAN"));
    if (!user.bannable) return msg.sendLocale("COMMAND_BAN_NOT", [user]);

    const days: number = "7d" in flags ? 7 : "1d" in flags ? 1 : 0;

    return user
      .ban({
        days,
        reason: `${msg.author.tag} - BAN${reason ? ` || ${reason}` : ``}`
      })
      .then(() => msg.sendLocale("COMMAND_BAN_DONE", [user, reason, days]))
      .catch(() => msg.sendLocale("ERR"));
  }
}
