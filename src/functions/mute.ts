import { Function } from "@kcp/functions";
import { User, Guild, Role } from "discord.js";
import { KlasaMember } from "klasa-member-gateway";

export default class extends Function {
  async run({
    user,
    guild,
    mod,
    role,
    duration,
    reason,
    silent,
    keep
  }: {
    user: KlasaMember;
    guild: Guild;
    mod?: User;
    role: Role | string;
    duration?: Date;
    reason?: string;
    silent: boolean;
    keep: boolean;
  }) {
    return user
      .edit(
        { roles: [...user.roles.array(), role] },
        `${mod ? `${mod.tag} - ` : ``}MUTE${reason ? ` || ${reason}` : ``}`
      )
      .then(async () => {
        if (!keep)
          // @ts-ignore
          await this.client.funcs.clearTasks({
            user,
            guild,
            taskName: "unmute"
          });

        if (duration && !keep)
          await this.client.schedule.create("unmute", duration, {
            data: {
              userId: user.id,
              guildId: guild.id,
              modId: mod.id,
              silent
            },
            catchUp: true
          });

        // @ts-ignore
        const sett = this.client.gateways.members.get(
          `${guild.id}.${typeof user === "string" ? user : user.id}`,
          true
        );
        if (sett) await sett.update("muted", true);

        return this.client.emit("modlog", {
          user,
          guild,
          mod,
          reason,
          duration,
          silent,
          type: "MUTE"
        });
      });
  }
}
