import { TestBed } from "@angular/core/testing";

import { GlightboxService } from "./glightbox.service";

describe("GlightboxService", () => {
    let service: GlightboxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GlightboxService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
