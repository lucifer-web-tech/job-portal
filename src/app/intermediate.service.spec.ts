import { TestBed } from '@angular/core/testing';

import { IntermediateService } from './intermediate.service';

describe('IntermediateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntermediateService = TestBed.get(IntermediateService);
    expect(service).toBeTruthy();
  });
});
