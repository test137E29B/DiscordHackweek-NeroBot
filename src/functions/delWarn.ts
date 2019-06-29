import { Function } from "@kcp/functions";
import { User, Guild } from "discord.js";
import { KlasaMember } from "klasa-member-gateway";
export default class extends Function {
  async run({
    position,
    user,
    guild,
    mod,
    reason,
    silent
  }: {
    position: number;
    user: KlasaMember;
    guild: Guild;
    mod?: User;
    reason: string;
    silent: boolean;
  }) {
    // @ts-ignore
    const settings = await user.settings.sync();

    return settings
      .update(
        "warns.active",
        [...settings.get("warns.active").slice(0, position - 1)],
        {
          action: "overwrite"
        }
      )
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
