import { RuleResult } from "./result/result";

export type Rule<R extends RuleResult = RuleResult> = (code: string) => R;
