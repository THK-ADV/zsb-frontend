import {TestBed} from '@angular/core/testing';

import {SchoolService} from '../shared/school.service';

describe('SchuleService', () => {
  let service: SchoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
