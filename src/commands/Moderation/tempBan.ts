import { Command, CommandStore, KlasaMessage, KlasaClient } from "klasa";
import { GuildMember } from "discord.js";

export default class extends Command {
  constructor(
    client: KlasaClient,
    store: CommandStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir, {
      requiredPermissions: ["BAN_MEMBERS", "EMBED_LINKS"],
      permissionLevel: 4,
      description: lang => lang.get("COMMAND_TEMPBAN_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["temp", "tempb"],
      usage:
        "<User:member|ID:regex/^(\\d{17,19})$/> <Duration:duration> [Reason:...string]"
    });
  }

  async run(msg: KlasaMessage, args: [GuildMember, any, String]) {
    const { flags } = msg;
    const [user, duration, reason] = args;

    if ((user instanceof GuildMember ? user.id : user) === this.client.user.id)
      return msg.send(this.client.languages.get("en-US").get("COMPUTER_MAN"));
    if (!user.bannable) return msg.sendLocale("COMMAND_TEMPBAN_NOT", [user]);

    const days: number = "7d" in flags ? 7 : "1d" in flags ? 1 : 0;
    const silent: boolean = "silent" in flags || "s" in flags;

    // @ts-ignore
    return this.client.funcs
      .tempBan({
        user,
        guild: msg.guild,
        mod: msg.author,
        reason,
        duration,
        delMsgs: days,
        silent
      })
      .then(() =>
        msg.sendLocale("COMMAND_TEMPBAN_DONE", [
          user instanceof GuildMember ? user.user.tag : user,
          reason,
          days,
          msg.args[1]
        ])
      )
      .catch(() => msg.sendLocale("ERR"));
  }
}
