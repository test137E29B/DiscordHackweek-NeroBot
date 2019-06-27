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
      usage: "<User:member|ID:regex/^(\\d{17,19})$/> [Reason:...string]"
    });
  }

  public async run(
    msg: KlasaMessage,
    args: [GuildMember | string, string]
  ): Promise<any> {
    const { flags } = msg;
    const [user, reason] = args;

    if ((user instanceof GuildMember ? user.id : user) === this.client.user.id)
      return msg.send(this.client.languages.get("en-US").get("COMPUTER_MAN"));
    if (user instanceof GuildMember && !user.bannable)
      return msg.sendLocale("COMMAND_BAN_NOT", [user]);

    const days: number = "7d" in flags ? 7 : "1d" in flags ? 1 : 0;
    const silent: boolean = "silent" in flags || "s" in flags;

    // @ts-ignore
    return this.client.funcs
      .ban({
        user,
        guild: msg.guild,
        mod: msg.author,
        reason,
        delMsgs: days,
        silent
      })
      .then(() =>
        msg.sendLocale("COMMAND_BAN_DONE", [
          user instanceof GuildMember ? user.user.tag : user,
          reason,
          days
        ])
      )
      .catch(() => msg.sendLocale("ERR"));
  }
}
