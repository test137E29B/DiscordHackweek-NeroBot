import { Function } from "@kcp/functions";
import { User, Guild } from "discord.js";

export default class extends Function {
  async run({
    user,
    guild,
    mod,
    reason,
    silent
  }: {
    user: User | string;
    guild: Guild;
    mod?: User;
    reason?: string;
    silent: boolean;
  }) {
    return guild.members
      .unban(
        user,
        `${mod ? `${mod.tag} - ` : ``}UNBAN${reason ? ` || ${reason}` : ``}`
      )
      .then(async user => {
        // @ts-ignore
        await this.client.funcs.clearTasks({ user, guild, taskName: "unban" });

        return this.client.emit("modlog", {
          user,
          guild,
          mod,
          reason,
          silent,
          type: "UNBAN"
        });
      });
  }
}
