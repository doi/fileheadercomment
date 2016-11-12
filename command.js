/*
 * Created on Sun Aug 07 2016
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Donna Iwan Setiawan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var vscode = require('vscode');

function insertFileHeaderComment(picked_template){
    var workspace = vscode.workspace,
        editor = vscode.window.activeTextEditor,
        root = workspace.rootPath,
        prefix = 'fileHeaderComment',
        lang_id = editor.document.languageId,
        t_default = workspace.getConfiguration(prefix+".template").get('*'),
        // t_lang = workspace.getConfiguration(prefix+".template".get(lang_id),
        r_default = workspace.getConfiguration(prefix+".parameter").get('*'),
        r_lang = workspace.getConfiguration(prefix+".parameter").get(lang_id),
        template = [];
    if(picked_template){
        t_default = workspace.getConfiguration(prefix+".template").get(picked_template);
        var tmp_r_default = workspace.getConfiguration(prefix+".parameter").get(picked_template);
        if(tmp_r_default instanceof Object){
            Object.assign(r_default, tmp_r_default);
        }
    }

    //remove feature template detection per language
    //this feature is replaced by "select from available templates"
    // if((t_lang instanceof Array)){
    //     template = t_lang;
    // }else
    if(t_default instanceof Array){
        template = t_default;
    }else{
        template = [
            "${commentbegin}",
            "${commentprefix} Created on ${date}",
            "${commentprefix}",
            "${commentprefix} Copyright (c) ${year} ${company}",
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
    Object.assign(replace, r_default);
    
    switch(lang_id){
        case "swift":
            replace.commentbegin = "/**";
            break;
        case "lua":
            Object.assign(replace, {
                'commentbegin': "--[[",
                'commentprefix': "--",
                'commentend': "--]]"
            });
            break;
        case "perl":
        case "ruby":
            Object.assign(replace, {
                'commentbegin': "#",
                'commentprefix': "#",
                'commentend': "#"
            });
            break;
        case "vb":
            Object.assign(replace, {
                'commentbegin': "'",
                'commentprefix': "'",
                'commentend': "'"
            });
            break;
        case 'clojure':
            Object.assign(replace, {
                'commentbegin': ";;",
                'commentprefix': ";",
                'commentend': ";;"
            });
            break;
        case 'python':
            Object.assign(replace, {
                'commentbegin': "'''",
                'commentprefix': "\b",
                'commentend': "'''"
            });
            break;
        case "xml":
        case "html":
            Object.assign(replace, {
                'commentbegin': "<!--",
                'commentprefix': "\b",
                'commentend': "-->"
            });
            break;
    }
    Object.assign(replace, r_lang);

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

    //parse one more time
    //sometimes parameter has parameter inside it
    for(var r in replace){
        var regexp = new RegExp(escape("${"+r+"}"), "gi"),
            replace_with = replace[r];
        s_template = s_template.replace(regexp, replace_with);
    }

    //insert header comment at cursor
    editor.edit(function(edit){
        edit.insert(editor.selection.active, s_template+"\n");
    });
}
exports.insertFileHeaderComment = insertFileHeaderComment;
function insertFileHeaderCommentOther(){
    var workspace = vscode.workspace,
        prefix = 'fileHeaderComment',
        t_others = workspace.getConfiguration(prefix+".template");

    t_others = JSON.parse(JSON.stringify(t_others));
    var template_list = Object.keys(t_others);

    if(template_list.length == 0){
        template_list.push("*");
    }else if(template_list.indexOf("*") == -1){
        template_list.splice(0, 0, "*");
    }
    vscode.window.showQuickPick(template_list,{placeHolder: "Choose template"})
        .then(function(val){
            insertFileHeaderComment(val);
        });
}
exports.insertFileHeaderCommentOther = insertFileHeaderCommentOther;