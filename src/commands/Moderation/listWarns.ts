import {
  Command,
  CommandStore,
  KlasaMessage,
  KlasaClient,
  RichDisplay
} from "klasa";
import { MessageEmbed } from "discord.js";
import { KlasaMember } from "klasa-member-gateway";

export default class extends Command {
  public constructor(
    client: KlasaClient,
    store: CommandStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir, {
      requiredPermissions: ["MANAGE_ROLES", "EMBED_LINKS"],
      permissionLevel: 0,
      description: lang => lang.get("COMMAND_LISTWARNS_DESCRIPTION"),
      runIn: ["text"],
      aliases: ["warns", "ws"],
      usage: "<User:member>"
    });
  }

  public async run(msg: KlasaMessage, args: [KlasaMember]): Promise<any> {
    const [user] = args;

    if (user.id === this.client.user.id)
      return msg.send(this.client.languages.get("en-US").get("COMPUTER_MAN"));

    const warnings = await user.settings
      .sync()
      .then(settings => settings.get("warns.active"));

    const display = new RichDisplay(
      new MessageEmbed()
        .setColor("#9C27B0")
        .setAuthor(user.user.tag, user.user.displayAvatarURL())
        .setTitle("Warns")
    );

    if (!warnings || !warnings.length)
      display.addPage(template =>
        template.setDescription("This user has no warns")
      );
    else
      for (let i = 0; i < warnings.length; i += 4) {
        display.addPage(template =>
          template.setDescription(
            warnings.slice(i, i + 4).map((warning, index) => {
              const mod = this.client.users.get(warning.modID);
              return `**[${i + index + 1}]** ${
                mod ? `From: \`@${mod.tag}\` **|** ` : ``
              }${warning.reason}`;
            })
          )
        );
      }

    // @ts-ignore
    return display.run(await msg.send("🔄"), {
      filter: (reaction, reactionUser) => reactionUser.id === msg.author.id,
      firstLast: display.pages.length > 2,
      jump: display.pages.length > 2,
      stop: display.pages.length > 1,
      time: 30000
    });
  }
}
