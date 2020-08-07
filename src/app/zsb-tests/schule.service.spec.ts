import {TestBed} from '@angular/core/testing';

import {SchuleService} from '../shared/schule.service';

describe('SchuleService', () => {
  let service: SchuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
