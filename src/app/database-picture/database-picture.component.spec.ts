import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabasePictureComponent } from './database-picture.component';

describe('DatabasePictureComponent', () => {
  let component: DatabasePictureComponent;
  let fixture: ComponentFixture<DatabasePictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabasePictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabasePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
