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
      if (!arg) throw msg.language.get("RESOLVER_BANNEDUSER_INVALID");

      const bans = await msg.guild.fetchBans();
      let ban;

      if (!constants.MENTION_REGEX.userOrMember.test(arg))
        ban = bans.find(ban => ban.user.username === arg);
      else {
        const id = arg.replace(/[!@<>]/g, "");
        ban = bans.find(ban => ban.user.id === id);
      }

      if (!ban) throw msg.language.get("RESOLVER_BANNEDUSER_INVALID");
      return ban.user;
    });
  }

  async run(msg: KlasaMessage, args) {
    const { flags } = msg;
    const [user, reason] = args;

    const silent: boolean = "silent" in flags || "s" in flags;

    // @ts-ignore
    return this.client.funcs
      .unban({
        user,
        guild: msg.guild,
        mod: msg.author,
        reason,
        silent
      })
      .then(() => msg.sendLocale("COMMAND_UNBAN_DONE", [user, reason]))
      .catch(() => msg.sendLocale("ERR"));
  }
}
