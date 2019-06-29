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

    this.createCustomResolver("tempbanneduser", async (arg, possible, msg) => {
      if (!arg) throw msg.language.get("RESOLVER_TEMPBANNEDUSER_INVALID");

      const tasks = this.client.schedule.tasks;
      const bans = await msg.guild.fetchBans();
      let ban;

      if (!constants.MENTION_REGEX.userOrMember.test(arg))
        ban = bans.find(ban => ban.user.username === arg);
      else {
        const id = arg.replace(/[!@<>]/g, "");
        ban = bans.find(ban => ban.user.id === id);
      }

      if (!ban) throw msg.language.get("RESOLVER_TEMPBANNEDUSER_INVALID");

      const exists = !!tasks.filter(
        task =>
          task.taskName === "unban" &&
          task.data.userId === ban.user.id &&
          task.data.guildId === msg.guild.id
      );

      if (!exists) throw msg.language.get("RESOLVER_TEMPBANNEDUSER_INVALID");

      return ban.user;
    });
  }

  async run(msg: KlasaMessage, args) {
    const { flags } = msg;
    const [user, reason] = args;

    const silent: boolean = "silent" in flags || "s" in flags;

    // @ts-ignore
    return this.client.funcs
      .clearTasks({
        user,
        guild: msg.guild,
        taskName: "unban"
      })
      .then(() => {
        this.client.emit("modlog", {
          user,
          guild: msg.guild,
          mod: msg.author,
          reason,
          silent,
          type: "CANCELUNBAN"
        });
        return msg.sendLocale("COMMAND_CANCELUNBAN_DONE", [user, reason]);
      })
      .catch(() => msg.sendLocale("ERR"));
  }
}
