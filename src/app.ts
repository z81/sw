import fs from "fs";
import { codegen } from "./langs/one/codegen";
import { grammar } from "./langs/one/grammar";
import { isOk } from "./lib/rule/result/ok";

// -------------------------------------------------------------------
const src = `
set a = 2 + 4 // 5 + 7 * 8
set b = true
set d = if 4 > 2 then 3 else 4
set h2 = "string \\" woof 123 "
set xx = [ 1 ]
set h = [2, 3, "TEST"]
for i of h { 1 }
set x = if 4 > 3 {
  set a = "25"
  a
}

log("Test", parseInt(x, 10))


`;

console.log("______________INPUT______________", src);

const result = grammar(src);

fs.writeFileSync("./dist/out.json", JSON.stringify(result, undefined, "  "), "utf-8");

const out: any = result;

if (isOk(result)) {
  const c = codegen(out);

  console.log("_______________OUT_______________");
  console.log(c);
  console.log("_______________EVAL_______________");
  console.log(eval(c));
} else {
  console.error("error", result);
}

