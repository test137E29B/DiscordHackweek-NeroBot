import {
  Monitor,
  MonitorStore,
  KlasaClient,
  KlasaMessage,
  Settings
} from "klasa";
import {
  NeroGuildSchema,
  PerspectiveToxicity
} from "../lib/structures/schemas/guildSchema";
import fetch from "node-fetch";
import { perspective } from "../../config";

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

    if (!automod.enabled || !automod.perspective.enabled || !!command) return;

    const {
      channels,
      toxicity
    }: {
      channels: string[];
      toxicity: PerspectiveToxicity[];
    } = config.get("automod.perspective");

    if (!channels.includes(channel.id) || !toxicity || !toxicity.length) return;

    const analisys = await fetch(
      `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${perspective}`,
      {
        method: "POST",
        body: JSON.stringify({
          comment: {
            text: cleanContent
          },
          requestedAttributes: {
            TOXICITY: {}
          },
          doNotStore: true
        })
      }
    )
      .then(res => res.json())
      .catch(e => e.error || e);

    if (!analisys || analisys.error) return;

    const toxLevel = analisys.attributeScores.TOXICITY.summaryScore.value;
    this.client.console.log(toxLevel);
    const action = toxicity
      .sort((a, b) => a.threshold - b.threshold)
      .filter(act => act.threshold <= toxLevel)
      .pop();

    if (!action) return;

    if (analisys)
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
