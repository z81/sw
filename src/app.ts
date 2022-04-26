import fs from "fs";

type RuleTypes = "AND" | "OR" | "MAYBE" | "REPEAT";
type TypeAliases =
  | "PLUS"
  | "MINUS"
  | "MUL"
  | "NEW_LINE"
  | "SPACE"
  | "OPERATOR"
  | "DIGEST"
  | "NUMBER"
  | "ROOT"
  | "DOT"
  | "POS_DOUBLE_NUM"
  | "EXP"
  | "BIN_EXP";
type Types = RuleTypes | TypeAliases;

type Ok<V extends unknown = unknown, T extends Types = Types> = {
  value: V;
  type: T;
  length: number;
  status: "OK";
  skip?: boolean;
};

type Error<E extends unknown = unknown, T extends unknown = unknown> = {
  error: E;
  type: T;
  status: "ERROR";
};

type RuleResult<T extends Types = Types, V extends unknown = unknown, E extends unknown = unknown> =
  | Ok<V, T>
  | Error<E, T>;

type Rule<R extends RuleResult = RuleResult> = (code: string) => R;

// -------------------------------------------------------------------

const isOk = (value: RuleResult): value is Ok => typeof value === "object" && value.status === "OK";
const isError = (value: RuleResult): value is Ok => typeof value === "object" && value.status === "ERROR";

// -------------------------------------------------------------------
const and =
  <T extends Rule[]>(...rules: T) =>
  (code: string): RuleResult => {
    const result: Ok[] = [];
    let str = code;

    for (const rule of rules) {
      const res = rule(str);

      if (isOk(res)) {
        if (!res.skip) {
          result.push(res);
        }

        str = str.slice(res.length);
      }

      if (isError(res)) {
        return res;
      }
    }

    return {
      value: result,
      type: "AND",
      length: result.reduce((a, b) => a + b.length, 0),
      status: "OK",
    };
  };

const or =
  <T extends Rule[]>(...rules: T) =>
  (code: string): RuleResult => {
    const errors: Error[] = [];
    for (const rule of rules) {
      const res = rule(code);
      if (isOk(res)) {
        return res;
      }
      errors.push(res);
    }

    return {
      type: "OR",
      status: "ERROR",
      error: `Excepted some ${errors.map((e) => e.type)} found "${code.substring(0, 5)}"`,
    } as const;
  };

const maybe =
  <T extends Rule>(rule: T) =>
  (code: string): RuleResult => {
    const res = rule(code);

    return isOk(res)
      ? res
      : ({
          value: "",
          type: "MAYBE" as const,
          length: 0,
          status: "OK",
          skip: true,
        } as const);
  };

const repeat =
  <T extends Rule[]>(...rules: T) =>
  (code: string): RuleResult => {
    const result: Ok[] = [];
    let str = code;

    while (true) {
      for (const rule of rules) {
        const res = rule(str);

        if (!isOk(res)) {
          if (result.length === 1) {
            return result[0];
          }

          return result.length > 0
            ? {
                type: "REPEAT",
                value: result,
                length: result.reduce((a, b) => a + b.length, 0),
                status: "OK",
              }
            : {
                type: "REPEAT",
                error: "No items",
                status: "ERROR",
              };
        }

        const last = result[result.length - 1];
        if (last?.type === res.type) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          last.value += res.value;
          last.length += res.length;
        } else {
          result.push(res);
        }

        str = str.slice(res.length);
      }
    }
  };

const as =
  <R extends Rule, T extends Types>(type: T, rule: R, up = true) =>
  (code: string): RuleResult => {
    let res = rule(code);
    if (up && isOk(res) && Array.isArray(res.value)) {
      if (res.value.length === 1) {
        res = res.value[0];
      } else if (res.value.every((t) => t.type === res.value?.[0].type)) {
        res.value = res.value.map((r) => r.value).join("");
      }
    }

    res.type = type;
    return res;
  };

const skip =
  <R extends Rule>(rule: R) =>
  (code: string): RuleResult => {
    const res = rule(code);
    if (isOk(res)) {
      res.skip = true;
    }

    return res;
  };

const lazy =
  <R extends Rule>(rule: () => R) =>
  (code: string): RuleResult => {
    return rule()(code);
  };

// -------------------------------------------------------------------

const makeSymbolRule =
  <T extends string, U extends Types>(type: U, symbol: T) =>
  ([codeSym]: string): RuleResult => {
    return codeSym === symbol
      ? {
          value: symbol,
          type,
          length: 1,
          status: "OK",
        }
      : {
          type,
          error: "No",
          status: "ERROR",
        };
  };

const makeRangeRule =
  <R extends string | number, T extends Types>(start: R, end: R, type: T) =>
  ([symbol]: string): RuleResult => {
    return symbol >= start && symbol <= end
      ? {
          value: symbol,
          type,
          length: 1,
          status: "OK",
        }
      : {
          type,
          error: "No",
          status: "ERROR",
        };
  };

// -------------------------------------------------------------------
const space = makeSymbolRule("SPACE", " ");
const newLine = makeSymbolRule("NEW_LINE", "\n");

const plus = makeSymbolRule("PLUS", "+");
const minus = makeSymbolRule("MINUS", "-");
const mul = makeSymbolRule("MUL", "*");

const dot = makeSymbolRule("DOT", ".");

const operator = as("OPERATOR", or(plus, minus, mul));

const digest = makeRangeRule("0", "9", "DIGEST");
const positiveInt = repeat(digest);
const posWithFloat = as("POS_DOUBLE_NUM", or(and(positiveInt, dot, positiveInt), positiveInt));

const number = as("NUMBER", and(maybe(minus), posWithFloat));

const empty = or(space, newLine);

const _____ = skip(maybe(repeat(empty)));

// prettier-ignore
const BIN_EXP: any = as(
  "BIN_EXP",
  and(
    _____,
    number,
    _____,
    operator,
    _____,
    or(
      lazy(() => BIN_EXP),
      number
    ),
    _____
  )
);

// prettier-ignore
const grammar = as(
  "ROOT",
  and(BIN_EXP),
  false
);
// -------------------------------------------------------------------
let r = grammar(`
  2 * 2 + 2
`);
/*

number + number 
left op right = 

*/

const toAst = (r: any) => {
  let value: any = undefined;
  
  if (r.type === "BIN_EXP") {
    for (const v of r.value) {
      if (value === undefined) {
        value = toAst(v);
      } else if (v.type === "OPERATOR") {
        value = {
          type: "BIN_EXP",
          operator: v.value,
          left: value,
          right: undefined,
        };
      } else {
        value.right = toAst(v);
      }
    }
  } else if (r.type === "ROOT") {
    return {
      type: "ROOT",
      body: Array.isArray(r.value) ? r.value.map(toAst) : toAst(r.value),
    };
  }

  return value ?? r;
};


 
r = toAst(r); 

// -------------------------------------------------------------------
fs.writeFileSync("./dist/out.json", JSON.stringify(r, undefined, "  "), "utf-8");
 