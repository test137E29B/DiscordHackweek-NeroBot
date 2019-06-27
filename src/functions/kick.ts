import { Function } from "@kcp/functions";
import { User, Guild, GuildMember } from "discord.js";

export default class extends Function {
  async run({
    user,
    guild,
    mod,
    reason,
    silent
  }: {
    user: GuildMember;
    guild: Guild;
    mod?: User;
    reason?: string;
    silent: boolean;
  }) {
    return user
      .kick(`${mod ? `${mod.tag} - ` : ``}KICK${reason ? ` || ${reason}` : ``}`)
      .then(() =>
        this.client.emit("modlog", {
          user,
          guild,
          mod,
          reason,
          silent,
          type: "KICK"
        })
      );
  }
}
