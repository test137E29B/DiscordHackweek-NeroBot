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
      description: lang => lang.get("COMMAND_MUTE_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["shush", "stfu", "m"],
      usage: "<User:member> [Duration:duration] [Reason:...string]"
    });
  }

  public async run(
    msg: KlasaMessage,
    args: [GuildMember, Date, String]
  ): Promise<any> {
    const [user, duration, reason] = args;

    const { settings } = msg.guild;
    // @ts-ignore
    const { muted } = settings.roles.punishments;

    if (!muted)
      return msg.sendLocale("ROLES_REQUIRED", ["muted", "mutedSetup"]);

    this.client.console.log(user, duration, reason, muted);

    return user
      .edit({
        roles: [muted]
      })
      .then(async () => {
        if (duration)
          await this.client.schedule.create("unmute", duration, {
            data: {
              userId: user.id,
              guildId: msg.guild.id,
              modId: msg.author.id,
              reason
            }
          });

        return msg.sendLocale("COMMAND_MUTE_DONE");
      })
      .catch(() => msg.sendLocale("ERR"));
  }
}
