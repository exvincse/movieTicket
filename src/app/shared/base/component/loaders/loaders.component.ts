import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Observable } from "rxjs";

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
    isLoading = new Observable<boolean>();

    /**
     * constructor
     * @param loaderService loaderService
     */
    constructor(public loaderService: LoaderService) {
        this.isLoading = loaderService.loading$;
    }
}
