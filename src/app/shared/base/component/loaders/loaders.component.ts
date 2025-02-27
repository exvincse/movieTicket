import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

import { LoaderService } from "../../../../services/loader/loader.service";

/**
 * LoadersComponent
 */
@Component({
    selector: "app-loaders",
    imports: [CommonModule],
    standalone: true,
    templateUrl: "./loaders.component.html",
    styleUrl: "./loaders.component.scss"
})
export class LoadersComponent {
    isLoading = false;

    /**
     * constructor
     * @param loaderService loaderService
     */
    constructor(public loaderService: LoaderService) {
        // 監聽loading狀態
        this.loaderService.loading$.subscribe((loading) => {
            this.isLoading = loading;
        });
    }
}
