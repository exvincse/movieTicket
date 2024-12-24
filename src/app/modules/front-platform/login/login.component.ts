import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { StopPropagationDirective } from "../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";

/**
 * LoginComponent
 */
@Component({
    selector: "app-login",
    standalone: true,
    imports: [StopPropagationDirective],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss"
})
export class LoginComponent {
    /**
     * constructor
     * @param activeModal NgbActiveModal
     */
    constructor(public activeModal: NgbActiveModal) { }

    /**
     * close
     */
    close() {
        this.activeModal.close();
    }
}
