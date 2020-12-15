import { TestBed } from '@angular/core/testing';

import { CompilerServiceService } from './compiler-service.service';

describe('CompilerServiceService', () => {
  let service: CompilerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompilerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
