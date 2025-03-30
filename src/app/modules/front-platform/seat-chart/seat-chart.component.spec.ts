import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SeatChartComponent } from "./seat-chart.component";

describe("SeatChartComponent", () => {
    let component: SeatChartComponent;
    let fixture: ComponentFixture<SeatChartComponent>;

    const submitTicket = jasmine.createSpyObj("EventEmitter", ["emit"]);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SeatChartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SeatChartComponent);
        component = fixture.componentInstance;
        component.submitTicket = submitTicket;
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("init座位表，走道是否為disable", () => {
        component.initSeatNo();
        expect(component.seatChart[4].seat).toEqual(null);
        expect(component.seatChart[5].seat).toEqual(null);
        expect(component.seatChart[15].seat).toEqual(null);
        expect(component.seatChart[16].seat).toEqual(null);
    });

    it("計算有幾個位子", () => {
        component.ticketCategory = [
            {
                categoryCode: "001",
                categoryName: "123",
                cost: 150,
                count: 1
            },
            {
                categoryCode: "002",
                categoryName: "123",
                cost: 150,
                count: 1
            }
        ];
        expect(component.seatCount).toBe(2);
    });

    it("無法選取的座位", () => {
        component.disableSeatSeat = [
            {
                column: 1,
                seat: 10
            },
            {
                column: 1,
                seat: 11
            }
        ];
        component.initSeatNo();
        expect(component.seatChart[11].state.disableSeat).toBe(true);
        expect(component.seatChart[12].state.disableSeat).toBe(true);
    });

    it("手動選取座位", () => {
        component.ticketCategory = [
            {
                categoryCode: "001",
                categoryName: "123",
                cost: 150,
                count: 1
            }
        ];
        component.changeSeat(10);
        expect(component.seatChart[10].state.isSelect).toBe(true);
    });

    it("手動取消座位", () => {
        component.ticketCategory = [
            {
                categoryCode: "001",
                categoryName: "123",
                cost: 150,
                count: 1
            }
        ];

        component.seatChart[10].state.isSelect = true;
        component.changeSeat(10);
        expect(component.seatChart[10].state.isSelect).toBe(false);
    });

    it("送出選取座位", () => {
        component.ticketCategory = [
            {
                categoryCode: "001",
                categoryName: "123",
                cost: 150,
                count: 1
            }
        ];
        component.changeSeat(10);
        component.submitSeat();
        expect(submitTicket.emit).toHaveBeenCalled();
    });
});
