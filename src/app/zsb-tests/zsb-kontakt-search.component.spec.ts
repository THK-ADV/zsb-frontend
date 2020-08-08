import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ZsbKontaktSearchComponent} from '../zsb-kontakt/zsb-kontakt-search/zsb-kontakt-search.component';

describe('ZsbKontaktSearchComponent', () => {
  let component: ZsbKontaktSearchComponent;
  let fixture: ComponentFixture<ZsbKontaktSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZsbKontaktSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZsbKontaktSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
