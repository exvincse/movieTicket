import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { ProductsService } from "./services/products.service";

/**
 * AppComponent
 */
@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet],
    providers: [ProductsService],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss"
})
export class AppComponent {
    title = "Movie-Tick.Feed";
}
