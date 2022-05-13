import { Ctx } from "../rule/context";
import { RuleResult } from "./result/result";

export type Rule<R extends RuleResult = RuleResult> = (code: string, ctx: Ctx) => R;
