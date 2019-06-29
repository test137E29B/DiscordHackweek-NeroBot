import { Function } from "@kcp/functions";
import { User, Guild, GuildMember } from "discord.js";

export default class extends Function {
  async run({
    user,
    guild,
    mod,
    reason,
    delMsgs,
    silent
  }: {
    user: User | GuildMember | string;
    guild: Guild;
    mod?: User;
    reason?: string;
    delMsgs: 7 | 1 | 0;
    silent: boolean;
  }) {
    return guild.members
      .ban(user, {
        days: delMsgs,
        reason: `${mod ? `${mod.tag} - ` : ``}BAN${
          reason ? ` || ${reason}` : ``
        }`
      })
      .then(async () => {
        // @ts-ignore
        await this.client.funcs.clearTasks({ user, guild, taskName: "unban" });

        return this.client.emit("modlog", {
          user,
          guild,
          mod,
          reason,
          delMsgs,
          silent,
          type: "BAN"
        });
      });
  }
}
