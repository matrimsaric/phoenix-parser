import { TestBed, inject } from '@angular/core/testing';

import { SourceService } from './source.service';

describe('SourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SourceService]
    });
  });

  it('should ...', inject([SourceService], (service: SourceService) => {
    expect(service).toBeTruthy();
  }));
});
