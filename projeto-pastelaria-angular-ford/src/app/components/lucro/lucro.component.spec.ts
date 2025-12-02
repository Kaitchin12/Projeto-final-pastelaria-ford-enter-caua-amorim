import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LucroComponent } from './lucro.component';

describe('LucroComponent', () => {
  let component: LucroComponent;
  let fixture: ComponentFixture<LucroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LucroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LucroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
