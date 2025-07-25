import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Evaluated } from './evaluated';

describe('Evaluated', () => {
  let component: Evaluated;
  let fixture: ComponentFixture<Evaluated>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Evaluated]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Evaluated);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
