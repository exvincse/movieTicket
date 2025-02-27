import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { LoadersComponent } from "../../base/component/loaders/loaders.component";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";

/**
 * MainLayoutComponent
 */
@Component({
    selector: "app-main-layout",
    standalone: true,
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        LoadersComponent
    ],
    templateUrl: "./main-layout.component.html",
    styleUrls: ["./main-layout.component.scss"]
})
export class MainLayoutComponent {
}
