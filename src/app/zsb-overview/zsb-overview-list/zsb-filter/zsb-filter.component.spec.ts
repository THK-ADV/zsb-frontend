import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZsbFilterComponent } from './zsb-filter.component';

describe('ZsbFilterComponent', () => {
  let component: ZsbFilterComponent;
  let fixture: ComponentFixture<ZsbFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZsbFilterComponent]
    });
    fixture = TestBed.createComponent(ZsbFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
