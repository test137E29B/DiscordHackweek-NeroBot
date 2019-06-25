import { Language, KlasaClient, LanguageStore } from "klasa";

export default class extends Language {
  public constructor(
    client: KlasaClient,
    store: LanguageStore,
    file: string[],
    dir: string
  ) {
    super(client, store, file, dir);
    this.language = {
      // Add Language keys in here with Portuguese translations
      TEST: "Isto é um teste",
      ERR:
        "\\❌ **|** Aconteceu um erro, por favor tente novamente mais tarde\nSe o erro persistir, contate o suporte",

      // Kick
      COMMAND_KICK_DESCRIPTION: "Expulsa um usuário",
      COMMAND_KICK_NOT: user =>
        `\\❌ **|** Infelizmente, não posso expulsar \`${user.user.tag}\``,
      COMMAND_KICK_DONE: (user, reason) =>
        `\\👢 **|** \`${user.user.tag}\` levou uma botada ${
          reason ? ` por \`${reason}\`` : ``
        }`,

      // BAN
      COMMAND_BAN_DESCRIPTION: "Bane um usuário",
      COMMAND_BAN_EXTENDED: "Opções: --7d --1d",
      COMMAND_BAN_NOT: user =>
        `\\❌ **|** Infelizmente, não posso banir \`${user.user.tag}\``,
      COMMAND_BAN_DONE: (user, reason, days) =>
        `\\🔨 **|** \`${user.user.tag}\` levou uma martelada${
          reason ? ` por \`${reason}\`` : ``
        }${
          days
            ? ` e suas mensagens ${
                days === 7 ? "dos últimos 7 days" : "das últimas 24 hours"
              } foram removidas`
            : ``
        }`,

      // SOFTBAN
      COMMAND_SOFTBAN_DESCRIPTION:
        "Bane um usuário e desbane o mesmo apenas para deletar suas mensagens",
      COMMAND_SOFTBAN_EXTENDED:
        "Opções: --7d\nSe nenhuma opção for especificada, o padrão é deletar as mensagens das últimas 24h",
      COMMAND_SOFTBAN_NOT: user =>
        `\\❌ **|** Infelizmente, não posso banir \`${user.user.tag}\``,
      COMMAND_SOFTBAN_DONE: (user, reason, days) =>
        `\\🔨 **|** \`${user.user.tag}\` levou uma martelada (mas de leve)${
          reason ? ` por \`${reason}\`` : ``
        } e suas mensagens ${
          days === 7 ? "dos últimos 7 dias" : "das últimas 24 horas"
        } foram removidas`,

      // TEMPBAN
      COMMAND_TEMPBAN_DESCRIPTION: "Bane temporariamente um usuário",
      COMMAND_TEMPBAN_EXTENDED:
        "Opções: --7d --1d\nO desbanimento pode ser cancelado a qualquer momento, basta executar o comando cancelUnban",
      COMMAND_TEMPBAN_NOT: user =>
        `\\❌ **|** Infelizmente, não posso banir \`${user.user.tag}\``,
      COMMAND_TEMPBAN_DONE: (user, reason, days, duration) =>
        `\\🔨 **|** \`${user.user.tag}\` levou uma martelada (temporária)${
          reason ? ` por \`${reason}\`` : ``
        }${
          days
            ? ` e suas mensagens ${
                days === 7 ? "dos últimos 7 dias" : "das últimas 24 horas"
              } foram removidas`
            : ``
        }, ele será automaticamente desbanido em ${duration}`,

      // CANCELUNBAN
      RESOLVER_TEMPBANNEDUSER_INVALID:
        "Você deve inserir um ID ou menção válidos de um usuário banido temporariamente",

      COMMAND_CANCELUNBAN_DESCRIPTION:
        "Cancela o desbanimento automático de um usuário",
      COMMAND_CANCELUNBAN_DONE: (user, reason) =>
        `\\🆑 **|** O desbanimento de \`${user.tag}\` foi cancelado${
          reason ? ` por \`${reason}\`` : ``
        }`,

      // UNBAN
      RESOLVER_BANNEDUSER_INVALID:
        "Você deve inserir um ID ou menção válidos de um usuário banido",

      COMMAND_UNBAN_DESCRIPTION: "Desbane um usuário",
      COMMAND_UNBAN_DONE: (user, reason) =>
        `\\✨ **|** \`${user.tag}\` foi desbanido${
          reason ? ` por \`${reason}\`` : ``
        }`,

      // PRUNE
      COMMAND_PRUNE_DESCRIPTION:
        "Deleta uma certa quantidade de mensagens de um canal (up to 50 messages)",
      COMMAND_PRUNE_EXTENDED:
        "Se a quantidade desejada de mensagens a serem deletadas for muito grande, considere usando pruneChannel",
      COMMAND_PRUNE_INVALID:
        "Você deve inserir uma quantidade válida de mensagens a serem deletadas (até 50), se desejar limpar mais do que isso considere usar pruneChannel",
      COMMAND_PRUNE_DONE: (messages, desired, channel) =>
        `\\🧨 **|** \`${messages.size}${
          messages.size !== desired ? `/${desired}` : ``
        }\` mensage${
          messages.size === 1 ? "m foi deletada" : "ns foram deletadas"
        }`,

      // PRUNECHANNEL
      COMMAND_PRUNECHANNEL_DESCRIPTION: "Deleta todas as mensagens de um canal",
      COMMAND_PRUNECHANNEL_NOT: channel =>
        `\\❌ **|** Infelizmente, não posso limpar ${channel}`,
      COMMAND_PRUNECHANNEL_DONE: (user, oldCh, newCh) =>
        `\\🧨 **|** \`#${oldCh.name}\` foi completamente limpo ||${user}||`,

      // ROLES
      RESOLVER_IMPROVEDROLE_INVALID:
        "Você deve inserir um ID, menção ou nome de um cargo",

      ROLES_DESCRIPTION: roleType =>
        `Mostra o cargo com permissão de ${roleType} ou configura um novo`,
      ROLES_NO_PERM: roleType =>
        `\\❌ **|** Desculpe, você não tem permissão de trocar o cargo de ${roleType}`,
      ROLES_DONE: (roleType, role) =>
        `\\🎭 **|** O novo cargo de ${roleType} agora é \`${role.name} (${
          role.id
        })\``,
      ROLES_VIEW: (roleType, role) =>
        `\\🎭 **|** O cargo de ${roleType} atual é \`${role.name} (${
          role.id
        })\``,
      ROLES_NOT_DEFINED: roleType =>
        `\\❌ **|** Nenhum cargo de ${roleType} foi configurado`
    };
  }

  public async init(): Promise<void> {
    await super.init();
  }
}
