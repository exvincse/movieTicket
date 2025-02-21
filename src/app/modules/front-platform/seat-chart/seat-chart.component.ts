import { CommonModule } from "@angular/common";
import {
    Component, EventEmitter, Input, OnInit, Output
} from "@angular/core";

import { Seat, TicketSelect } from "../../../core/models/entities/ticket/ticket-select.entity";
import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";

/**
 * SeatChartComponent
 */
@Component({
    selector: "app-seat-chart",
    standalone: true,
    imports: [CommonModule, StopPropagationDirective],
    templateUrl: "./seat-chart.component.html",
    styleUrl: "./seat-chart.component.scss"
})
export class SeatChartComponent implements OnInit {
    @Input() ticketSelect!: TicketSelect;
    @Input() disableSeatSeat: Seat[] = [];
    @Output() submitTicket = new EventEmitter<any>();

    seatChartNo: { seat: { no: number | null; disableSeat: boolean, isSelect: boolean }[]; column: number; }[] = [];
    spcialSeat: Seat[] = [];
    selectSeat: { seat: { no: number | null; disableSeat: boolean, isSelect: boolean }; column: number; }[] = [];

    /**
     * on init
     */
    ngOnInit() {
        this.initSeatNo();
    }

    /**
     * 計算有幾個位子
     * @returns 位子
     */
    get seatCount() {
        return this.ticketSelect.ticketCategory.map((item) => item.count).reduce((a, b) => a + b, 0);
    }

    /**
     * initSeatNo
     */
    initSeatNo() {
        const column = 10;
        let maxRowSeat = 17;

        this.spcialSeat = [
            {
                column: 1,
                seat: 4,
            },
            {
                column: 1,
                seat: 5,
            },
            {
                column: 1,
                seat: 15,
            },
            {
                column: 1,
                seat: 16,
            },
            {
                column: 2,
                seat: 4,
            },
            {
                column: 2,
                seat: 5,
            },
            {
                column: 2,
                seat: 15,
            },
            {
                column: 2,
                seat: 16,
            },
            {
                column: 3,
                seat: 4,
            },
            {
                column: 3,
                seat: 5,
            },
            {
                column: 3,
                seat: 15,
            },
            {
                column: 3,
                seat: 16,
            },
            {
                column: 4,
                seat: 4,
            },
            {
                column: 4,
                seat: 5,
            },
            {
                column: 4,
                seat: 15,
            },
            {
                column: 4,
                seat: 16,
            },
            {
                column: 5,
                seat: 4,
            },
            {
                column: 5,
                seat: 5,
            },
            {
                column: 5,
                seat: 15,
            },
            {
                column: 5,
                seat: 16,
            },
            {
                column: 6,
                seat: 4,
            },
            {
                column: 6,
                seat: 5,
            },
            {
                column: 6,
                seat: 15,
            },
            {
                column: 6,
                seat: 16,
            },
            {
                column: 7,
                seat: 4,
            },
            {
                column: 7,
                seat: 5,
            },
            {
                column: 7,
                seat: 15,
            },
            {
                column: 7,
                seat: 16,
            },
            {
                column: 8,
                seat: 4,
            },
            {
                column: 8,
                seat: 5,
            },
            {
                column: 8,
                seat: 15,
            },
            {
                column: 8,
                seat: 16,
            },
            {
                column: 9,
                seat: 4,
            },
            {
                column: 9,
                seat: 5,
            },
            {
                column: 9,
                seat: 15,
            },
            {
                column: 9,
                seat: 16,
            },
        ];

        for (let i = 0; i < column; i += 1) {
            this.seatChartNo.push({
                column: i + 1,
                seat: []
            });

            if (i === column - 1) {
                maxRowSeat = 21;
            }

            for (let j = 1; j <= maxRowSeat; j += 1) {
                this.seatChartNo[i].seat.push({
                    no: j,
                    disableSeat: false,
                    isSelect: false
                });
            }
        }

        this.seatChartNo.forEach((item) => {
            const spcialSeatItem = this.spcialSeat.filter((x) => x.column === item.column);
            if (spcialSeatItem.length > 0) {
                spcialSeatItem.forEach((y) => this.seatChartNo[y.column - 1].seat.splice(y.seat, 0, {
                    no: null,
                    disableSeat: false,
                    isSelect: false
                }));
            }

            this.disableSeatSeat.forEach((selectItem) => {
                const seatItem = this.seatChartNo[selectItem.column - 1].seat.find((x) => x.no === selectItem.seat);
                if (seatItem !== undefined) {
                    seatItem.disableSeat = true;
                }
            });
        });
    }

    /**
     * changeSeat
     * @param column column
     * @param seat seat
     * @param seat.no seat.no
     * @param seat.disableSeat seat.disableSeat
     * @param seat.isSelect seat.isSelect
     */
    changeSeat(column: number, seat: { no: number | null, disableSeat: boolean, isSelect: boolean }) {
        if (seat.no === null) {
            return;
        }

        const seatIndex = this.seatChartNo[column - 1].seat.findIndex((item) => item.no === seat.no);
        if (seat.isSelect === true) {
            this.seatChartNo[column - 1].seat[seatIndex].isSelect = false;
            const index = this.selectSeat.findIndex(
                (item) => item.column === column && item.seat.no === seat.no
            );
            if (index !== -1) {
                this.selectSeat.splice(index, 1);
            }
        } else if (this.selectSeat.length < this.seatCount) {
            this.seatChartNo[column - 1].seat[seatIndex].isSelect = true;
            this.selectSeat.push({
                column,
                seat,
            });
        }
    }

    /**
     * submitSeat
     */
    submitSeat() {
        if (this.selectSeat.length === this.seatCount) {
            this.submitTicket.emit(this.selectSeat);
        }
    }
}
