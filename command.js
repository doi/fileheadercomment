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

var vscode = require('vscode'),
    os = require('os'),
    exec_sync = require("child_process").execSync

// run shell command and get last line
function run_shell_command(command){
    var output = ""
    try{
        output = exec_sync(command, {encoding: 'utf8', cwd: vscode.window.activeTextEditor.document.fileName.split("/").slice(0,-1).join("/")});
        if(output){
            // take the last line of the output, trim it, and limit to 255 characters
            output = (output.trim().split("\n").pop()+"").trim().substring(0, 255)
        }
    }catch(e){
    }
    return output
}

//https://www.w3resource.com/javascript-exercises/javascript-date-exercise-24.php
Date.prototype.ISO8601_week_number = function(){
    var tdt = new Date(this.valueOf()),
        dayn = (this.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    var firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4){
        tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

function get_all_variables(is_all){
    var workspace = vscode.workspace,
        editor = vscode.window.activeTextEditor,
        prefix = 'fileHeaderComment',
        lang_id = editor.document.languageId,
        r_lang = workspace.getConfiguration(prefix+".parameter").get(lang_id),
        r_default = workspace.getConfiguration(prefix+".parameter").get('*');
    
    var date = new Date(),
        h = (date.getHours()+"").padStart(2, '0'),
        m = (date.getMinutes()+"").padStart(2, '0'),
        s = (date.getSeconds()+"").padStart(2, '0'),
        username = os.userInfo().username,
        replace = {
            'date': date.toDateString(),
            'time': date.toLocaleTimeString(),
            'time24h': h+':'+m+':'+s,
            'day': date.getDate(),
            'month': date.getMonth()+1,
			'month3': date.toLocaleString('en-us', {month:'short'}),
            'year': date.getFullYear(),
            'company': 'Your Company',
            'filename': vscode.window.activeTextEditor.document.fileName.replace(/^.*[\\\/]/, ''),
            'workspacename': vscode.workspace.name,
            'hour': h,
            'minute': m,
            'second': s,
            'weeknumber': date.ISO8601_week_number(),
            'yearshort': (date.getFullYear()+"").slice(-2),
            username,
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
    Object.assign(replace, JSON.parse(JSON.stringify(r_default)));

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
        case "shellscript":
        case "yaml":
        case "cmake":
        case "python":
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
        case "xml":
        case "html":
            Object.assign(replace, {
                'commentbegin': "<!--",
                'commentprefix': "",
                'commentend': "-->"
            });
            break;
    }
    Object.assign(replace, r_lang);

    for(var r_key in replace){
        var r_val = replace[r_key]+""
        // find cmd() syntax and replace it with the output (last line) of the command
        if(r_val && r_val.indexOf("cmd(") === 0){
            var shell_command = r_val.match(/^cmd\((.+?)\)$/);
            if(shell_command && shell_command[1]){
                replace[r_key] = run_shell_command(shell_command[1]);
            }
        }
        if(!is_all && Array.isArray(replace[r_key])){
            // take out if array
            delete replace[r_key];
        }
    }
    return JSON.parse(JSON.stringify(replace));
}

function insertFileHeaderComment(picked_template){
    var workspace = vscode.workspace,
        editor = vscode.window.activeTextEditor,
        // root = workspace.rootPath,
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
    var replace = get_all_variables(true);

    if(!editor)
        return;

    var s_template = template.join("\n"),
        escape = function(string) {
            return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
        };
    for(var r_key in replace){
        var regexp = new RegExp(escape("${"+r_key+"}"), "gi"),
            replace_with = replace[r_key];
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

exports.printAllParameters = function(){
    var editor = vscode.window.activeTextEditor;
    editor.edit(function(edit){
        var unordered = get_all_variables(),
            ordered = {};
        Object.keys(unordered).sort().forEach(function(key) {
          ordered[key] = unordered[key];
        });
        var output = []
        output.push(ordered['commentbegin']);
        output.push(ordered['commentprefix']+" Available parameters:");
        for(var key in ordered){
            if(['commentbegin', 'commentprefix', 'commentend'].indexOf(key) !== -1){
                continue;
            }
            output.push(ordered['commentprefix']+" "+key+": "+ordered[key]);
        }
        output.push(ordered['commentend']);
        // edit.insert(editor.selection.active, JSON.stringify(ordered, null, 2)+"\n");
        edit.insert(editor.selection.active, output.join("\n")+"\n");
    });
};
