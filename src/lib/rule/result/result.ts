import { RuleTypes } from "../ruleTypes";
import { Ok } from "./ok";
import { Error } from "./error";

export type RuleResult<T extends RuleTypes = RuleTypes, V extends unknown = unknown, E extends unknown = unknown> =
  | Ok<V, T>
  | Error<E, T>;
