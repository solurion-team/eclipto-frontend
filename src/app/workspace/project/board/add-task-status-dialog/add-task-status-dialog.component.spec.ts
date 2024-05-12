import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskStatusDialogComponent } from './add-task-status-dialog.component';

describe('AddTaskStatusDialogComponent', () => {
  let component: AddTaskStatusDialogComponent;
  let fixture: ComponentFixture<AddTaskStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskStatusDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTaskStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
