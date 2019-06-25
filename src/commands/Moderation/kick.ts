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
      requiredPermissions: ["KICK_MEMBERS", "EMBED_LINKS"],
      permissionLevel: 3,
      description: (lang): string | string[] =>
        lang.get("COMMAND_KICK_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["bgone", "outtahere"],
      usage: "<User:member> [Reason:...string]"
    });
  }

  public async run(msg: KlasaMessage, args: [GuildMember, String]) {
    const [user, reason] = args;
    if (user.user.id === this.client.user.id)
      return msg.send(this.client.languages.get("en-US").get("COMPUTER_MAN"));
    if (!user.kickable) return msg.sendLocale("COMMAND_KICK_NOT", [user]);

    return user
      .kick(`${msg.author.tag}${reason ? ` || ${reason}` : ``}`)
      .then(() => msg.sendLocale("COMMAND_KICK_DONE", [user, reason]))
      .catch(() => msg.sendLocale("ERR"));
  }
}
