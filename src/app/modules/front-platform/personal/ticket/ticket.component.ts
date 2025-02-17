import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";

import { TicketRepositoryService } from "../../../../core/api/middleware/ticket/ticket-repository.service";
import {
    TicketPersonalOutputModel,
    TicketPersonalOutputModelEntity
} from "../../../../core/models/outputViewModels/ticket/ticket-presonal-list-output.model";
import { UserStoreService } from "../../../../store/user/service/user-store.service";

/**
 * TicketComponent
 */
@Component({
    selector: "app-ticket",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./ticket.component.html",
    styleUrl: "./ticket.component.scss"
})
export class TicketComponent implements OnInit {
    /**
     * constructor
     * @param ticketRepositoryService TicketRepositoryService
     * @param userStoreService UserStoreService
     */
    constructor(
        public ticketRepositoryService: TicketRepositoryService,
        public userStoreService: UserStoreService
    ) { }

    userNo = 0;

    ticketPersonalList: TicketPersonalOutputModel[] = [];

    /**
     * ngOnInit
     */
    ngOnInit() {
        this.userStoreService.getUserData().subscribe((res) => {
            if (res !== null && res.userNo !== 0) {
                this.getPersonalTicketList(res.userNo);
            }
        });
    }

    /**
     * 取得個人票券
     * @param userNo 使用者代號
     */
    getPersonalTicketList(userNo: number) {
        this.ticketRepositoryService.getPersonalTicketList({ userNo }).subscribe((res: TicketPersonalOutputModelEntity) => {
            this.ticketPersonalList = res.result;
        });
    }
}
