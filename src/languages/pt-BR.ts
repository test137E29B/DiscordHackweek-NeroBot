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
        }`
    };
  }

  public async init(): Promise<void> {
    await super.init();
  }
}
