import { grammar } from "./grammar";

const q = (strings: TemplateStringsArray, ...vars: any[]) => strings.reduce((res, str, i) => `${res}${str}${i < vars.length ? codegen(vars[i]) : ""}`, "");

//ReturnType<typeof grammar>
export const codegen: any = (ast: any, code = "") => {
    if (Array.isArray(ast)) {
        return ast.map(_ => codegen(_)).join("");
    }

    if (ast.type === "ROOT") {
        const std = `
            const log = (...args) => console.log(...args)
        `;
        return std + codegen(ast.body);
    }

    if (ast.type === "REPEAT" || ast.type === "AND") {
        return codegen(ast.value);
    }

    if (ast.type === "BIN_EXP") {
        const operator = codegen(ast.operator);
        const isDim = operator === "//";
        const left = codegen(ast.left);
        const right = codegen(ast.right, isDim ? ")" : "");

        if (operator === "|>") {
            return `____${left} r${right}`;
        }


        if (operator === "//") {
            return `Math.trunc(${left} / ${right} `;
        }

        return `${left}${code} ${operator} ${right}`;
    }

    if (typeof ast.value === "string") {
        return `${ast.value}`;
    }

    if (ast.type === "VAR") {
        return `\nconst ${codegen(ast.name)} = ${codegen(ast.value)}\n`;
    }

    if (ast.type === "IF") {
        return ` ${codegen(ast.condition)} ? ${codegen(ast.then)} : ${ast.else ? codegen(ast.else) : "undefined"} \n`;
    }

    if (ast.type === "ARRAY") {
        return `[${[].concat(ast.items).map(codegen).join(" , ")}]`;
    }

    if (ast.type === "FOR") {
        return `for(let ${codegen(ast.to)} of ${codegen(ast.from)}) {  ${codegen(ast.body)} }\n`;
    }

    if (ast.type === "FUNCTION_CALL") {
        return `${codegen(ast.name)}(${codegen(ast.args)})`;
    }

    if (ast.type === "SCOPE") {
        return `eval(\`${codegen(ast.body)}\`)`;
    }


    console.log(ast);


    throw Error(`Unknown codegen rule ${ast?.type}`);
};