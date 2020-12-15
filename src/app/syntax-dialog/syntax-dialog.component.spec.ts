import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyntaxDialogComponent } from './syntax-dialog.component';

describe('SyntaxDialogComponent', () => {
  let component: SyntaxDialogComponent;
  let fixture: ComponentFixture<SyntaxDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyntaxDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyntaxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
