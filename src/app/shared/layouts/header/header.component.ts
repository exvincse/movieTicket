import {
    animate, state, style, transition, trigger
} from "@angular/animations";
import { Component } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { LoginComponent } from "../../../modules/front-platform/login/login.component";
import { StopPropagationDirective } from "../../base/directives/stopPropagation/stop-propagation-directive.directive";

/**
 * HeaderComponent
 */
@Component({
    selector: "app-header",
    standalone: true,
    imports: [FontAwesomeModule, StopPropagationDirective],
    providers: [],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
    animations: [
        trigger("slideInOut", [
            state("slideIn", style({
                height: "*",
                overflow: "hidden"
            })),
            state("slideOut", style({
                height: "0px",
                overflow: "hidden"
            })),
            transition("slideIn <=> slideOut", [
                animate("300ms ease-in-out")
            ])
        ])
    ]
})
export class HeaderComponent {
    /**
     * constructor
     * @param modalService modalService
     */
    constructor(private modalService: NgbModal) { }

    faBars = faBars;
    faTimes = faTimes;
    isShowMobileList = false;
    menuList = [false, false, false];
    isVisible = true;

    /**
     * toggleVisibility
     * @param lv lv
     */
    toggleVisibility(lv: number) {
        this.menuList = this.menuList.map((value, index) => (index === lv ? !value : false));
    }

    /**
     * toggleList
     */
    toggleList() {
        this.isShowMobileList = !this.isShowMobileList;
    }

    /**
     * openLoginDialog
     */
    openLoginDialog() {
        this.isShowMobileList = false;
        this.modalService.open(LoginComponent);
    }
}
