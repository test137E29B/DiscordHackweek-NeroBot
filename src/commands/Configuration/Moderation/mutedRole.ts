import { Command, CommandStore, KlasaMessage, KlasaClient } from "klasa";
import { Role } from "discord.js";

export default class extends Command {
  public constructor(
    client: KlasaClient,
    store: CommandStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir, {
      requiredPermissions: ["MANAGE_CHANNELS", "EMBED_LINKS"],
      description: (lang): string => lang.get("ROLES_DESCRIPTION", "mute"),
      extendedHelp: (lang): string => lang.get("COMMAND_MUTEDROLE_EXTENDED"),
      aliases: ["muted", "setupmuted", "mutedsetup"],
      runIn: ["text"],
      subcommands: true,
      usage: "<set|show|reset> (Role:improvedrole)"
    });
  }

  public async set(msg: KlasaMessage, args: [Role]) {
    if (!(await msg.hasAtLeastPermissionLevel(5)))
      return msg.sendLocale("ROLES_NO_PERM", ["muted"]);

    const [role] = args;
    const { flags } = msg;

    try {
      if (!["manual", "m"].some(flag => flag in flags)) {
        await msg.guild.channels
          .filter(channel => channel.manageable)
          .each(channel =>
            channel.createOverwrite(
              role,
              {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
                SPEAK: false
              },
              `${msg.author.tag} - MUTESETUP`
            )
          );
      }
      return msg.guild.settings
        .update("roles.punishments.muted", role.id, msg.guild)
        .then(result => {
          if (result.errors && result.errors.length)
            return msg.sendLocale("ERR");
          return msg.sendLocale("ROLES_DONE", ["muted", role]);
        })
        .catch(() => msg.sendLocale("ERR"));
    } catch (e) {
      msg.sendLocale("ERR");
    }
  }

  public async show(msg: KlasaMessage) {
    // @ts-ignore
    const roleId = msg.guild.settings.roles.punishments.muted;
    if (!roleId) return msg.sendLocale("ROLES_NOT_DEFINED", ["muted"]);

    const role = msg.guild.roles.get(roleId);

    return msg.sendLocale("ROLES_VIEW", ["muted", role]);
  }

  public async reset(msg: KlasaMessage) {
    if (!(await msg.hasAtLeastPermissionLevel(5)))
      return msg.sendLocale("ROLES_NO_PERM", ["muted"]);

    return msg.guild.settings
      .reset("roles.punishments.muted")
      .then(result => {
        if (result.errors && result.errors.length) return msg.sendLocale("ERR");
        return msg.sendLocale("ROLES_RESET", ["muted"]);
      })
      .catch(() => msg.sendLocale("ERR"));
  }
}
