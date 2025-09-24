import { TestBed } from '@angular/core/testing';

import { AdobeSDGService } from './adobesdg.service';

describe('AnalyticsService', () => {
    let service: AdobeSDGService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AdobeSDGService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
