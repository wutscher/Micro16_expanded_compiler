import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorComponent } from './editor/editor.component';
import { HttpClientModule } from '@angular/common/http';

// Material Form Controls
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// Material Navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
// Material Layout
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
// Material Buttons & Indicators
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
// Material Popups & Modals
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
// Material Data tables
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { SyntaxDialogComponent } from './syntax-dialog/syntax-dialog.component';

declare const monaco: any;

const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad() {
    // Register a new language
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
          [/#[\s\S]*/, "comment"]
        ],
      },
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme('Micro16Theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'register', foreground: '9CDCFE', fontStyle: 'bold' }
      ]
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

    // monaco.editor.create(document.getElementById('container'), {
    //   theme: 'Micro16Theme',
    //   value: getCode(),
    //   language: 'Micro16',
    // });
  },
};

@NgModule({
  declarations: [AppComponent, EditorComponent, SyntaxDialogComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MonacoEditorModule.forRoot(monacoConfig),
    HttpClientModule,
    
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
