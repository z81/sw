import fs from "fs";
import { ast } from "./langs/math/ast";
import { codegen } from "./langs/math/codegen";
import { grammar } from "./langs/math/grammar";
import { isOk } from "./lib/rule/result/ok";

// -------------------------------------------------------------------
const result = grammar(`
  set a = 2 + 4 // 5 + 7 * 8
  set b = true
`);//+ 4 // 5 + 7 * 8 

fs.writeFileSync("./dist/res.json", JSON.stringify(result, undefined, "  "), "utf-8");

let out: any = result;

if (isOk(result)) {
  out = ast(result as any); 
 
  const c = codegen(out);
  console.log(c);
  // console.log(eval(c));
}

fs.writeFileSync("./dist/out.json", JSON.stringify(out, undefined, "  "), "utf-8");
