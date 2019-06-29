import { Function } from "@kcp/functions";
import { User, Guild, GuildMember } from "discord.js";

export default class extends Function {
  async run({
    user,
    guild,
    taskName
  }: {
    user: User | GuildMember | string;
    guild: Guild;
    taskName: string | string[];
  }) {
    const tasks = this.client.schedule.tasks;

    if (!tasks) return;

    const schedules = tasks.filter(task =>
      taskName instanceof Array
        ? taskName.includes(task.taskName)
        : task.taskName === taskName &&
          task.data.userId ===
            (user instanceof GuildMember || user instanceof User
              ? user.id
              : user) &&
          task.data.guildId === guild.id
    );

    return Promise.all(schedules.map(task => task.delete()));
  }
}
