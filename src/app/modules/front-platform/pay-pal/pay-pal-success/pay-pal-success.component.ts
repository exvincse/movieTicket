import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TicketRepositoryService } from "@app/core/api/middleware/ticket/ticket-repository.service";
import { PaypalOrderOutputModel } from "@app/core/models/outputViewModels/paypal/paypal-order-output.model";
import { StopPropagationDirective } from "@app/shared/base/directives/stop-propagation/stop-propagation.directive";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

/**
 * PayPalSuccessComponent
 */
@Component({
    selector: "app-pay-pal-success",
    imports: [CommonModule, RouterModule, FontAwesomeModule, StopPropagationDirective],
    standalone: true,
    templateUrl: "./pay-pal-success.component.html",
    styleUrl: "./pay-pal-success.component.scss"
})
export class PayPalSuccessComponent implements OnInit {
    faCircleCheck = faCircleCheck;

    /**
     * constructor
     * @param route route
     * @param router router
     * @param ticketRepositoryService ticketRepositoryService
     */
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public ticketRepositoryService: TicketRepositoryService,
    ) { }

    orderDetail: PaypalOrderOutputModel = {
        orderId: "",
        status: "",
        amount: "",
        createTime: "",
        link: ""
    };

    /**
     * ngOnInit
     */
    ngOnInit() {
        const token = this.route.snapshot.queryParamMap.get("token");
        if (token) {
            this.ticketRepositoryService.getOrderDetail({ orderId: token }).subscribe((res) => {
                if (res.result !== null) {
                    this.orderDetail = res.result;
                }
            });
        } else {
            this.navigateNoBack("/");
        }
    }

    /**
     * navigateNoBack
     * @param link link
     */
    navigateNoBack(link: string) {
        this.router.navigateByUrl(link, { replaceUrl: true });
    }
}
