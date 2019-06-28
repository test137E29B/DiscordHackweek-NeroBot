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
    silent
  }: {
    user: KlasaMember;
    guild: Guild;
    mod?: User;
    role: Role;
    duration?: Date;
    reason?: string;
    silent: boolean;
  }) {
    return user
      .edit(
        { roles: [...user.roles.array(), role] },
        `${mod ? `${mod.tag} - ` : ``}MUTE${reason ? ` || ${reason}` : ``}`
      )
      .then(async () => {
        // @ts-ignore
        await this.client.funcs.clearTasks({ user, guild, taskName: "unmute" });

        if (duration)
          await this.client.schedule.create("unmute", duration, {
            data: {
              userId: user.id,
              guildId: guild.id,
              modId: mod.id
            }
          });

        await user.settings.update("muted", true);

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
