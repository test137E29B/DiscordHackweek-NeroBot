import {
  Command,
  CommandStore,
  KlasaMessage,
  KlasaClient,
  constants
} from "klasa";
import { GuildMember } from "discord.js";
import { KlasaMember } from "klasa-member-gateway";
const {
  MENTION_REGEX: { userOrMember }
} = constants;

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
      description: lang => lang.get("COMMAND_UNMUTE_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["talk"],
      usage: "<User:mutedmember> [Reason:...string]"
    });

    this.createCustomResolver("mutedmember", async (arg, possible, msg) => {
      if (!arg || !userOrMember.test(arg))
        throw msg.language.get("RESOLVER_MUTEDMEMBER_INVALID");

      const id = arg.replace(/[!@<>]/g, "");
      const member = msg.guild.members.get(id) as KlasaMember;

      if (!member) throw msg.language.get("RESOLVER_MUTEDMEMBER_INVALID");

      await member.settings.sync(true);
      // @ts-ignore
      if (!member.settings.muted)
        throw msg.language.get("RESOLVER_MUTEDMEMBER_INVALID");

      return member;
    });
  }

  public async run(
    msg: KlasaMessage,
    args: [GuildMember, Date, String]
  ): Promise<any> {
    const { flags } = msg;
    const [user, reason] = args;

    if (!user.manageable) return msg.sendLocale("COMMAND_MUTE_NOT");

    const { settings } = msg.guild;

    // @ts-ignore
    const { muted } = settings.roles.punishments;

    if (!muted)
      return msg.sendLocale("ROLES_REQUIRED", ["muted", "mutedSetup"]);

    const silent: boolean = "silent" in flags || "s" in flags;

    // @ts-ignore
    return this.client.funcs
      .unmute({
        user,
        guild: msg.guild,
        mod: msg.author,
        role: muted,
        reason,
        silent
      })
      .then(() => msg.sendLocale("COMMAND_UNMUTE_DONE", [user]))
      .catch(() => msg.sendLocale("ERR"));
  }
}
