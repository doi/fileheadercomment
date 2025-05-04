import * as vscode from "vscode";

interface ReplaceObject {
    [key: string]: string | string[];
    date: string;
    time: string;
    time24h: string;
    day: string;
    month: string;
    year: string;
    company: string;
    filename: string;
    hour: string;
    minute: string;
    second: string;
    commentbegin: string;
    commentprefix: string;
    commentend: string;
    datetime: string;
    datetime24h: string;
    now: string;
    now24h: string;
    filepath: string;
    parentpath: string;
    repository: string;
    repositoryurl: string;
    author: string;
    email: string;
    package: string;
}

export function insertFileHeaderComment(
    textEditor: vscode.TextEditor,
    picked_template?: string
): void {
    if (!textEditor) {
        return;
    }

    const workspace = vscode.workspace;
    //const textEditor = vscode.window.activeTextEditor;
    const prefix = "fileHeaderComment";
    const lang_id = textEditor?.document.languageId || "";
    let t_default = workspace.getConfiguration(prefix + ".template").get("*");
    let r_default = workspace
        .getConfiguration(prefix + ".parameter")
        .get("*") as Record<string, any>;
    const r_lang = workspace
        .getConfiguration(prefix + ".parameter")
        .get(lang_id) as Record<string, any>;
    let template: string[] = [];

    if (picked_template) {
        t_default = workspace
            .getConfiguration(prefix + ".template")
            .get(picked_template);
        const tmp_r_default = workspace
            .getConfiguration(prefix + ".parameter")
            .get(picked_template) as Record<string, any>;
        if (tmp_r_default instanceof Object) {
            r_default = { ...r_default, ...tmp_r_default };
        }
    }

    if (t_default instanceof Array) {
        template = t_default;
    } else {
        template = [
            "${commentbegin}",
            "${commentprefix} Created on ${date}",
            "${commentprefix}",
            "${commentprefix} Copyright (c) ${year} ${company}",
            "${commentend}",
        ];
    }

    const date = new Date();
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    const s = date.getSeconds().toString().padStart(2, "0");

    const path = textEditor?.document.uri.path || "";
    const parentPath = path.split("/").slice(0, -1).join("/");
    const exec_options = { encoding: "utf8", cwd: parentPath };

    let gitUserName = "";
    try {
        const gitConfig = require("child_process").execSync(
            "git config user.name",
            exec_options
        );
        gitUserName = gitConfig.trim();
    } catch (error) { }

    let gitUserEmail = "";
    try {
        const gitConfig = require("child_process").execSync(
            "git config user.email",
            exec_options
        );
        gitUserEmail = gitConfig.trim();
    } catch (error) { }

    let gitRepository = "";
    let gitRepositoryUrl = "";
    try {
        const gitConfig = require("child_process").execSync(
            "git config remote.origin.url",
            exec_options
        );
        gitRepositoryUrl = gitConfig?.trim() || "";
        if (gitRepositoryUrl.length > 0) {
            gitRepository = gitRepositoryUrl.split("/").pop()?.split(".")[0] || "";
        }
    } catch (error) {
    }

    let packageName = "";
    try {
        const packageJson = require("child_process").execSync("npm ls --json", exec_options);
        packageName = JSON.parse(packageJson)?.name || "";
    } catch (error) {
    }

    if (packageName === "") {
        try {
            const cargoToml = require("child_process").execSync(
                "cargo metadata --format-version 1 --no-deps",
                exec_options
            );
            packageName = JSON.parse(cargoToml).packages[0].name;
        } catch (error) { }
    }

    let replace: ReplaceObject = {
        date: date.toDateString(),
        time: date.toLocaleTimeString(),
        time24h: `${h}:${m}:${s}`,
        day: date.getDate().toString(),
        month: (date.getMonth() + 1).toString(),
        year: date.getFullYear().toString(),
        company: "Your Company",
        filename: textEditor?.document.fileName.replace(/^.*[\\\/]/, "") || "",
        hour: h,
        minute: m,
        second: s,
        commentbegin: "/*",
        commentprefix: " *",
        commentend: " */",
        datetime: "",
        datetime24h: "",
        now: "",
        now24h: "",
        filepath: path,
        parentpath: parentPath,
        repository: gitRepository,
        repositoryurl: gitRepositoryUrl,
        author: gitUserName,
        email: gitUserEmail,
        package: packageName,
    };

    replace.datetime = `${replace.date} ${replace.time}`;
    replace.datetime24h = `${replace.date} ${replace.time24h}`;
    replace.now = replace.datetime;
    replace.now24h = replace.datetime24h;
    replace = { ...replace, ...r_default };

    switch (lang_id) {
        case "swift":
            replace.commentbegin = "/**";
            break;
        case "lua":
            Object.assign(replace, {
                commentbegin: "--[[",
                commentprefix: "--",
                commentend: "--]]",
            });
            break;
        case "perl":
        case "ruby":
        case "shellscript":
        case "yaml":
        case "python":
            Object.assign(replace, {
                commentbegin: "#",
                commentprefix: "#",
                commentend: "#",
            });
            break;
        case "vb":
            Object.assign(replace, {
                commentbegin: "'",
                commentprefix: "'",
                commentend: "'",
            });
            break;
        case "clojure":
            Object.assign(replace, {
                commentbegin: ";;",
                commentprefix: ";",
                commentend: ";;",
            });
            break;
        case "xml":
        case "html":
        case "svelte":
            Object.assign(replace, {
                commentbegin: "<!--",
                commentprefix: "",
                commentend: "-->",
            });
            break;
    }

    replace = { ...replace, ...r_lang };

    const escape = (string: string): string => {
        return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
    };

    let s_template = template.join("\n");
    for (const r in replace) {
        const regexp = new RegExp(escape("${" + r + "}"), "gi");
        let replace_with = replace[r];
        if (Array.isArray(replace_with)) {
            replace_with = replace_with.join("\n" + replace.commentprefix);
        } else if (typeof replace_with === "string") {
            replace_with = replace_with.replace("\n", "\n" + replace.commentprefix);
        }
        if (replace_with.startsWith("${env:") && replace_with.endsWith("}")) {
            const envName = replace_with.slice(6, -1).trim();
            replace_with = process.env[envName] || "";
        }
        s_template = s_template.replace(regexp, replace_with as string);
    }

    // Parse one more time for nested parameters
    for (const r in replace) {
        const regexp = new RegExp(escape("${" + r + "}"), "gi");
        const replace_with = replace[r];
        s_template = s_template.replace(regexp, replace_with as string);
    }

    textEditor.edit((edit: vscode.TextEditorEdit) => {
        edit.insert(textEditor.selection.active, s_template + "\n");
    });
}

export function insertFileHeaderCommentOther(
    textEditor: vscode.TextEditor
): void {
    const workspace = vscode.workspace;
    const prefix = "fileHeaderComment";
    const t_others = workspace.getConfiguration(prefix + ".template");
    const template_list = Object.keys(t_others);

    if (template_list.length === 0) {
        template_list.push("*");
    } else if (template_list.indexOf("*") === -1) {
        template_list.splice(0, 0, "*");
    }

    vscode.window
        .showQuickPick(template_list, { placeHolder: "Choose template" })
        .then((val: string | undefined) => {
            if (val) {
                insertFileHeaderComment(textEditor, val);
            }
        });
}
