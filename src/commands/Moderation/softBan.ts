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
    if (user.user.id === this.client.user.id)
      return msg.send(this.client.languages.get("en-US").get("COMPUTER_MAN"));
    if (!user.bannable) return msg.sendLocale("COMMAND_SOFTBAN_NOT", [user]);

    const days: number = "7d" in flags ? 7 : 1;

    return user
      .ban({
        days,
        reason: `${msg.author.tag} - SOFTBAN (${days}d)${
          reason ? ` || ${reason}` : ``
        }`
      })
      .then(() =>
        this.client.tasks
          .get("unban")
          .run({
            userId: user.id,
            guildId: msg.guild.id,
            mod: msg.author.tag,
            reason,
            type: "UNBAN"
          })
          .then(() =>
            msg.sendLocale("COMMAND_SOFTBAN_DONE", [user, reason, days])
          )
      )
      .catch(() => msg.sendLocale("ERR"));
  }
}
