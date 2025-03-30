import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
    ActivatedRoute, convertToParamMap, provideRouter,
    Router
} from "@angular/router";
import { TicketRepositoryService } from "@app/core/api/middleware/ticket/ticket-repository.service";
import { of } from "rxjs";

import { PayPalSuccessComponent } from "./pay-pal-success.component";

describe("PayPalSuccessComponent", () => {
    let component: PayPalSuccessComponent;
    let fixture: ComponentFixture<PayPalSuccessComponent>;

    const ticketRepositoryServiceMock = jasmine.createSpyObj("ticketRepositoryService", ["getOrderDetail"]);
    ticketRepositoryServiceMock.getOrderDetail.and.returnValue(of({
        result: {
            orderId: "123",
            status: "456",
            amount: "789",
            createTime: "2025-11-07T11:30",
            link: "xxxxxxx"
        }
    }));
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PayPalSuccessComponent],
            providers: [
                provideRouter([]),
                { provide: TicketRepositoryService, useValue: ticketRepositoryServiceMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: convertToParamMap({ token: "123" })
                        }
                    }
                },
                { provide: Router, useValue: { navigateByUrl: jasmine.createSpy("navigateByUrl") } }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PayPalSuccessComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("從網址取到token", () => {
        const route = TestBed.inject(ActivatedRoute);
        expect(route.snapshot.queryParamMap.get("token")).toBe("123");
    });

    it("從網址取到token", () => {
        expect(component.orderDetail).toEqual({
            orderId: "123",
            status: "456",
            amount: "789",
            createTime: "2025-11-07T11:30",
            link: "xxxxxxx"
        });
    });

    it("前往訂單頁", () => {
        component.navigateNoBack("/personal/ticket");

        expect(router.navigateByUrl).toHaveBeenCalledWith("/personal/ticket", { replaceUrl: true });
    });
});
