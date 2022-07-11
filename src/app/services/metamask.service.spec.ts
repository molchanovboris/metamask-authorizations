import { TestBed } from '@angular/core/testing';

import { MetaMaskService } from './metamask.service';

describe('MetamaskService', () => {
  let service: MetaMaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetaMaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
