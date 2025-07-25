import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSection } from './schedule-section';

describe('ScheduleSection', () => {
  let component: ScheduleSection;
  let fixture: ComponentFixture<ScheduleSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
