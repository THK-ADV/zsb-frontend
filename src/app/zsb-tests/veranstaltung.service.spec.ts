import {TestBed} from '@angular/core/testing'

import {EventService} from '../shared/event.service'

describe('VeranstaltungService', () => {
  let service: EventService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(EventService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
