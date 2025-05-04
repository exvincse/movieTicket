import {
    ComponentRef
} from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Subject } from "rxjs";

import { SweetAlertComponent } from "../sweet-alert.component";
import { SweetAlertService } from "./sweet-alert.service";

describe("SweetAlertService", () => {
    let service: SweetAlertService;
    let mockComponentRef: ComponentRef<SweetAlertComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SweetAlertService]
        });

        service = TestBed.inject(SweetAlertService);

        mockComponentRef = {
            instance: {
                afterClose: new Subject<any>(),
                slotTemplate: null,
                slotInjector: null
            },
            hostView: {
                rootNodes: [{}],
                detachFromAppRef: jasmine.createSpy("detachFromAppRef")
            },
            destroy: jasmine.createSpy("destroy")
        } as unknown as ComponentRef<SweetAlertComponent>;

        spyOn(service, "create").and.returnValue(mockComponentRef);

        spyOn(document.body, "appendChild");
    });

    it("建立service", () => {
        expect(service).toBeTruthy();
    });

    it("加載元件到全域範圍", () => {
        mockComponentRef.instance.afterClose.subscribe((res: any) => {
            expect(res).toBeTrue();
        });

        const dummyComponent = {} as any;
        service.open(dummyComponent, { icon: "success" });
        mockComponentRef.instance.afterClose.next(true);
        expect(service.create).toHaveBeenCalledWith(dummyComponent, { icon: "success", confirmButtonText: "關閉", data: undefined });
    });

    it("銷毀元件", () => {
        const dummyComponent = {} as any;
        service.open(dummyComponent, { icon: "success" });
        (service as any).componentRef = mockComponentRef;
        service.destory();

        expect(mockComponentRef.destroy).toHaveBeenCalled();
    });
});
