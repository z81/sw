import { AstTypes } from "./ast";

export const codegen: any = (ast: AstTypes, code = "") => {  
    if (Array.isArray(ast)) {
        return ast.map(_ => codegen(_)).join("");
    }

    if (ast.type === "ROOT") {
        return codegen(ast.body);
    }

    if (ast.type === "REPEAT") {
        return codegen(ast.value);
    }

    if (ast.type === "BIN_EXP") {
        const operator = codegen(ast.operator);
        const isDim = operator === "//";
        const left = codegen(ast.left);
        const right = codegen(ast.right, isDim ? ")" : "");
        

        if (isDim) {
            return `Math.trunc(${left} / ${right} `;
        }

        return `${left}${code} ${operator} ${right}`;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comтment
    // @ts-ignore
    if (typeof ast.value === "string") {
        return `${ast.value}`;
    }

    if (ast.type === "VAR") {
        return `const ${ast.name.value} = ${codegen(ast.value)}\n`;
    }


    return "";
};