import {TestBed} from '@angular/core/testing'

import {InstitutionenService} from '../zsb-institutions/institutionen.service'

describe('InstitutionenService', () => {
  let service: InstitutionenService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(InstitutionenService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
