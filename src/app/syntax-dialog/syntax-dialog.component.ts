import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  text: string;
}

@Component({
  selector: 'app-syntax-dialog',
  templateUrl: './syntax-dialog.component.html',
  styleUrls: ['./syntax-dialog.component.scss']
})
export class SyntaxDialogComponent implements OnInit {

  editorOptions = {
    automaticLayout: true,
    theme: 'Micro16Theme',
    language: 'Micro16',
  };

  constructor(public dialogRef: MatDialogRef<SyntaxDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  initEditor(editor) {
    editor.layout();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
