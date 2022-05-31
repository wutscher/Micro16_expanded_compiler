import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MonacoEditorService } from '../shared/monaco-editor.service';

declare var monaco: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnChanges {

  @Input()
  content: string;

  @Output()
  contentChange = new EventEmitter<string>();

  @Output()
  onInit = new EventEmitter<string>();

  options = {theme: 'Micro16Theme', language: 'Micro16', automaticLayout: true};

  constructor(private monacoEditorService: MonacoEditorService){
    this.monacoEditorService.ready.subscribe({
      complete: ()=>{
        this.initMonaco()
      }
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this._editor){
      this._editor.getModel().setValue(changes.content.currentValue)
    }
  }

  ngOnInit(): void {
  }
  
  public _editor: any;
  @ViewChild('editorContainer', { static: false }) _editorContainer: ElementRef;

  private initMonaco(): void {

    console.log(this._editorContainer)

    this._editor = monaco.editor.create(
      this._editorContainer.nativeElement,
      this.options
    );

    this._editor.getModel().setValue(this.content)
    
    this._editor.getModel().onDidChangeContent((event) => {
      this.contentChange.emit(this._editor.getModel().getValue())
    });

    this._editor.layout();

    this.onInit.emit(this._editor.getModel())
  }

}
