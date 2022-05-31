import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare var monaco: any;

@Injectable({
  providedIn: 'root',
})
export class MonacoEditorService {
  //loaded: boolean = false;
  //public loadingFinished: Subject<void> = new Subject<void>();

  public ready = new EventEmitter<boolean>();

  private loaded = false

  constructor() {
    this.load(() => {
      this.customConfig(); // load custom language and theme
      this.ready.emit(true)
      this.ready.complete()
    });
  }

  public load(finishLoading) {
    // load the assets

    const baseUrl = './assets' + '/monaco-editor/min/vs';

    if (typeof (<any>window).monaco === 'object') {
      finishLoading();
      return;
    }

    const onGotAmdLoader: any = () => {
      // load Monaco
      (<any>window).require.config({ paths: { vs: `${baseUrl}` } });
      (<any>window).require([`vs/editor/editor.main`], () => {
        finishLoading();
      });
    };

    // load AMD loader, if necessary
    if (!(<any>window).require) {
      const loaderScript: HTMLScriptElement = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = `${baseUrl}/loader.js`;
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }

  customConfig(){
    monaco.languages.register({ id: 'Micro16' });

        // Register a tokens provider for the language
        monaco.languages.setMonarchTokensProvider('Micro16', {
          tokenizer: {
            root: [
              [/R[0-9]+/, 'register'],
              [/MBR/, 'register'],
              [/MAR/, 'register'],
              [/MIC/, 'register'],
              [/MIR/, 'register'],
              [/PC/, 'register'],
              [/AC/, 'register'],
              [/[0-9]+/, 'number'],
              [/<-/, 'assign'],
              [/while/, 'keyword'],
              [/if/, 'keyword'],
              [/#[\s\S]*/, 'comment'],
            ],
          },
        });

        // Define a new theme that contains only rules that match this language
        monaco.editor.defineTheme('Micro16Theme', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: 'register', foreground: '9CDCFE', fontStyle: 'bold' },
          ],
          colors: {
            'editor.foreground': '#d4d4d4'
          }
        });

        // Register a completion item provider for the new language
        monaco.languages.registerCompletionItemProvider('Micro16', {
          provideCompletionItems: () => {
            var suggestions = [
              {
                label: 'MBR',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'MBR',
              },
              {
                label: 'MAR',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'MAR',
              },
              {
                label: 'MIC',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'MIC',
              },
              {
                label: 'MIR',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'MIR',
              },
              {
                label: 'PC',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'PC',
              },
              {
                label: 'AC',
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: 'AC',
              },
              {
                label: 'if',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: ['if ${1:condition} {', '\t$0', '}'].join('\n'),
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'If Statement',
              },
              {
                label: 'while',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: ['while ${1:condition} {', '\t$0', '}'].join('\n'),
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'while loop',
              },
            ];
            return { suggestions: suggestions };
          },
        });
  }
}
