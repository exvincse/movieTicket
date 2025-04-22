import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

import { FooterComponent } from "../footer/footer.component";

/**
 * PageNotFoundComponent
 */
@Component({
    selector: "app-page-not-found",
    standalone: true,
    imports: [
        RouterModule,
        FooterComponent,
        FontAwesomeModule
    ],
    templateUrl: "./page-not-found.component.html",
    styleUrl: "./page-not-found.component.scss"
})
export class PageNotFoundComponent {
    faExclamationTriangle = faExclamationTriangle;
}
