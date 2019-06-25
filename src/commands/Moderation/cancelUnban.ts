import {
  Command,
  CommandStore,
  KlasaMessage,
  KlasaClient,
  constants
} from "klasa";

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
      description: lang => lang.get("COMMAND_CANCELUNBAN_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["cancel", "nounban", "stopunban"],
      usage: "<User:tempbanneduser> [Reason:...string]"
    });

    this.createCustomResolver("tempbanneduser", (arg, possible, msg) => {
      if (!constants.MENTION_REGEX.userOrMember.test(arg))
        throw msg.language.get("RESOLVER_TEMPBANNEDUSER_INVALID");

      const id = arg.replace(/[!@<>]/g, "");
      const schedule = this.client.schedule.get(`${id}-${msg.guild.id}`);

      if (!schedule) throw msg.language.get("RESOLVER_TEMPBANNEDUSER_INVALID");
      return schedule.id;
    });
  }

  async run(msg: KlasaMessage, args) {
    const [schedule, reason] = args;
    const user = await msg.guild
      .fetchBans()
      .then(bans => bans.find(ban => ban.user.id === schedule.split("-")[0]))
      .then(ban => (ban ? ban.user : { tag: "Not Found" }));

    return this.client.schedule
      .delete(schedule)
      .then(() => {
        this.client.emit("modlog", {
          user: user,
          guild: msg.guild,
          mod: msg.author.tag,
          reason,
          type: "CANCELUNBAN"
        });
        return msg.sendLocale("COMMAND_CANCELUNBAN_DONE", [user, reason]);
      })
      .catch(() => msg.sendLocale("ERR"));
  }
}
