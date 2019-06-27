import { Function } from "@kcp/functions";
import { User, Guild, GuildMember } from "discord.js";

export default class extends Function {
  async run({
    user,
    guild,
    mod,
    reason,
    duration,
    delMsgs,
    silent
  }: {
    user: User | GuildMember | string;
    guild: Guild;
    mod?: User;
    reason?: string;
    duration: Date;
    delMsgs: 7 | 1 | 0;
    silent: boolean;
  }) {
    return guild.members
      .ban(
        user instanceof User || user instanceof GuildMember ? user.id : user,
        {
          days: delMsgs,
          reason: `${mod ? `${mod.tag} - ` : ``}TEMPBAN${
            reason ? ` || ${reason}` : ``
          }`
        }
      )
      .then(async () => {
        // @ts-ignore
        await this.client.funcs.clearTasks({ user, guild, taskName: "unban" });

        await this.client.schedule.create("unban", duration, {
          data: {
            userId:
              user instanceof User || user instanceof GuildMember
                ? user.id
                : user,
            guildId: guild.id,
            modId: mod.id,
            silent
          },
          catchUp: true,
          id: `${
            user instanceof User || user instanceof GuildMember ? user.id : user
          }-${guild.id}`
        });

        return this.client.emit("modlog", {
          user,
          guild,
          mod,
          reason,
          delMsgs,
          silent,
          type: "TEMPBAN"
        });
      });
  }
}
