import { Ok } from "../../lib/rule/result/ok";

export type ROOT = {
  type: "ROOT";
  body: AstTypes | AstTypes[];
};

export type BIN_EXP = {
  type: "BIN_EXP";
  left: AstTypes | string;
  right: AstTypes | string;
  operator: string;
};

export type NUMBER = {
  type: "NUMBER";
  value: number;
};

export type EQ = {
  type: "EQ";
};

export type SET = {
  type: "SET";
  name: string;
  value: AstTypes;
};

export type AstTypes = ROOT | BIN_EXP | NUMBER | SET | EQ;

type Args = Ok<Args[]>;

export const ast = (r: Args): AstTypes => {
 

  return r as any;
};
