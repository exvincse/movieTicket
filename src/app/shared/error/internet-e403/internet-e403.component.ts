import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

/**
 * 403 錯誤頁面
 */
@Component({
    selector: "app-internet-e403",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./internet-e403.component.html",
    styleUrls: ["./internet-e403.component.scss"]
})
export class InternetE403Component {
    /**
     * closeDialog
     */
    closeDialog() {
        console.log(123);
    }
}
