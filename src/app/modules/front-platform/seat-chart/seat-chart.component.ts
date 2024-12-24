import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";

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
    seatChartNo: { seat: { no: number | null; disableSeat: boolean, isSelect: boolean }[]; column: number; }[] = [];
    spcialSeat: { seat: number[]; column: number; }[] = [];
    disableSeatSeat: { seat: number; column: number; }[] = [];
    selectSeat: { seat: { no: number | null; disableSeat: boolean, isSelect: boolean }; column: number; }[] = [];

    /**
     * on init
     */
    ngOnInit() {
        this.initSeatNo();
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
                seat: [4, 5, 15, 16],
            },
            {
                column: 2,
                seat: [4, 5, 15, 16],
            },
            {
                column: 3,
                seat: [4, 5, 15, 16],
            },
            {
                column: 4,
                seat: [4, 5, 15, 16],
            },
            {
                column: 5,
                seat: [4, 5, 15, 16],
            },
            {
                column: 6,
                seat: [4, 5, 15, 16],
            },
            {
                column: 7,
                seat: [4, 5, 15, 16],
            },
            {
                column: 8,
                seat: [4, 5, 15, 16],
            },
            {
                column: 9,
                seat: [4, 5, 15, 16],
            }
        ];

        this.disableSeatSeat = [
            {
                seat: 6,
                column: 2
            },
            {
                seat: 4,
                column: 2
            },
            {
                seat: 8,
                column: 3
            }
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
            const spcialSeatItem = this.spcialSeat.find((x) => x.column === item.column);
            if (spcialSeatItem !== undefined) {
                spcialSeatItem.seat.forEach((y) => this.seatChartNo[spcialSeatItem.column - 1].seat.splice(y, 0, {
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
        } else if (this.selectSeat.length < 2) {
            this.seatChartNo[column - 1].seat[seatIndex].isSelect = true;
            this.selectSeat.push({
                column,
                seat,
            });
        }
    }
}
