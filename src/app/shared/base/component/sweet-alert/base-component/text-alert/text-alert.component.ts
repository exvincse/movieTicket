import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import { SweetAlertConfig } from "../../sweet-alert-config";

/**
 * TextAlertComponent
 */
@Component({
    selector: "app-text-alert",
    imports: [CommonModule],
    standalone: true,
    templateUrl: "./text-alert.component.html",
    styleUrl: "./text-alert.component.scss",
})
export class TextAlertComponent {
    /**
     *constructor
     * @param option SweetAlertConfig
     */
    constructor(public option: SweetAlertConfig) { }
}
