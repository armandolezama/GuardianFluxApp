import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorShell } from './monitor-shell';

describe('MonitorShell', () => {
  let component: MonitorShell;
  let fixture: ComponentFixture<MonitorShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitorShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
