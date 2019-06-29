import {
  Monitor,
  MonitorStore,
  KlasaClient,
  KlasaMessage,
  Settings
} from "klasa";
import {
  NeroGuildSchema,
  NeroModAction
} from "../lib/structures/schemas/guildSchema";

export default class extends Monitor {
  constructor(
    client: KlasaClient,
    store: MonitorStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir, {
      ignoreOthers: false,
      ignoreEdits: false,
      ignoreBlacklistedUsers: false
    });
  }

  async run(msg: KlasaMessage) {
    const { guild, cleanContent, channel, member, command } = msg;
    if (!guild) return;
    // @ts-ignore
    const config: Settings & NeroGuildSchema = guild.settings;
    const automod = config.get("automod");

    if (!automod.enabled || !automod.words.enabled) return;

    const {
      list,
      channels,
      action
    }: {
      list: string[];
      channels: string[];
      action: NeroModAction;
    } = config.get("automod.words");

    if (
      !channels.includes(channel.id) ||
      !action ||
      !list ||
      !list.length ||
      !!command
    )
      return;

    if (
      list.find(word => cleanContent.toUpperCase().includes(word.toUpperCase()))
    )
      // @ts-ignore
      return this.client.funcs
        .punish({
          user: member,
          guild,
          msg,
          action
        })
        .then(punished => {
          if (!action.feedback || !action.feedback.enabled) return;
          // if (!punished) return msg.sendLocale("ERR");
          return msg.reply(action.feedback.text);
        });
  }
}
