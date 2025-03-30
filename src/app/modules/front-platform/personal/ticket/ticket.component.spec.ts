import {
    ComponentFixture, TestBed
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { TicketRepositoryService } from "@app/core/api/middleware/ticket/ticket-repository.service";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import { of } from "rxjs";

import { TicketComponent } from "./ticket.component";

describe("TicketComponent", () => {
    let component: TicketComponent;
    let fixture: ComponentFixture<TicketComponent>;
    const ticketRepositoryServiceMock = jasmine.createSpyObj("ticketRepositoryService", ["getPersonalTicketList", "getOrderLink"]);
    const usetStoreApiMock = jasmine.createSpyObj("UserStoreService", ["getUserData"]);
    const sweetAlertService = jasmine.createSpyObj("SweetAlertService", ["open"]);
    const routerMock = jasmine.createSpyObj("Router", ["navigate"]);
    const userDataMock = {
        userNo: 123456,
        name: "xxxx",
        email: "xxxx@gmail.com",
        countyCode: "xxx",
        districtCode: "xxx",
        postalCode: "xxx",
        address: "xxxxx",
        sexCode: "001",
        birthday: "2024-11-12"
    };

    const personalTicketListMock = {
        totalPage: 5,
        pageIndex: 1,
        pageSize: 10,
        result: [
            {
                movieName: "xxx",
                ticketDate: "2025-11-25T11:10",
                ticketLanguageName: "123",
                ticketPersonalItem: [{
                    ticketCategoryName: "123",
                    ticketColumn: 13,
                    ticketSeat: 13,
                    ticketMoney: 150
                }],
                ticketStatusName: "未付款",
                ticketStatusId: 1,
                createOrderId: "XXX123456"
            }
        ]
    };

    usetStoreApiMock.getUserData.and.returnValue(of(userDataMock));
    ticketRepositoryServiceMock.getPersonalTicketList.and.returnValue(of({ result: personalTicketListMock }));
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TicketComponent],
            providers: [
                { provide: ActivatedRoute, useValue: { queryParams: of({ page: 2 }) } },
                { provide: Router, useValue: routerMock },
                { provide: TicketRepositoryService, useValue: ticketRepositoryServiceMock },
                { provide: UserStoreService, useValue: usetStoreApiMock },
                { provide: SweetAlertService, useValue: sweetAlertService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TicketComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("取得使用者代號", () => {
        component.ngOnInit();
        expect(component.userNo).toBe(123456);
    });

    it("取得個人票卷", () => {
        component.ngOnInit();
        fixture.detectChanges();
        const param = {
            userNo: 123456,
            pageIndex: 1,
            pageSize: 10
        };
        expect(ticketRepositoryServiceMock.getPersonalTicketList).toHaveBeenCalledWith(param);
        expect(component.ticketPersonalList).toEqual(personalTicketListMock.result);
    });

    it("pager元件是否正確接收total", () => {
        component.total = 100;
        fixture.detectChanges();
        const div = fixture.debugElement.query(By.css("app-pager")).componentInstance;
        expect(div.total).toBe(100);
    });

    it("pager元件改變分頁", () => {
        component.total = 100;
        fixture.detectChanges();
        spyOn(component, "changePageEmitter");
        const div = fixture.debugElement.query(By.css("app-pager")).componentInstance;
        div.changePage(3);
        expect(component.changePageEmitter).toHaveBeenCalledWith(3);
    });

    it("改變分頁", () => {
        component.changePageEmitter(3);

        expect(routerMock.navigate).toHaveBeenCalledWith(["./"], {
            relativeTo: component.route,
            queryParams: {
                page: 3
            }
        });

        expect(ticketRepositoryServiceMock.getPersonalTicketList).toHaveBeenCalled();
    });
});
