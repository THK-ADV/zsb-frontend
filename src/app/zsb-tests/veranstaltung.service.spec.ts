import {TestBed} from '@angular/core/testing';

import {VeranstaltungService} from '../shared/veranstaltung.service';

describe('VeranstaltungService', () => {
  let service: VeranstaltungService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VeranstaltungService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
