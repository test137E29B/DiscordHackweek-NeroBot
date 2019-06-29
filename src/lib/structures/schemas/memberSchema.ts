import { Schema, SchemaFolder } from "klasa";
import { NeroModActionType } from "./guildSchema";

export interface NeroPunishment {
  modId?: string;
  reason?: string;
  culprit?: string;
  type: NeroModActionType;
}

export interface NeroWarn extends NeroPunishment {
  type: 6;
}

export interface NeroMemberSchema extends Schema {
  warns: {
    active: NeroWarn[];
    archived: NeroWarn[];
  };
  muted: boolean;
}

// @ts-ignore
export const schema: NeroMemberSchema = new Schema()
  .add(
    "warns",
    (folder): SchemaFolder =>
      folder
        .add("active", "any", {
          array: true,
          configurable: false
        })
        .add("archived", "any", {
          array: true,
          configurable: false
        })
  )
  .add("muted", "boolean", {
    configurable: false
  });
