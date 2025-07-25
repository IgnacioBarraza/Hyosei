import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Evaluate } from './evaluate';

describe('Evaluate', () => {
  let component: Evaluate;
  let fixture: ComponentFixture<Evaluate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Evaluate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Evaluate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
