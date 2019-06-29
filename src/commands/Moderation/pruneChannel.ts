import { Command, CommandStore, KlasaMessage, KlasaClient } from "klasa";
import { TextChannel } from "discord.js";

export default class extends Command {
  public constructor(
    client: KlasaClient,
    store: CommandStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir, {
      requiredPermissions: ["MANAGE_CHANNELS", "EMBED_LINKS"],
      permissionLevel: 5,
      description: lang => lang.get("COMMAND_PRUNECHANNEL_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["prunec", "purgechannel", "purgec", "cleanchannel", "cleanc"],
      usage: "[Channel:channel]",
      cooldownLevel: "guild",
      cooldown: 2
    });
  }

  public async run(msg: KlasaMessage, args: [TextChannel?]): Promise<any> {
    const { flags } = msg;
    const [channel] = args;

    // @ts-ignore
    let oldCh: TextChannel = channel || msg.channel;

    if (!oldCh.deletable)
      return msg.sendLocale("COMMAND_PRUNECHANNEL_NOT", [oldCh]);

    const reason = `${msg.author.tag} - PRUNE`;
    const silent: boolean = "silent" in flags || "s" in flags;

    // @ts-ignore
    const newCh: TextChannel = await oldCh.clone({ reason });

    return oldCh
      .delete(reason)
      .then(async messages => {
        await this.client.emit("modlog", {
          channels: [oldCh, newCh],
          guild: msg.guild,
          mod: msg.author,
          silent,
          type: "PRUNECHANNEL"
        });

        return newCh.send(
          msg.language.get(
            "COMMAND_PRUNECHANNEL_DONE",
            msg.author,
            oldCh,
            newCh
          )
        );
      })
      .catch(
        () =>
          msg.sendLocale("ERR") ||
          newCh.send(msg.language.get("ERR") || msg.author.send("ERR"))
      );
  }
}
