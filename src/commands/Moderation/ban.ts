import { Command, CommandStore, KlasaMessage, KlasaClient } from "klasa";

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

  public async run(msg: KlasaMessage, args): Promise<any> {
    const { flags } = msg;
    const [user, reason] = args;

    if (!user.bannable) return msg.sendLocale("COMMAND_BAN_NOT", [user]);

    const days: number = "7d" in flags ? 7 : "1d" in flags ? 1 : 0;

    return user
      .ban({
        days,
        reason: `${msg.author.tag}${reason ? ` || ${reason}` : ``}`
      })
      .then(() => msg.sendLocale("COMMAND_BAN_DONE", [user, reason, days]))
      .catch(() => msg.sendLocale("ERR"));
  }
}
