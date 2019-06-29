import { Command, CommandStore, KlasaClient, KlasaMessage } from "klasa";
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
      description: lang => lang.get("COMMAND_SOFTBAN_DESCRIPTION"),
      extendedHelp: lang => lang.get("COMMAND_SOFTBAN_EXTENDED"),
      runIn: ["text"],
      aliases: ["soft", "softb"],
      usage: "<User:member> [Reason:...string]"
    });
  }

  async run(msg: KlasaMessage, args: [GuildMember, String]) {
    const { flags } = msg;
    const [user, reason] = args;

    if (user.id === this.client.user.id)
      return msg.send(this.client.languages.get("en-US").get("COMPUTER_MAN"));
    if (!user.bannable) return msg.sendLocale("COMMAND_SOFTBAN_NOT", [user]);

    const days: number = "7d" in flags ? 7 : 1;
    const silent: boolean = "silent" in flags || "s" in flags;

    // @ts-ignore
    return this.client.funcs
      .softBan({
        user,
        guild: msg.guild,
        mod: msg.author,
        reason,
        delMsgs: days,
        silent
      })
      .then(() => msg.sendLocale("COMMAND_SOFTBAN_DONE", [user, reason, days]))
      .catch(() => msg.sendLocale("ERR"));
  }
}
