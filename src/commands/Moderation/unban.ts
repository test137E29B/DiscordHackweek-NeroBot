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
      description: lang => lang.get("COMMAND_UNBAN_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["pardon", "comeback"],
      usage: "<User:banneduser> [Reason:...string]"
    });

    this.createCustomResolver("banneduser", async (arg, possible, msg) => {
      if (!constants.MENTION_REGEX.userOrMember.test(arg))
        throw msg.language.get("RESOLVER_BANNEDUSER_INVALID");

      const id = arg.replace(/[!@<>]/g, "");
      const ban = await msg.guild
        .fetchBans()
        .then(bans => bans.find(ban => ban.user.id === id));

      if (!ban) throw msg.language.get("RESOLVER_BANNEDUSER_INVALID");
      return ban.user;
    });
  }

  async run(msg: KlasaMessage, args) {
    const [user, reason] = args;

    return this.client.tasks
      .get("unban")
      .run({
        userId: user.id,
        guildId: msg.guild.id,
        mod: msg.author.tag,
        reason,
        type: "UNBAN"
      })
      .then(() => {
        const schedule = this.client.schedule.get(`${user.id}-${msg.guild.id}`);
        if (schedule) this.client.schedule.delete(`${user.id}-${msg.guild.id}`);
      })
      .then(() => msg.sendLocale("COMMAND_UNBAN_DONE", [user, reason]))
      .catch(() => msg.sendLocale("ERR"));
  }
}
