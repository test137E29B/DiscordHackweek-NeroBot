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
      requiredPermissions: ["MANAGE_ROLES", "EMBED_LINKS"],
      permissionLevel: 2,
      description: lang => lang.get("COMMAND_DELWARN_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["w"],
      usage: "<User:member> <WarnNumber:warnposition> [Reason:...string]"
    });

    this.createCustomResolver(
      "warnposition",
      async (arg, possible, msg, [user]) => {
        if (!arg) throw msg.language.get("RESOLVER_INVALID_WARNPOSITION");
        const pos = parseInt(arg);

        const warnings = await user.settings
          .sync()
          .then(settings => settings.get("warns.active"));

        if (!warnings || !warnings.length || pos < 1 || pos > warnings.length)
          throw msg.language.get("RESOLVER_INVALID_WARNPOSITION");

        return pos;
      }
    );
  }

  public async run(
    msg: KlasaMessage,
    args: [GuildMember, number, String]
  ): Promise<any> {
    const { flags } = msg;
    const [user, position, reason] = args;

    if (user.id === this.client.user.id)
      return msg.send(this.client.languages.get("en-US").get("COMPUTER_MAN"));

    const silent: boolean = "silent" in flags || "s" in flags;

    // @ts-ignore
    return this.client.funcs
      .delWarn({
        position,
        user,
        guild: msg.guild,
        mod: msg.author,
        reason,
        silent
      })
      .then(() => msg.sendLocale("COMMAND_DELWARN_DONE", [user, position]))
      .catch(() => msg.sendLocale("ERR"));
  }
}
