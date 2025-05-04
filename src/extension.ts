import * as vscode from 'vscode';
import { insertFileHeaderComment, insertFileHeaderCommentOther } from './command';

export function activate(context: vscode.ExtensionContext) {
    // Register the command for inserting default template
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.insertFileHeaderComment', (textEditor: vscode.TextEditor) => {
        insertFileHeaderComment(textEditor);
    }));

    // Register the command for selecting from available templates
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('extension.insertFileHeaderCommentOther', (textEditor: vscode.TextEditor) => {
            insertFileHeaderCommentOther(textEditor);
        })
    );

    // Register the command for inserting default template from a contextmenu
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('extension.insertFileHeaderCommentMenu', (textEditor: vscode.TextEditor) => {
        insertFileHeaderComment(textEditor);
    }));

    // Register the command for selecting from available templates from a context menu
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand('extension.insertFileHeaderCommentOtherMenu', (textEditor: vscode.TextEditor) => {
            insertFileHeaderCommentOther(textEditor);
        })
    );
}

export function deactivate() {
    // Clean up resources if needed
} 