import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TextAlertComponent } from "@app/shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Subscription } from "rxjs";

import { TicketRepositoryService } from "../../../../core/api/middleware/ticket/ticket-repository.service";
import { TicketPersonalListLnputModel } from "../../../../core/models/inputViewModels/ticket/ticket-personal-list-input.model";
import {
    TicketPersonalItem
} from "../../../../core/models/outputViewModels/ticket/ticket-presonal-list-output.model";
import { PagerComponent } from "../../../../shared/base/component/pager/pager.component";
import { StopPropagationDirective } from "../../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";
import { UserStoreService } from "../../../../store/user/service/user-store.service";

/**
 * TicketComponent
 */
@Component({
    selector: "app-ticket",
    standalone: true,
    imports: [
        CommonModule,
        FontAwesomeModule,
        PagerComponent,
        StopPropagationDirective
    ],
    templateUrl: "./ticket.component.html",
    styleUrl: "./ticket.component.scss"
})
export class TicketComponent implements OnInit {
    /**
     * constructor
     * @param ticketRepositoryService TicketRepositoryService
     * @param userStoreService UserStoreService
     * @param sweetAlertService SweetAlertService
     * @param router router
     * @param route activatedRoute
     */
    constructor(
        public ticketRepositoryService: TicketRepositoryService,
        public userStoreService: UserStoreService,
        public sweetAlertService: SweetAlertService,
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

    faChevronDown = faChevronDown;
    faChevronUp = faChevronUp;

    userNo = 0;

    total = 0;

    nowPage = 1;

    pageSize = 10;

    sub: Subscription;

    ticketPersonalList: TicketPersonalItem[] = [];

    menuList: boolean[] = [];

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
            this.menuList = res.result.result.map((item) => !item);
            this.ticketPersonalList = res.result.result;
            this.total = res.result.totalPage;
            this.nowPage = res.result.pageIndex;
            this.pageSize = res.result.pageSize;
        });
    }

    /**
     * toggleVisibility
     * @param lv lv
     */
    toggleVisibility(lv: number) {
        this.menuList = this.menuList.map((value, index) => (index === lv ? !value : false));
    }

    /**
     * getPayPalLink
     * @param orderId orderId
     */
    getPayPalLink(orderId: string) {
        this.ticketRepositoryService.getOrderDetail({ orderId }).subscribe((res) => {
            if (res.result !== "") {
                window.location.href = res.result;
            } else {
                this.sweetAlertService.open(TextAlertComponent, {
                    icon: "error",
                    data: {
                        text: res.message
                    }
                });
            }
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
