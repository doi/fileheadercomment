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
            'date': date.toDateString(),
            'time': date.toLocaleTimeString(),
            'time24h': date.getHours()+':'+date.getMinutes()+':'+date.getSeconds(),
            'year': date.getFullYear(),
            'company': 'Your Company'
        };
    
    replace = Object.assign(replace, {
        'commentbegin': '/*',
        'commentprefix': ' *',
        'commentend': ' */',
        'datetime': replace.date+ " "+replace.time,
        'datetime24h': replace.date+ " "+replace.time24h
    });
    replace.now = replace.datetime;
    replace.now24h = replace.datetime24h;
    replace = Object.assign(replace, r_default);
    
    switch(lang_id){
        case "swift":
            replace.commentbegin = "/**";
            break;
        case "lua":
            replace = Object.assign(replace, {
                'commentbegin': "--[[",
                'commentprefix': "--",
                'commentend': "--]]"
            });
            break;
        case "perl":
        case "ruby":
            replace = Object.assign(replace, {
                'commentbegin': "#",
                'commentprefix': "#",
                'commentend': "#"
            });
            break;
        case "vb":
            replace = Object.assign(replace, {
                'commentbegin': "'",
                'commentprefix': "'",
                'commentend': "'"
            });
            break;
        case 'clojure':
            replace = Object.assign(replace, {
                'commentbegin': ";;",
                'commentprefix': ";",
                'commentend': ";;"
            });
            break;
        case 'python':
            replace = Object.assign(replace, {
                'commentbegin': "'''",
                'commentprefix': "\b",
                'commentend': "'''"
            });
            break;
        case "xml":
        case "html":
            replace = Object.assign(replace, {
                'commentbegin': "<!--",
                'commentprefix': "\b",
                'commentend': "-->"
            });
            break;
    }
    replace = Object.assign(replace, r_lang);

    if(!editor)
        return;
    replace = JSON.parse(JSON.stringify(replace));
    var s_template = template.join("\n"),
        escape = function(string) {
            return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
        };
    for(var r in replace){
        var regexp = new RegExp(escape("${"+r+"}"), "gi"),
            replace_with = replace[r];
        if(replace_with.join){
            replace_with = replace_with.join("\n"+ replace.commentprefix);
        }else if(replace_with.replace){
            replace_with = replace_with.replace("\n", "\n"+ replace.commentprefix);
        }

        s_template = s_template.replace(regexp, replace_with);
    }

    //insert header comment at cursor
    editor.edit(function(edit){
        edit.insert(editor.selection.active, s_template+"\n");
    });
}
exports.insertFileHeaderComment = insertFileHeaderComment;