import { TestBed } from '@angular/core/testing';

import { BtcServiceService } from './btc-service.service';

describe('BtcServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BtcServiceService = TestBed.get(BtcServiceService);
    expect(service).toBeTruthy();
  });
});
