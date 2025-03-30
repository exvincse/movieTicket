import { CommonModule } from "@angular/common";
import {
    Component, EventEmitter, Input, OnInit, Output
} from "@angular/core";
import { TicketCategoryCountEntity } from "@app/core/models/entities/ticket/ticket-category-entity";

import {
    Seat, SeatChart, SpcialSeat
} from "../../../core/models/entities/ticket/ticket-select.entity";
import { StopPropagationDirective } from "../../../shared/base/directives/stop-propagation/stop-propagation.directive";

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
    @Input() ticketCategory: TicketCategoryCountEntity[] = [];
    @Input() disableSeatSeat: Seat[] = [];
    @Output() submitTicket = new EventEmitter<any>();

    seatChart: SeatChart[] = [];
    spcialSeat: SpcialSeat[] = [];
    selectSeat: Seat[] = [];

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
        return this.ticketCategory.map((item) => item.count).reduce((a, b) => a + b, 0);
    }

    /**
     * initSeatNo
     */
    initSeatNo() {
        const column = 10;
        let maxRowSeat = 17;
        this.seatChart = [];

        this.spcialSeat = [
            {
                column: 1,
                seat: 5,
                insertCount: 2
            },
            {
                column: 1,
                seat: 14,
                insertCount: 2
            },
            {
                column: 2,
                seat: 5,
                insertCount: 2
            },
            {
                column: 2,
                seat: 14,
                insertCount: 2
            },
            {
                column: 3,
                seat: 5,
                insertCount: 2
            },
            {
                column: 3,
                seat: 14,
                insertCount: 2
            },
            {
                column: 4,
                seat: 5,
                insertCount: 2
            },
            {
                column: 4,
                seat: 14,
                insertCount: 2
            },
            {
                column: 5,
                seat: 5,
                insertCount: 2
            },
            {
                column: 5,
                seat: 14,
                insertCount: 2
            },
            {
                column: 6,
                seat: 5,
                insertCount: 2
            },
            {
                column: 6,
                seat: 14,
                insertCount: 2
            },
            {
                column: 7,
                seat: 5,
                insertCount: 2
            },
            {
                column: 7,
                seat: 14,
                insertCount: 2
            },
            {
                column: 8,
                seat: 5,
                insertCount: 2
            },
            {
                column: 8,
                seat: 14,
                insertCount: 2
            },
            {
                column: 9,
                seat: 5,
                insertCount: 2
            },
            {
                column: 9,
                seat: 14,
                insertCount: 2
            }
        ];

        for (let i = 1; i <= column; i += 1) {
            if (i === column) {
                maxRowSeat = 21;
            }

            for (let j = 1; j <= maxRowSeat; j += 1) {
                // 無法選取座位
                let isDisable = false;
                const disableSeatSeatItem = this.disableSeatSeat.find((x) => x.column === i && x.seat === j);
                if (disableSeatSeatItem !== undefined) {
                    isDisable = true;
                }

                // 走道
                const spcialSeatItem = this.spcialSeat.find((x) => x.column === i && x.seat === j);
                if (spcialSeatItem !== undefined) {
                    for (let x = 1; x <= spcialSeatItem.insertCount; x += 1) {
                        this.seatChart.push({
                            column: i,
                            seat: null,
                            state: {
                                disableSeat: false,
                                isSelect: false,
                                isFirstSeat: j === 1,
                                isLastSeat: j === maxRowSeat
                            }
                        });
                    }
                }

                this.seatChart.push({
                    column: i,
                    seat: j,
                    state: {
                        disableSeat: isDisable,
                        isSelect: false,
                        isFirstSeat: j === 1,
                        isLastSeat: j === maxRowSeat
                    }
                });
            }
        }
    }

    /**
     * changeSeat
     * @param index index
     */
    changeSeat(index: number) {
        const seatChartItem = this.seatChart[index];
        if (seatChartItem.seat === null) {
            return;
        }

        if (seatChartItem.state.isSelect === true) {
            this.seatChart[index].state.isSelect = false;
            const selectSeatIndex = this.selectSeat.findIndex(
                (item) => item.column === seatChartItem.column && item.seat === seatChartItem.seat
            );

            if (selectSeatIndex !== -1) {
                this.selectSeat.splice(selectSeatIndex, 1);
            }
        } else if (this.selectSeat.length < this.seatCount) {
            this.seatChart[index].state.isSelect = true;
            this.selectSeat.push({
                column: seatChartItem.column,
                seat: seatChartItem.seat
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
