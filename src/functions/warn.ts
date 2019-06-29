import { Function } from "@kcp/functions";
import { User, Guild } from "discord.js";
import { KlasaMember } from "klasa-member-gateway";
export default class extends Function {
  async run({
    user,
    guild,
    mod,
    reason,
    silent
  }: {
    user: KlasaMember;
    guild: Guild;
    mod?: User;
    reason: string;
    silent: boolean;
  }) {
    // @ts-ignore
    const settings = await user.settings.sync();

    const now = Date.now();

    return settings
      .update(
        "warns.active",
        mod
          ? { modID: mod.id, reason, timestamp: now }
          : { reason, timestamp: now },
        { action: "add" }
      )
      .then(() => this.client.emit("guildMemberWarnAdd", user))
      .then(() =>
        this.client.emit("modlog", {
          user,
          guild,
          mod,
          reason,
          silent,
          type: "WARN"
        })
      );
  }
}
