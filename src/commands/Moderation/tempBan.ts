import { Command, CommandStore, KlasaMessage, KlasaClient } from "klasa";

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
      usage: "<User:member> <Duration:duration> [Reason:...string]"
    });
  }

  async run(msg: KlasaMessage, args) {
    const { flags } = msg;
    const [user, duration, reason] = args;

    if (!user.bannable) return msg.sendLocale("COMMAND_TEMPBAN_NOT", [user]);

    const days: number = "7d" in flags ? 7 : "1d" in flags ? 1 : 0;
    const reasonText: string = `${msg.author.tag} - TEMPBAN (${msg.args[1]}) ${
      reason ? ` || ${reason}` : ``
    }`;

    return user
      .ban({ days, reason: reasonText })
      .then(() =>
        this.client.schedule
          .create("unban", duration, {
            data: {
              userId: user.id,
              guildId: msg.guild.id,
              mod: msg.author.tag,
              reason: reason,
              type: `TEMPBAN (${msg.args[1]})`
            },
            catchUp: true,
            id: `${user.id}-${msg.guild.id}`
          })
          .then(() =>
            msg.sendLocale("COMMAND_TEMPBAN_DONE", [
              user,
              reason,
              days,
              msg.args[1]
            ])
          )
      )
      .catch(() => msg.sendLocale("ERR"));
  }
}
