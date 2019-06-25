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
      requiredPermissions: ["MANAGE_MESSAGES", "EMBED_LINKS"],
      permissionLevel: 5,
      description: lang => lang.get("COMMAND_PRUNE_DESCRIPTION"),
      extendedHelp: lang => lang.get("COMMAND_PRUNE_EXTENDED"),
      runIn: ["text"],
      aliases: ["purge", "clean"],
      usage: "<Amount:number{1,50}> [Channel:channel]"
    });

    this.customizeResponse("Amount", msg =>
      msg.language.get("COMMAND_PRUNE_INVALID")
    );
  }

  public async run(
    msg: KlasaMessage,
    args: [number, TextChannel?]
  ): Promise<any> {
    const [amount, channel] = args;

    let target;

    if (!channel) target = msg.channel;
    else target = channel;

    return target
      .bulkDelete(
        await target.messages.fetch({
          limit: amount,
          before: msg.id
        })
      )
      .then(messages =>
        msg.sendLocale("COMMAND_PRUNE_DONE", [messages, amount, target])
      )
      .catch(() => msg.sendLocale("ERR"));
  }
}
