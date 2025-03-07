import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { TicketRepositoryService } from "../../../../core/api/middleware/ticket/ticket-repository.service";
import { TicketPersonalListLnputModel } from "../../../../core/models/inputViewModels/ticket/ticket-personal-list-input.model";
import {
    TicketPersonalItem
} from "../../../../core/models/outputViewModels/ticket/ticket-presonal-list-output.model";
import { PagerComponent } from "../../../../shared/base/component/pager/pager.component";
import { UserStoreService } from "../../../../store/user/service/user-store.service";

/**
 * TicketComponent
 */
@Component({
    selector: "app-ticket",
    standalone: true,
    imports: [
        CommonModule,
        PagerComponent
    ],
    templateUrl: "./ticket.component.html",
    styleUrl: "./ticket.component.scss"
})
export class TicketComponent implements OnInit {
    /**
     * constructor
     * @param ticketRepositoryService TicketRepositoryService
     * @param userStoreService UserStoreService
     * @param router router
     * @param route activatedRoute
     */
    constructor(
        public ticketRepositoryService: TicketRepositoryService,
        public userStoreService: UserStoreService,
        public router: Router,
        public route: ActivatedRoute,
    ) {
        this.sub = this.route.queryParams.subscribe((params: any) => {
            if (this.userNo === 0) return;
            this.nowPage = parseInt(params.page, 10) || 1;
            const param = {
                userNo: this.userNo,
                pageIndex: this.nowPage,
                pageSize: this.pageSize
            };
            this.getPersonalTicketList(param);
        });
    }

    userNo = 0;

    total = 0;

    nowPage = 1;

    pageSize = 10;

    sub: Subscription;

    ticketPersonalList: TicketPersonalItem[] = [];

    /**
     * ngOnInit
     */
    ngOnInit() {
        this.userStoreService.getUserData().subscribe((res) => {
            if (res !== null && res.userNo !== 0) {
                this.userNo = res.userNo;
                const param = {
                    userNo: this.userNo,
                    pageIndex: this.nowPage,
                    pageSize: this.pageSize
                };

                this.getPersonalTicketList(param);
            }
        });
    }

    /**
     * 取得個人票券
     * @param param param
     */
    getPersonalTicketList(param: TicketPersonalListLnputModel) {
        this.ticketRepositoryService.getPersonalTicketList(param).subscribe((res) => {
            this.ticketPersonalList = res.result.result;
            this.total = res.result.totalPage;
            this.nowPage = res.result.pageIndex;
            this.pageSize = res.result.pageSize;
        });
    }

    /**
     * changePageEmitter
     * @param page page
     */
    changePageEmitter(page: number) {
        this.nowPage = page;
        this.router.navigate(["./"], {
            relativeTo: this.route,
            queryParams: {
                page
            }
        });
    }
}
