var vscode = require('vscode');

function insertFileHeaderComment(){
    var workspace = vscode.workspace,
        editor = vscode.window.activeTextEditor,
        root = workspace.rootPath,
        prefix = 'fileHeaderComment',
        template = workspace.getConfiguration(prefix+'.template'),
        r_default = workspace.getConfiguration(prefix+".language.*"),
        lang_id = editor.document.languageId,
        r_lang = workspace.getConfiguration(prefix+".language."+lang_id);

    if(!(template instanceof Array)){
        template = [
            "${commentbegin}",
            "${commentprefix} Created on ${date}",
            "${commentprefix}",
            "${commentprefix} Copyright (c) ${year} - ${company}",
            "${commentend}"
        ];
    }
    var date = new Date(),
        replace = {
            'commentbegin': '/*',
            'commentprefix': ' *',
            'commentend': ' */',
            'date': date.toDateString(),
            'time': date.toLocaleTimeString(),
            'year': date.getFullYear(),
            'company': 'Your Company'
        };
    replace.now = replace.date+ " "+replace.time;

    replace = Object.assign(replace, r_default);
    replace = Object.assign(replace, r_lang);

    if(!editor)
        return;
    replace = JSON.parse(JSON.stringify(replace));
    var s_template = template.join("\n"),
        escape = function(string) {
            return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
        };
    for(var r in replace){
        var regexp = new RegExp(escape("${"+r+"}"), "gi");
        s_template = s_template.replace(regexp, replace[r]);
    }

    //insert header comment at cursor
    editor.edit(function(edit){
        edit.insert(editor.selection.active, s_template);
    });
}
exports.insertFileHeaderComment = insertFileHeaderComment;