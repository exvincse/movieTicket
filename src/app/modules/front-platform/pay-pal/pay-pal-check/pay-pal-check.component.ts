import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { TicketRepositoryService } from "../../../../core/api/middleware/ticket/ticket-repository.service";

/**
 * PayPalCheckComponent
 */
@Component({
    selector: "app-pay-pal-check",
    imports: [],
    standalone: true,
    templateUrl: "./pay-pal-check.component.html",
    styleUrl: "./pay-pal-check.component.scss"
})
export class PayPalCheckComponent implements OnInit {
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

    /**
     * ngOnInit
     */
    ngOnInit() {
        const token = this.route.snapshot.queryParamMap.get("token");
        this.ticketRepositoryService.postSuccessOrder({ token }).subscribe((res) => {
            if (res.result === true) {
                this.router.navigate(["/paypal-success"]);
            } else {
                this.router.navigate(["/paypal-error"]);
            }
        });
    }
}
